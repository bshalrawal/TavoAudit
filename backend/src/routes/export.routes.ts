import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { exportLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validation.js";
import { exportSchema } from "@tavo/shared";
import { stringify } from "csv-stringify";
import { prisma } from "../utils/prisma.js";

const router = Router();

router.use(authenticate, requireRole("admin"), exportLimiter);

router.get("/export", validate(exportSchema), async (req, res, next) => {
  try {
    const { dateFrom, dateTo, reviewerId } = req.query as any;

    const where: any = {};
    if (reviewerId) where.reviewerId = reviewerId;
    if (dateFrom || dateTo) {
      where.dateReviewed = {};
      if (dateFrom) where.dateReviewed.gte = new Date(dateFrom + "T00:00:00Z");
      if (dateTo) where.dateReviewed.lte = new Date(dateTo + "T23:59:59Z");
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { dateReviewed: "desc" },
      include: {
        reviewer: {
          select: { name: true, email: true },
        },
      },
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="reviews_export.csv"');

    const stringifier = stringify({
      header: true,
      columns: [
        { key: "reviewer", header: "Reviewer" },
        { key: "email", header: "Email" },
        { key: "date", header: "Date" },
        { key: "durationHours", header: "Duration (hours)" },
        { key: "durationMinutes", header: "Duration (minutes)" },
        { key: "type", header: "Type" },
        { key: "notes", header: "Notes" },
      ],
    });

    stringifier.pipe(res);

    for (const review of reviews) {
      stringifier.write({
        reviewer: review.reviewer.name,
        email: review.reviewer.email,
        date: review.dateReviewed.toISOString().split("T")[0],
        durationHours: (review.durationMinutes / 60).toFixed(2),
        durationMinutes: review.durationMinutes,
        type: review.videoType,
        notes: review.notes || "",
      });
    }

    stringifier.end();
  } catch (error) {
    next(error);
  }
});

export default router;
