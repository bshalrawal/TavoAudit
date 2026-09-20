import { prisma } from "../utils/prisma.js";
import { CreateReviewInput, UpdateReviewInput, ReviewFiltersInput, VideoType, ReviewStats, getWeekRange } from "@tavo/shared";

export class ReviewService {
  async getReviews(filters: ReviewFiltersInput, userId?: string) {
    const { page = 1, pageSize = 20, sortBy = "dateReviewed", sortOrder = "desc", videoType, dateFrom, dateTo, search, reviewerId } = filters;
    
    const where: any = {};
    
    if (userId) {
      where.reviewerId = userId;
    } else if (reviewerId) {
      where.reviewerId = reviewerId;
    }

    if (videoType) {
      where.videoType = videoType;
    }

    if (dateFrom || dateTo) {
      where.dateReviewed = {};
      if (dateFrom) where.dateReviewed.gte = new Date(dateFrom + "T00:00:00Z");
      if (dateTo) where.dateReviewed.lte = new Date(dateTo + "T23:59:59Z");
    }

    if (search) {
      where.notes = {
        contains: search,
        mode: "insensitive",
      };
    }

    const total = await prisma.review.count({ where });
    const data = await prisma.review.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          }
        }
      }
    });

    return {
      data: data.map(r => ({
        ...r,
        dateReviewed: r.dateReviewed.toISOString().split("T")[0],
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        videoType: r.videoType as VideoType,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async createReview(userId: string, data: CreateReviewInput) {
    const review = await prisma.review.create({
      data: {
        reviewerId: userId,
        dateReviewed: new Date(data.dateReviewed + "T12:00:00Z"),
        durationMinutes: data.durationMinutes,
        videoType: data.videoType,
        notes: data.notes,
      },
    });

    return {
      ...review,
      dateReviewed: review.dateReviewed.toISOString().split("T")[0],
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
      videoType: review.videoType as VideoType,
    };
  }

  async updateReview(id: string, userId: string, isAdmin: boolean, data: UpdateReviewInput) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) throw { status: 404, message: "Review not found" };
    if (!isAdmin && review.reviewerId !== userId) throw { status: 403, message: "Forbidden" };

    const updateData: any = { ...data };
    if (data.dateReviewed) {
      updateData.dateReviewed = new Date(data.dateReviewed + "T12:00:00Z");
    }

    const updated = await prisma.review.update({
      where: { id },
      data: updateData,
    });

    return {
      ...updated,
      dateReviewed: updated.dateReviewed.toISOString().split("T")[0],
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      videoType: updated.videoType as VideoType,
    };
  }

  async deleteReview(id: string, userId: string, isAdmin: boolean) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) throw { status: 404, message: "Review not found" };
    if (!isAdmin && review.reviewerId !== userId) throw { status: 403, message: "Forbidden" };

    await prisma.review.delete({ where: { id } });
    return { success: true };
  }

  async getStats(reviewerId?: string): Promise<ReviewStats> {
    const where = reviewerId ? { reviewerId } : {};
    
    const reviews = await prisma.review.findMany({ where });
    
    const stats: ReviewStats = {
      totalEntries: reviews.length,
      totalMinutes: 0,
      totalHours: 0,
      byType: {
        team: { count: 0, minutes: 0 },
        individual: { count: 0, minutes: 0 },
        heatmap: { count: 0, minutes: 0 },
      },
    };

    reviews.forEach(r => {
      stats.totalMinutes += r.durationMinutes;
      const type = r.videoType as VideoType;
      if (stats.byType[type]) {
        stats.byType[type].count++;
        stats.byType[type].minutes += r.durationMinutes;
      }
    });

    stats.totalHours = Math.round((stats.totalMinutes / 60) * 10) / 10;
    
    return stats;
  }

  async getWeeklyStats(reviewerId: string) {
    const { start, end, label } = getWeekRange(new Date());
    
    const reviews = await prisma.review.findMany({
      where: {
        reviewerId,
        dateReviewed: {
          gte: new Date(start + "T00:00:00Z"),
          lte: new Date(end + "T23:59:59Z"),
        }
      }
    });
    
    const stats = {
      label,
      totalMinutes: 0,
      totalHours: 0,
      byType: {
        team: { count: 0, minutes: 0 },
        individual: { count: 0, minutes: 0 },
        heatmap: { count: 0, minutes: 0 },
      },
    };

    reviews.forEach(r => {
      stats.totalMinutes += r.durationMinutes;
      const type = r.videoType as VideoType;
      if (stats.byType[type]) {
        stats.byType[type].count++;
        stats.byType[type].minutes += r.durationMinutes;
      }
    });

    stats.totalHours = Math.round((stats.totalMinutes / 60) * 10) / 10;
    
    return stats;
  }
}
