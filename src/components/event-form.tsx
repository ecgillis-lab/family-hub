"use client";

import { useState } from "react";
import { MemberChips } from "@/components/members";
import { formatRepeat, WEEKDAY_LETTERS, weekdayOf } from "@/lib/dates";
import { EVENT_PRESETS, memberIdsForNames } from "@/lib/family";
import type { CalendarEvent, Member } from "@/lib/types";

export type EventDraft = Omit<CalendarEvent, "id">;

const emptyDraft = (date: string): EventDraft => ({
  title: "",
  memberIds: [],
  date,
  allDay: false,
  startTime: "09:00",
  endTime: "10:00",
  location: "",
  notes: "",
  repeatDays: [],
});

export function EventForm({
  members,
  initial,
  date,
  onSave,
  onDelete,
  saving,
}: {
  members: Member[];
  initial?: CalendarEvent;
  date: string;
  onSave: (draft: EventDraft) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  saving?: boolean;
}) {
  const [draft, setDraft] = useState<EventDraft>(
    initial
      ? {
          title: initial.title,
          memberIds: initial.memberIds,
          date: initial.date,
          allDay: initial.allDay,
          startTime: initial.startTime,
          endTime: initial.endTime,
          location: initial.location,
          notes: initial.notes,
          repeatDays: initial.repeatDays ?? [],
        }
      : emptyDraft(date),
  );

  const weekly = draft.repeatDays.length > 0;

  function toggleDay(day: number) {
    const has = draft.repeatDays.includes(day);
    const next = has
      ? draft.repeatDays.filter((value) => value !== day)
      : [...draft.repeatDays, day].sort((a, b) => a - b);
    setDraft({ ...draft, repeatDays: next });
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!draft.title.trim()) return;
        await onSave({
          ...draft,
          title: draft.title.trim(),
          startTime: draft.allDay ? null : draft.startTime,
          endTime: draft.allDay ? null : draft.endTime,
          repeatDays: weekly ? draft.repeatDays : [],
        });
      }}
    >
      {!initial && (
        <div>
          <span className="mb-2 block text-sm font-bold text-muted">Usual plans</span>
          <div className="flex flex-wrap gap-2">
            {EVENT_PRESETS.map((preset) => (
              <button
                key={preset.title}
                type="button"
                className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                  draft.title === preset.title ? "bg-ink text-card" : "bg-paper-2 text-ink"
                }`}
                onClick={() =>
                  setDraft({
                    ...draft,
                    title: preset.title,
                    allDay: false,
                    startTime: preset.startTime,
                    endTime: preset.endTime,
                    memberIds: memberIdsForNames(members, preset.who),
                  })
                }
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-bold text-muted">What</span>
        <input
          className="field"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Tap a usual plan, or type your own"
          autoFocus
          required
        />
      </label>

      <div>
        <span className="mb-1 block text-sm font-bold text-muted">Who</span>
        <MemberChips
          members={members}
          selected={draft.memberIds}
          onToggle={(id) =>
            setDraft({
              ...draft,
              memberIds: draft.memberIds.includes(id)
                ? draft.memberIds.filter((memberId) => memberId !== id)
                : [...draft.memberIds, id],
            })
          }
        />
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-bold text-muted">
          {weekly ? "Starts" : "Date"}
        </span>
        <input
          type="date"
          className="field"
          value={draft.date}
          onChange={(e) => {
            const nextDate = e.target.value;
            setDraft({
              ...draft,
              date: nextDate,
              repeatDays: weekly
                ? Array.from(new Set([...draft.repeatDays, weekdayOf(nextDate)])).sort(
                    (a, b) => a - b,
                  )
                : [],
            });
          }}
          required
        />
      </label>

      <label className="flex items-center gap-3 text-sm font-bold">
        <input
          type="checkbox"
          checked={weekly}
          onChange={(e) =>
            setDraft({
              ...draft,
              repeatDays: e.target.checked ? [weekdayOf(draft.date)] : [],
            })
          }
        />
        Repeats every week
      </label>

      {weekly && (
        <div>
          <span className="mb-2 block text-sm font-bold text-muted">On these days</span>
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAY_LETTERS.map((letter, day) => {
              const on = draft.repeatDays.includes(day);
              return (
                <button
                  key={`${letter}-${day}`}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`rounded-2xl py-2 text-sm font-bold ${
                    on ? "bg-ink text-card" : "bg-paper-2 text-ink"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
          {draft.repeatDays.length > 0 && (
            <p className="mt-2 text-sm text-muted">{formatRepeat(draft.repeatDays)}</p>
          )}
        </div>
      )}

      <label className="flex items-center gap-3 text-sm font-bold">
        <input
          type="checkbox"
          checked={draft.allDay}
          onChange={(e) => setDraft({ ...draft, allDay: e.target.checked })}
        />
        All day
      </label>

      {!draft.allDay && (
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-muted">Starts</span>
            <input
              type="time"
              className="field"
              value={draft.startTime ?? "09:00"}
              onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-muted">Ends</span>
            <input
              type="time"
              className="field"
              value={draft.endTime ?? "10:00"}
              onChange={(e) => setDraft({ ...draft, endTime: e.target.value })}
            />
          </label>
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-bold text-muted">Where</span>
        <input
          className="field"
          value={draft.location}
          onChange={(e) => setDraft({ ...draft, location: e.target.value })}
          placeholder="Optional"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-bold text-muted">Notes</span>
        <textarea
          className="field min-h-24"
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          placeholder="Pickup person, what to bring…"
        />
      </label>

      <button className="btn btn-primary" type="submit" disabled={saving}>
        {initial ? "Save changes" : "Add to schedule"}
      </button>
      {onDelete && (
        <button
          type="button"
          className="btn btn-secondary text-terracotta"
          onClick={() => void onDelete()}
          disabled={saving}
        >
          {weekly ? "Remove from every week" : "Remove"}
        </button>
      )}
    </form>
  );
}
