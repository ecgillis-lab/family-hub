"use client";

import type { Member } from "@/lib/types";

export function MemberDots({
  members,
  ids,
}: {
  members: Member[];
  ids: string[];
}) {
  const shown = members.filter((member) => ids.includes(member.id));
  if (shown.length === 0) return null;
  return (
    <span className="inline-flex -space-x-1">
      {shown.map((member) => (
        <span
          key={member.id}
          title={member.name}
          className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-card"
          style={{ background: member.color }}
        />
      ))}
    </span>
  );
}

export function MemberChips({
  members,
  selected,
  onToggle,
  allowEmpty = true,
}: {
  members: Member[];
  selected: string[];
  onToggle: (id: string) => void;
  allowEmpty?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {members.map((member) => {
        const on = selected.includes(member.id);
        return (
          <button
            key={member.id}
            type="button"
            onClick={() => {
              if (on && !allowEmpty && selected.length === 1) return;
              onToggle(member.id);
            }}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              on ? "text-white" : "bg-paper-2 text-ink"
            }`}
            style={on ? { background: member.color } : undefined}
          >
            {member.name}
          </button>
        );
      })}
    </div>
  );
}
