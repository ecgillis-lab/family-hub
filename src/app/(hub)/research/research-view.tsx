"use client";

import { useState } from "react";
import { useFamily } from "@/components/family-provider";
import { IconPlus } from "@/components/icons";
import { Sheet } from "@/components/sheet";
import type { ResearchItem, ResearchStatus } from "@/lib/types";

const TABS: { id: ResearchStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "inbox", label: "Inbox" },
  { id: "looking", label: "Looking" },
  { id: "done", label: "Done" },
];

export function ResearchView() {
  const { state, dispatch, busy } = useFamily();
  const [tab, setTab] = useState<ResearchStatus | "all">("inbox");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ResearchItem | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<ResearchStatus>("inbox");

  const items = state.research.filter((item) => tab === "all" || item.status === tab);

  function openNew() {
    setTitle("");
    setNotes("");
    setStatus("inbox");
    setEditing(null);
    setCreating(true);
  }

  function openEdit(item: ResearchItem) {
    setEditing(item);
    setTitle(item.title);
    setNotes(item.notes);
    setStatus(item.status);
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl">Look into</h1>
          <p className="text-muted">Ideas, products, and questions to research later.</p>
        </div>
        <button type="button" className="btn btn-primary h-11 px-4" onClick={openNew}>
          <IconPlus className="h-5 w-5" />
          Add
        </button>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              tab === item.id ? "bg-ink text-card" : "bg-paper-2 text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="card px-5 py-10 text-center text-muted">
          Park anything you don’t want to forget — summer camps, a new vacuum, that recipe you saw.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => openEdit(item)}
                className="card w-full px-4 py-4 text-left"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  {item.status === "inbox" ? "To look into" : item.status === "looking" ? "Looking into it" : "Done"}
                </p>
                <p className="font-display text-xl">{item.title}</p>
                {item.notes && <p className="mt-1 line-clamp-3 text-sm text-muted">{item.notes}</p>}
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet
        open={creating || Boolean(editing)}
        title={editing ? "Update" : "Something to look into"}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!title.trim()) return;
            if (editing) {
              await dispatch({
                type: "updateResearch",
                id: editing.id,
                title,
                notes,
                status,
              });
            } else {
              await dispatch({ type: "addResearch", title, notes });
            }
            setCreating(false);
            setEditing(null);
          }}
        >
          <input
            className="field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New dishwasher, summer camp, that book…"
            required
          />
          <textarea
            className="field min-h-32"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Links, questions, why it matters…"
          />
          {editing && (
            <label className="block">
              <span className="mb-1 block text-sm font-bold text-muted">Status</span>
              <select
                className="field"
                value={status}
                onChange={(e) => setStatus(e.target.value as ResearchStatus)}
              >
                <option value="inbox">To look into</option>
                <option value="looking">Looking into it</option>
                <option value="done">Done</option>
              </select>
            </label>
          )}
          <button className="btn btn-primary" disabled={busy}>
            Save
          </button>
          {editing && (
            <button
              type="button"
              className="btn btn-secondary text-terracotta"
              onClick={async () => {
                await dispatch({ type: "removeResearch", id: editing.id });
                setEditing(null);
              }}
            >
              Remove
            </button>
          )}
        </form>
      </Sheet>
    </div>
  );
}
