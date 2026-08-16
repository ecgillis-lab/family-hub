import { readDb } from "./db";
import { normalizeCalendarUrl, parseIcs, type AppleEvent } from "./ics";

type Cache = {
  url: string;
  at: number;
  events: AppleEvent[];
  error: string;
};

let cache: Cache | null = null;
const TTL_MS = 5 * 60 * 1000;

export async function loadAppleEvents(): Promise<{ events: AppleEvent[]; error: string }> {
  const db = await readDb();
  const url = db.appleCalendarUrl?.trim() ?? "";
  if (!url) return { events: [], error: "" };

  if (cache && cache.url === url && Date.now() - cache.at < TTL_MS) {
    return { events: cache.events, error: cache.error };
  }

  const href = normalizeCalendarUrl(url);
  if (!/^https?:\/\//i.test(href)) {
    return { events: [], error: "That link needs to start with https:// or webcal://" };
  }

  try {
    const res = await fetch(href, {
      cache: "no-store",
      headers: { Accept: "text/calendar, text/plain, */*" },
      redirect: "follow",
    });
    if (!res.ok) {
      const error = "Could not read that Apple Calendar link. Check that Public Calendar is on.";
      cache = { url, at: Date.now(), events: [], error };
      return { events: [], error };
    }
    const text = await res.text();
    if (!/BEGIN:VCALENDAR/i.test(text)) {
      const error = "That link did not look like a calendar file.";
      cache = { url, at: Date.now(), events: [], error };
      return { events: [], error };
    }
    const events = parseIcs(text);
    cache = { url, at: Date.now(), events, error: "" };
    return { events, error: "" };
  } catch {
    const error = "Could not reach Apple Calendar. Check the link and your internet connection.";
    cache = { url, at: Date.now(), events: [], error };
    return { events: [], error };
  }
}

export function clearAppleCache(): void {
  cache = null;
}
