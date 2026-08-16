import { toDateKey } from "./dates";

export type AppleEvent = {
  id: string;
  title: string;
  date: string;
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
  location: string;
  repeatDays: number[];
  until: string | null;
};

const BYDAY: Record<string, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

function unfold(raw: string): string[] {
  const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines: string[] = [];
  for (const line of text.split("\n")) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && lines.length > 0) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
}

function unescape(value: string): string {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function parseStamp(
  value: string,
  params: string,
): { date: string; time: string | null; allDay: boolean } {
  const isDate = /VALUE=DATE/i.test(params) || /^\d{8}$/.test(value);
  const compact = value.replace(/[-:]/g, "");
  if (isDate || /^\d{8}$/.test(compact)) {
    const day = compact.slice(0, 8);
    return {
      date: `${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6, 8)}`,
      time: null,
      allDay: true,
    };
  }
  const match = compact.match(/^(\d{8})T(\d{6})(Z)?$/);
  if (!match) {
    return { date: toDateKey(new Date()), time: null, allDay: true };
  }
  const [, day, time, zulu] = match;
  const year = Number(day.slice(0, 4));
  const month = Number(day.slice(4, 6));
  const date = Number(day.slice(6, 8));
  const hour = Number(time.slice(0, 2));
  const minute = Number(time.slice(2, 4));
  if (zulu) {
    const utc = new Date(Date.UTC(year, month - 1, date, hour, minute));
    return {
      date: toDateKey(utc),
      time: `${String(utc.getHours()).padStart(2, "0")}:${String(utc.getMinutes()).padStart(2, "0")}`,
      allDay: false,
    };
  }
  return {
    date: `${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6, 8)}`,
    time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    allDay: false,
  };
}

function weeklyDays(rrule: string): number[] {
  if (!/FREQ=WEEKLY/i.test(rrule)) return [];
  const dayMatch = rrule.match(/BYDAY=([^;]+)/i);
  if (!dayMatch) return [];
  return dayMatch[1]
    .split(",")
    .map((token) => BYDAY[token.replace(/^-?\d+/, "").trim().toUpperCase()])
    .filter((day): day is number => day !== undefined);
}

function untilDate(rrule: string): string | null {
  const match = rrule.match(/UNTIL=([^;]+)/i);
  if (!match) return null;
  return parseStamp(match[1], "").date;
}

export function parseIcs(raw: string): AppleEvent[] {
  const events: AppleEvent[] = [];
  let current: Record<string, { params: string; value: string }> | null = null;

  const commit = () => {
    if (!current) return;
    const startRaw = current.DTSTART;
    if (!startRaw) {
      current = null;
      return;
    }
    const start = parseStamp(startRaw.value, startRaw.params);
    const end = current.DTEND
      ? parseStamp(current.DTEND.value, current.DTEND.params)
      : null;
    const rrule = current.RRULE?.value ?? "";
    const title = unescape(current.SUMMARY?.value ?? "Busy");
    const uid = current.UID?.value ?? `${title}-${start.date}-${start.time ?? "all"}`;
    events.push({
      id: `apple-${uid}`,
      title,
      date: start.date,
      allDay: start.allDay,
      startTime: start.allDay ? null : start.time,
      endTime: start.allDay ? null : (end?.time ?? null),
      location: unescape(current.LOCATION?.value ?? ""),
      repeatDays: weeklyDays(rrule),
      until: untilDate(rrule),
    });
    current = null;
  };

  for (const line of unfold(raw)) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      commit();
      continue;
    }
    if (!current) continue;
    const split = line.indexOf(":");
    if (split < 0) continue;
    const meta = line.slice(0, split);
    const value = line.slice(split + 1);
    const [name, ...paramParts] = meta.split(";");
    current[name.toUpperCase()] = {
      params: paramParts.join(";"),
      value,
    };
  }

  return events;
}

export function normalizeCalendarUrl(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith("webcal://")) return `https://${trimmed.slice("webcal://".length)}`;
  return trimmed;
}
