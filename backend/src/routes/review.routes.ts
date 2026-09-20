import { Router } from "express";
import { ReviewService } from "../services/review.service.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { createReviewSchema, updateReviewSchema, reviewFiltersSchema } from "@tavo/shared";

const router = Router();
const reviewService = new ReviewService();

router.use(authenticate);

// NOTE: Specific routes MUST come before /:id routes
router.get("/stats", async (req, res, next) => {
  try {
    const stats = await reviewService.getStats(req.user!.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get("/weekly", async (req, res, next) => {
  try {
    const stats = await reviewService.getWeeklyStats(req.user!.id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get("/", validate(reviewFiltersSchema), async (req, res, next) => {
  try {
    const filters = req.query as any;
    const result = await reviewService.getReviews(filters, req.user!.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", validate(createReviewSchema), async (req, res, next) => {
  try {
    const result = await reviewService.createReview(req.user!.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validate(updateReviewSchema), async (req, res, next) => {
  try {
    const result = await reviewService.updateReview(req.params.id, req.user!.id, req.user!.roles.includes("admin"), req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await reviewService.deleteReview(req.params.id, req.user!.id, req.user!.roles.includes("admin"));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
