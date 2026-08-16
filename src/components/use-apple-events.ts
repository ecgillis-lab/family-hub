"use client";

import { useEffect, useState } from "react";
import { eventOccursOn } from "@/lib/dates";
import type { AppleEvent } from "@/lib/ics";

export function useAppleEvents(dateKey: string): {
  events: AppleEvent[];
  error: string;
} {
  const [events, setEvents] = useState<AppleEvent[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch("/api/apple-events", { cache: "no-store" });
      const data = (await res.json()) as { events?: AppleEvent[]; error?: string };
      if (cancelled) return;
      setEvents(data.events ?? []);
      setError(data.error ?? "");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    events: events.filter((event) => eventOccursOn(event, dateKey)),
    error,
  };
}

export function useAppleWeek(dateKeys: string[]): {
  events: AppleEvent[];
  error: string;
  countOn: (dateKey: string) => number;
} {
  const [events, setEvents] = useState<AppleEvent[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch("/api/apple-events", { cache: "no-store" });
      const data = (await res.json()) as { events?: AppleEvent[]; error?: string };
      if (cancelled) return;
      setEvents(data.events ?? []);
      setError(data.error ?? "");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    events,
    error,
    countOn: (dateKey: string) =>
      events.filter((event) => eventOccursOn(event, dateKey)).length,
  };
}
