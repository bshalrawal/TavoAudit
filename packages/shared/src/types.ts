// ============================================
// Tavo Review Tracker — Shared Types
// ============================================

// Video type enum
export const VIDEO_TYPES = ["team", "individual", "heatmap"] as const;
export type VideoType = (typeof VIDEO_TYPES)[number];

export const VIDEO_TYPE_LABELS: Record<VideoType, string> = {
  team: "Team",
  individual: "Individual",
  heatmap: "HeatMap",
};

// User roles
export const ROLES = ["reviewer", "admin"] as const;
export type Role = (typeof ROLES)[number];

// ---- User ----
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  roles: Role[];
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

// ---- Review ----
export interface Review {
  id: string;
  reviewerId: string;
  dateReviewed: string; // ISO date string
  durationMinutes: number;
  videoType: VideoType;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewWithReviewer extends Review {
  reviewer: Pick<User, "id" | "name" | "email" | "avatarUrl">;
}

// ---- API Request/Response Types ----
export interface CreateReviewRequest {
  dateReviewed: string;
  durationMinutes: number;
  videoType: VideoType;
  notes?: string;
}

export interface UpdateReviewRequest {
  dateReviewed?: string;
  durationMinutes?: number;
  videoType?: VideoType;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ReviewFilters {
  page?: number;
  pageSize?: number;
  sortBy?: "dateReviewed" | "durationMinutes" | "videoType" | "createdAt";
  sortOrder?: "asc" | "desc";
  videoType?: VideoType;
  dateFrom?: string;
  dateTo?: string;
  reviewerId?: string;
  search?: string;
}

// ---- Stats ----
export interface ReviewStats {
  totalEntries: number;
  totalMinutes: number;
  totalHours: number;
  byType: Record<VideoType, { count: number; minutes: number }>;
}

export interface AdminStats extends ReviewStats {
  activeReviewers: number;
  recentEntries: ReviewWithReviewer[];
}

// ---- Week Range ----
export interface WeekRange {
  start: string; // ISO date string (Saturday)
  end: string;   // ISO date string (Friday)
  label: string;
}

// ---- User Management ----
export interface UpdateUserRoleRequest {
  roles: Role[];
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

// ---- Export ----
export interface ExportRequest {
  dateFrom?: string;
  dateTo?: string;
  reviewerId?: string;
  format?: "csv";
}

// ---- Auth ----
export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}
