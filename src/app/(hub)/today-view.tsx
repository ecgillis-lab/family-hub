"use client";

import Link from "next/link";
import { useFamily } from "@/components/family-provider";
import { IconSettings } from "@/components/icons";
import { MemberDots } from "@/components/members";
import { useAppleEvents } from "@/components/use-apple-events";
import { eventOccursOn, formatTime, greeting, monthDay, todayKey, weekdayLong } from "@/lib/dates";
import type { CalendarEvent, Meal } from "@/lib/types";

function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
    return (a.startTime ?? "").localeCompare(b.startTime ?? "");
  });
}

export function TodayView() {
  const { state } = useFamily();
  const today = todayKey();
  const events = sortEvents(state.events.filter((event) => eventOccursOn(event, today)));
  const apple = useAppleEvents(today);
  const dinner = state.meals.find((meal: Meal) => meal.date === today && meal.slot === "dinner");
  const openShop = state.shopping.filter((item) => !item.checked).length;
  const openResearch = state.research.filter((item) => item.status !== "done").length;

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-muted">{greeting()}</p>
          <h1 className="font-display text-4xl leading-tight">{state.householdName}</h1>
          <p className="mt-1 text-muted">
            {weekdayLong(today)}, {monthDay(today)}
          </p>
        </div>
        <Link
          href="/settings"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-paper-2"
          aria-label="Settings"
        >
          <IconSettings className="h-5 w-5" />
        </Link>
      </div>

      <section className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-2xl">Today</h2>
          <Link href="/schedule" className="text-sm font-bold text-terracotta">
            Full schedule
          </Link>
        </div>
        {events.length === 0 && apple.events.length === 0 ? (
          <Link href="/schedule" className="card block px-5 py-8 text-center text-muted">
            Nothing on the calendar yet. Tap to add the week.
          </Link>
        ) : (
          <ul className="flex flex-col gap-3">
            {apple.events.map((event) => (
              <li key={event.id} className="card flex items-start gap-3 px-4 py-4">
                <div className="w-16 shrink-0 text-sm font-bold text-muted">
                  {event.allDay ? "All day" : event.startTime ? formatTime(event.startTime) : "—"}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-sage">Apple Calendar</p>
                  <p className="font-bold">{event.title}</p>
                  {event.location && <p className="text-sm text-muted">{event.location}</p>}
                </div>
              </li>
            ))}
            {events.map((event) => (
              <li key={event.id} className="card flex items-start gap-3 px-4 py-4">
                <div className="w-16 shrink-0 text-sm font-bold text-muted">
                  {event.allDay ? "All day" : event.startTime ? formatTime(event.startTime) : "—"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{event.title}</p>
                    <MemberDots members={state.members} ids={event.memberIds} />
                  </div>
                  {event.location && <p className="text-sm text-muted">{event.location}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid grid-cols-1 gap-3">
        <Link href="/meals" className="card px-4 py-4">
          <p className="text-sm font-bold text-muted">Tonight’s dinner</p>
          <p className="font-display text-2xl">{dinner?.title || "Not planned yet"}</p>
          {dinner?.protein && (
            <p className="mt-1 text-sm text-muted">
              {dinner.protein} · {dinner.starch} · {dinner.vegetable}
            </p>
          )}
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/shop" className="card px-4 py-4">
            <p className="text-sm font-bold text-muted">To buy</p>
            <p className="font-display text-2xl">{openShop}</p>
          </Link>
          <Link href="/research" className="card px-4 py-4">
            <p className="text-sm font-bold text-muted">Look into</p>
            <p className="font-display text-2xl">{openResearch}</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
