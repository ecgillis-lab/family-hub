"use client";

import { useMemo, useState } from "react";
import { EventForm, type EventDraft } from "@/components/event-form";
import { useFamily } from "@/components/family-provider";
import { IconChevron, IconPlus } from "@/components/icons";
import { MemberChips, MemberDots } from "@/components/members";
import { Sheet } from "@/components/sheet";
import { useAppleWeek } from "@/components/use-apple-events";
import {
  addDays,
  eventOccursOn,
  formatRepeat,
  formatTime,
  monthDay,
  startOfWeek,
  todayKey,
  weekdayLong,
  weekdayShort,
  weekKeys,
  weekRangeLabel,
} from "@/lib/dates";
import type { CalendarEvent } from "@/lib/types";

function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
    return (a.startTime ?? "").localeCompare(b.startTime ?? "");
  });
}

export function ScheduleView() {
  const { state, dispatch, busy } = useFamily();
  const [anchor, setAnchor] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [filter, setFilter] = useState<string[]>([]);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [creating, setCreating] = useState(false);

  const keys = weekKeys(anchor);
  const apple = useAppleWeek(keys);
  const filteredEvents = useMemo(() => {
    return state.events.filter((event) => {
      if (filter.length === 0) return true;
      if (event.memberIds.length === 0) return true;
      return event.memberIds.some((id) => filter.includes(id));
    });
  }, [state.events, filter]);

  const dayEvents = sortEvents(
    filteredEvents.filter((event) => eventOccursOn(event, selectedDate)),
  );
  const appleDayEvents = apple.events
    .filter((event) => eventOccursOn(event, selectedDate))
    .sort((a, b) => {
      if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
      return (a.startTime ?? "").localeCompare(b.startTime ?? "");
    });

  async function saveEvent(draft: EventDraft, id?: string) {
    if (id) {
      await dispatch({ type: "updateEvent", id, event: draft });
    } else {
      await dispatch({ type: "addEvent", event: draft });
    }
    setCreating(false);
    setEditing(null);
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-paper-2"
          onClick={() => setAnchor(addDays(startOfWeek(anchor), -7))}
          aria-label="Previous week"
        >
          <IconChevron className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold text-muted">This week</p>
          <h1 className="font-display text-2xl">{weekRangeLabel(keys)}</h1>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-paper-2"
          onClick={() => setAnchor(addDays(startOfWeek(anchor), 7))}
          aria-label="Next week"
        >
          <IconChevron className="h-5 w-5 rotate-180" />
        </button>
      </div>

      {state.members.length > 0 && (
        <div className="mb-4">
          <MemberChips
            members={state.members}
            selected={filter}
            onToggle={(id) =>
              setFilter((current) =>
                current.includes(id)
                  ? current.filter((memberId) => memberId !== id)
                  : [...current, id],
              )
            }
          />
          {filter.length > 0 && (
            <button
              type="button"
              className="mt-2 text-sm font-bold text-muted"
              onClick={() => setFilter([])}
            >
              Show everyone
            </button>
          )}
        </div>
      )}

      <div className="mb-5 grid grid-cols-7 gap-1">
        {keys.map((key) => {
          const count =
            filteredEvents.filter((event) => eventOccursOn(event, key)).length +
            apple.countOn(key);
          const selected = key === selectedDate;
          const isToday = key === todayKey();
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDate(key)}
              className={`flex flex-col items-center rounded-2xl py-2 ${
                selected ? "bg-ink text-card" : "bg-card text-ink"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wide">
                {weekdayShort(key)}
              </span>
              <span className={`text-lg font-bold ${isToday && !selected ? "text-terracotta" : ""}`}>
                {key.slice(-2).replace(/^0/, "")}
              </span>
              <span className={`mt-1 h-1.5 w-1.5 rounded-full ${count ? (selected ? "bg-card" : "bg-terracotta") : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>

      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-sm font-bold text-muted">{weekdayLong(selectedDate)}</p>
          <h2 className="font-display text-3xl">{monthDay(selectedDate)}</h2>
        </div>
        <button
          type="button"
          className="btn btn-primary h-11 px-4"
          onClick={() => setCreating(true)}
        >
          <IconPlus className="h-5 w-5" />
          Add
        </button>
      </div>

      {apple.error && (
        <p className="mb-4 text-sm font-bold text-terracotta">{apple.error}</p>
      )}

      {dayEvents.length === 0 && appleDayEvents.length === 0 ? (
        <div className="card px-5 py-10 text-center text-muted">
          Nothing on the schedule yet. Tap Add, or connect Apple Calendar in Settings.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {appleDayEvents.map((event) => (
            <li key={event.id} className="card flex w-full items-start gap-3 px-4 py-4">
              <div className="w-16 shrink-0 text-sm font-bold text-muted">
                {event.allDay ? "All day" : event.startTime ? formatTime(event.startTime) : "—"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-sage">Apple Calendar</p>
                <p className="font-bold">{event.title}</p>
                {event.location && <p className="text-sm text-muted">{event.location}</p>}
                {event.repeatDays.length > 0 && (
                  <p className="text-sm text-muted">{formatRepeat(event.repeatDays)}</p>
                )}
              </div>
            </li>
          ))}
          {dayEvents.map((event) => (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => setEditing(event)}
                className="card flex w-full items-start gap-3 px-4 py-4 text-left"
              >
                <div className="w-16 shrink-0 text-sm font-bold text-muted">
                  {event.allDay ? "All day" : event.startTime ? formatTime(event.startTime) : "—"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{event.title}</p>
                    <MemberDots members={state.members} ids={event.memberIds} />
                  </div>
                  {event.location && (
                    <p className="text-sm text-muted">{event.location}</p>
                  )}
                  {(event.repeatDays?.length ?? 0) > 0 && (
                    <p className="text-sm text-muted">{formatRepeat(event.repeatDays)}</p>
                  )}
                  {event.endTime && !event.allDay && (
                    <p className="text-sm text-muted">Until {formatTime(event.endTime)}</p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={creating} title="New plan" onClose={() => setCreating(false)}>
        <EventForm
          members={state.members}
          date={selectedDate}
          saving={busy}
          onSave={(draft) => saveEvent(draft)}
        />
      </Sheet>
      <Sheet
        open={Boolean(editing)}
        title="Edit plan"
        onClose={() => setEditing(null)}
      >
        {editing && (
          <EventForm
            members={state.members}
            initial={editing}
            date={editing.date}
            saving={busy}
            onSave={(draft) => saveEvent(draft, editing.id)}
            onDelete={async () => {
              await dispatch({ type: "removeEvent", id: editing.id });
              setEditing(null);
            }}
          />
        )}
      </Sheet>
    </div>
  );
}
