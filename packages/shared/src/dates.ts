// ============================================
// Tavo Review Tracker — Date Utilities
// Saturday-to-Friday week boundaries
// ============================================

import type { WeekRange } from "./types.js";

/**
 * Get the Saturday-to-Friday week range containing a given date.
 * @param date - Target date (defaults to now)
 * @returns WeekRange with ISO date strings for Saturday and Friday
 */
export function getWeekRange(date: Date = new Date()): WeekRange {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // Calculate days since last Saturday
  // If today is Saturday (6), daysSinceSat = 0
  // If today is Sunday (0), daysSinceSat = 1
  // If today is Friday (5), daysSinceSat = 6
  const daysSinceSat = day === 6 ? 0 : day + 1;

  // Saturday (start of week)
  const start = new Date(d);
  start.setUTCDate(d.getUTCDate() - daysSinceSat);
  start.setUTCHours(0, 0, 0, 0);

  // Friday (end of week)
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
    label: formatWeekLabel(start, end),
  };
}

/**
 * Get N past week ranges (most recent first).
 */
export function getPastWeeks(count: number = 12): WeekRange[] {
  const weeks: WeekRange[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i * 7);
    weeks.push(getWeekRange(d));
  }

  // Deduplicate (in case multiple days map to same week)
  const seen = new Set<string>();
  return weeks.filter((w) => {
    const key = w.start;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Format a week label like "Sep 20 – Sep 26, 2026"
 */
function formatWeekLabel(start: Date, end: Date): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const sm = months[start.getUTCMonth()];
  const sd = start.getUTCDate();
  const em = months[end.getUTCMonth()];
  const ed = end.getUTCDate();
  const ey = end.getUTCFullYear();

  if (sm === em) {
    return `${sm} ${sd} – ${ed}, ${ey}`;
  }
  return `${sm} ${sd} – ${em} ${ed}, ${ey}`;
}

/**
 * Convert hours, minutes, seconds to total minutes (rounded up).
 */
export function toTotalMinutes(hours: number, minutes: number, seconds: number): number {
  return Math.ceil(hours * 60 + minutes + seconds / 60);
}

/**
 * Format minutes as "Xh Ym" display string.
 */
export function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
