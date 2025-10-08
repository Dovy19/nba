import { format, formatDistanceToNow } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { TIMEZONE } from './constants';

/**
 * Format a date as "Oct 15, 2025 at 3:45 PM"
 */
export function formatTimestamp(date: Date): string {
  const zonedDate = toZonedTime(date, TIMEZONE);
  return format(zonedDate, "MMM dd, yyyy 'at' h:mm a");
}

/**
 * Check if current time is before the deadline
 */
export function isBeforeDeadline(deadline: Date): boolean {
  return new Date() < deadline;
}

/**
 * Format relative time like "2 days ago"
 */
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}