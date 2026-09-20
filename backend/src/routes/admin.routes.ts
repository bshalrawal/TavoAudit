import { Router } from "express";
import { ReviewService } from "../services/review.service.js";
import { UserService } from "../services/user.service.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { reviewFiltersSchema, updateReviewSchema, updateUserRoleSchema, updateUserStatusSchema, AdminStats, VideoType } from "@tavo/shared";
import { prisma } from "../utils/prisma.js";

const router = Router();
const reviewService = new ReviewService();
const userService = new UserService();

router.use(authenticate, requireRole("admin"));

// ---- Reviews ----

router.get("/reviews", validate(reviewFiltersSchema), async (req, res, next) => {
  try {
    const filters = req.query as any;
    const result = await reviewService.getReviews(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/reviews/:id", validate(updateReviewSchema), async (req, res, next) => {
  try {
    const result = await reviewService.updateReview(req.params.id, req.user!.id, true, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/reviews/:id", async (req, res, next) => {
  try {
    const result = await reviewService.deleteReview(req.params.id, req.user!.id, true);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ---- Stats ----

router.get("/stats", async (req, res, next) => {
  try {
    const baseStats = await reviewService.getStats();
    
    // active reviewers
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 30);
    
    const activeReviewersCount = await prisma.review.groupBy({
      by: ["reviewerId"],
      where: {
        dateReviewed: { gte: recentDate }
      },
    });

    const recentEntries = await prisma.review.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        reviewer: {
          select: { id: true, name: true, email: true, avatarUrl: true }
        }
      }
    });

    const adminStats: AdminStats = {
      ...baseStats,
      activeReviewers: activeReviewersCount.length,
      recentEntries: recentEntries.map(r => ({
        ...r,
        dateReviewed: r.dateReviewed.toISOString().split("T")[0],
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        videoType: r.videoType as VideoType,
      })),
    };

    res.json(adminStats);
  } catch (error) {
    next(error);
  }
});

// ---- Users ----

router.get("/users", async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.put("/users/:id/role", validate(updateUserRoleSchema), async (req, res, next) => {
  try {
    const result = await userService.updateUserRole(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/users/:id/status", validate(updateUserStatusSchema), async (req, res, next) => {
  try {
    const result = await userService.updateUserStatus(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
