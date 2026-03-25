/**
 * Simple open/closed parser for resource hours text.
 * Conservative — returns "unknown" for anything it can't confidently parse.
 * All times evaluated in America/Chicago (Springfield, MO).
 */

type HoursStatus = "open" | "closed" | "unknown";

/** Map day abbreviations/names to 0-6 (Sun-Sat) index */
const DAY_MAP: Record<string, number> = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tues: 2, tuesday: 2,
  wed: 3, wednesday: 3,
  thu: 4, thurs: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6,
};

/** Parse a time string like "9:00 AM", "5:00 PM", "Noon", "Midnight" into minutes since midnight */
function parseTime(raw: string): number | null {
  const t = raw.trim().toLowerCase();

  if (t === "noon" || t === "12:00 pm" || t === "12 pm") return 720;
  if (t === "midnight" || t === "12:00 am" || t === "12 am") return 0;

  // Match "9:00 AM", "5:00PM", "9 AM", "10:30 pm"
  const match = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3];

  if (hours < 1 || hours > 12) return null;
  if (minutes < 0 || minutes > 59) return null;

  if (period === "am" && hours === 12) hours = 0;
  if (period === "pm" && hours !== 12) hours += 12;

  return hours * 60 + minutes;
}

/** Expand a day range like "Mon-Fri" into an array of day indices */
function parseDayRange(raw: string): number[] | null {
  const r = raw.trim().toLowerCase();

  if (r === "daily" || r === "every day" || r === "everyday") {
    return [0, 1, 2, 3, 4, 5, 6];
  }

  // Single day: "Monday"
  if (DAY_MAP[r] !== undefined) return [DAY_MAP[r]];

  // Range: "Mon-Fri", "Monday-Friday"
  const rangeMatch = r.match(/^(\w+)\s*[-–]\s*(\w+)$/);
  if (!rangeMatch) return null;

  const start = DAY_MAP[rangeMatch[1]];
  const end = DAY_MAP[rangeMatch[2]];
  if (start === undefined || end === undefined) return null;

  const days: number[] = [];
  let i = start;
  while (true) {
    days.push(i);
    if (i === end) break;
    i = (i + 1) % 7;
  }
  return days;
}

/**
 * Determine if a resource is currently open, closed, or unknown
 * based on its hours text string.
 */
export function getHoursStatus(hoursText: string | null | undefined): HoursStatus {
  if (!hoursText) return "unknown";

  const text = hoursText.trim();
  if (!text) return "unknown";

  // 24/7 — always open
  if (/24\s*\/\s*7/i.test(text)) return "open";

  // Get current time in Chicago timezone
  const now = new Date();
  const chicagoTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
  const currentDay = chicagoTime.getDay(); // 0=Sun
  const currentMinutes = chicagoTime.getHours() * 60 + chicagoTime.getMinutes();

  // Try to parse pattern: "DayRange TimeStart - TimeEnd"
  // Examples: "Mon-Fri 9:00 AM - 5:00 PM", "Daily Noon - 1:00 PM"
  const scheduleMatch = text.match(
    /^([\w\s]+[-–][\w\s]+|daily|every\s*day|everyday|monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|tues|wed|thu|thurs|fri|sat|sun)\s+(.+?)\s*[-–]\s*(.+)$/i
  );

  if (!scheduleMatch) return "unknown";

  const days = parseDayRange(scheduleMatch[1]);
  if (!days) return "unknown";

  const openTime = parseTime(scheduleMatch[2]);
  const closeTime = parseTime(scheduleMatch[3]);
  if (openTime === null || closeTime === null) return "unknown";

  // Check if current day is in the range
  if (!days.includes(currentDay)) return "closed";

  // Check if current time is within open hours
  if (currentMinutes >= openTime && currentMinutes < closeTime) return "open";

  return "closed";
}
