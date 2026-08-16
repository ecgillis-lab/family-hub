const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfWeek(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

export function weekKeys(anchor: Date): string[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => toDateKey(addDays(start, i)));
}

export function weekdayShort(key: string): string {
  return WEEKDAYS[parseDateKey(key).getDay()] ?? "";
}

export function weekdayLong(key: string): string {
  return WEEKDAYS_LONG[parseDateKey(key).getDay()] ?? "";
}

export function monthDay(key: string): string {
  const date = parseDateKey(key);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function weekRangeLabel(keys: string[]): string {
  if (keys.length === 0) return "";
  const start = parseDateKey(keys[0]);
  const end = parseDateKey(keys[keys.length - 1]);
  if (start.getMonth() === end.getMonth()) {
    return `${MONTHS[start.getMonth()]} ${start.getDate()}–${end.getDate()}`;
  }
  return `${MONTHS[start.getMonth()].slice(0, 3)} ${start.getDate()} – ${MONTHS[end.getMonth()].slice(0, 3)} ${end.getDate()}`;
}

export function formatTime(value: string): string {
  const [hRaw, mRaw] = value.split(":");
  const h = Number(hRaw);
  const m = mRaw ?? "00";
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m === "00" ? `${hour} ${suffix}` : `${hour}:${m} ${suffix}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export const WEEKDAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export function weekdayOf(key: string): number {
  return parseDateKey(key).getDay();
}

export function eventOccursOn(
  event: { date: string; repeatDays?: number[]; until?: string | null },
  dateKey: string,
): boolean {
  const days = event.repeatDays ?? [];
  if (event.until && dateKey > event.until) return false;
  if (days.length === 0) return event.date === dateKey;
  if (dateKey < event.date) return false;
  return days.includes(weekdayOf(dateKey));
}

export function formatRepeat(days: number[]): string {
  const names = [...new Set(days)]
    .sort((a, b) => a - b)
    .map((day) => WEEKDAYS_LONG[day])
    .filter(Boolean);
  if (names.length === 0) return "";
  if (names.length === 1) return `Every ${names[0]}`;
  if (names.length === 2) return `Every ${names[0]} and ${names[1]}`;
  return `Every ${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}
