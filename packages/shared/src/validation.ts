import { z } from "zod";
import { VIDEO_TYPES } from "./types.js";

// ============================================
// Tavo Review Tracker — Shared Validation Schemas
// ============================================

// ---- Review Schemas ----
export const createReviewSchema = z.object({
  dateReviewed: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((val) => {
      const date = new Date(val + "T00:00:00Z");
      const now = new Date();
      now.setUTCHours(23, 59, 59, 999);
      return date <= now;
    }, "Date cannot be in the future"),
  durationMinutes: z
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 minute")
    .max(1440, "Duration cannot exceed 24 hours (1440 minutes)"),
  videoType: z.enum(VIDEO_TYPES, {
    errorMap: () => ({ message: "Video type must be team, individual, or heatmap" }),
  }),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .nullable()
    .transform((val) => val || null),
});

export const updateReviewSchema = z.object({
  dateReviewed: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((val) => {
      const date = new Date(val + "T00:00:00Z");
      const now = new Date();
      now.setUTCHours(23, 59, 59, 999);
      return date <= now;
    }, "Date cannot be in the future")
    .optional(),
  durationMinutes: z
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 minute")
    .max(1440, "Duration cannot exceed 24 hours (1440 minutes)")
    .optional(),
  videoType: z
    .enum(VIDEO_TYPES, {
      errorMap: () => ({ message: "Video type must be team, individual, or heatmap" }),
    })
    .optional(),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .nullable()
    .transform((val) => val || null),
});

// ---- Filter Schemas ----
export const reviewFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z
    .enum(["dateReviewed", "durationMinutes", "videoType", "createdAt"])
    .default("dateReviewed"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  videoType: z.enum(VIDEO_TYPES).optional(),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  reviewerId: z.string().optional(),
  search: z.string().max(100).optional(),
});

// ---- User Role Schema ----
export const updateUserRoleSchema = z.object({
  roles: z
    .array(z.enum(["reviewer", "admin"]))
    .min(1, "User must have at least one role"),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

// ---- Export Schema ----
export const exportSchema = z.object({
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  reviewerId: z.string().optional(),
});

// ---- Inferred Types ----
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewFiltersInput = z.infer<typeof reviewFiltersSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type ExportInput = z.infer<typeof exportSchema>;
