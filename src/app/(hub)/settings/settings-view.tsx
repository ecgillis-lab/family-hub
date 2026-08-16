"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useFamily } from "@/components/family-provider";
import { MEMBER_COLORS, type Member, type MemberRole } from "@/lib/types";

function AppleCalendarCard() {
  const { state, dispatch, busy } = useFamily();
  const [url, setUrl] = useState(state.appleCalendarUrl);
  const [message, setMessage] = useState("");

  async function save(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      await dispatch({ type: "setAppleCalendarUrl", url: url.trim() });
      setMessage(
        url.trim()
          ? "Saved. Apple events will show on Today and Schedule."
          : "Apple Calendar disconnected.",
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save that link.");
    }
  }

  return (
    <form onSubmit={save} className="card mb-6 p-4">
      <h2 className="mb-2 font-display text-2xl">Apple Calendar</h2>
      <p className="mb-3 text-sm text-muted">
        Family Hub can show events from your iPhone calendar. This is one-way: Apple events appear
        here, but plans you add in Family Hub do not go back to Apple Calendar.
      </p>
      <ol className="mb-4 list-decimal space-y-1 pl-5 text-sm text-muted">
        <li>On iPhone, open Calendar and tap Calendars at the bottom.</li>
        <li>Tap the info button next to the calendar you want (a Family calendar is best).</li>
        <li>Turn on Public Calendar, then tap Share Link and Copy.</li>
        <li>Paste that link below.</li>
      </ol>
      <p className="mb-3 text-sm text-muted">
        Anyone with the public link can see that calendar, so use one that is already shared with the house.
      </p>
      <input
        className="field"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="webcal:// or https://…"
        autoCapitalize="off"
        autoCorrect="off"
      />
      <button className="btn btn-primary mt-3 w-full" disabled={busy}>
        Save calendar link
      </button>
      {state.appleCalendarUrl && (
        <button
          type="button"
          className="btn btn-secondary mt-2 w-full"
          disabled={busy}
          onClick={() => {
            setUrl("");
            void dispatch({ type: "setAppleCalendarUrl", url: "" });
            setMessage("Apple Calendar disconnected.");
          }}
        >
          Disconnect
        </button>
      )}
      {message && <p className="mt-3 text-sm font-bold text-sage">{message}</p>}
    </form>
  );
}

export function SettingsView() {
  const router = useRouter();
  const { state, dispatch, busy } = useFamily();
  const [householdName, setHouseholdName] = useState(state.householdName);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<MemberRole>("adult");
  const [newColor, setNewColor] = useState(MEMBER_COLORS[0]);

  async function saveHousehold(event: FormEvent) {
    event.preventDefault();
    if (!householdName.trim()) return;
    await dispatch({ type: "renameHousehold", name: householdName });
  }

  async function addMember(event: FormEvent) {
    event.preventDefault();
    if (!newName.trim()) return;
    await dispatch({
      type: "addMember",
      name: newName,
      role: newRole,
      color: newColor,
    });
    setNewName("");
  }

  async function updateMember(member: Member, patch: Partial<Member>) {
    await dispatch({
      type: "updateMember",
      id: member.id,
      name: patch.name ?? member.name,
      role: patch.role ?? member.role,
      color: patch.color ?? member.color,
    });
  }

  return (
    <div className="px-4 pt-6">
      <h1 className="font-display text-4xl">Settings</h1>
      <p className="mb-6 text-muted">Household name, people, and sign out.</p>

      <form onSubmit={saveHousehold} className="card mb-6 p-4">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-muted">Household name</span>
          <input
            className="field"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
          />
        </label>
        <button className="btn btn-primary mt-3 w-full" disabled={busy}>
          Save name
        </button>
      </form>

      <AppleCalendarCard />

      <section className="mb-6">
        <h2 className="mb-3 font-display text-2xl">People</h2>
        <ul className="mb-4 flex flex-col gap-3">
          {state.members.map((member) => (
            <li key={member.id} className="card p-4">
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="h-8 w-8 rounded-full"
                  style={{ background: member.color }}
                />
                <input
                  className="field"
                  defaultValue={member.name}
                  onBlur={(e) => {
                    if (e.target.value.trim() && e.target.value !== member.name) {
                      void updateMember(member, { name: e.target.value });
                    }
                  }}
                />
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                {MEMBER_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => void updateMember(member, { color })}
                    className={`h-7 w-7 rounded-full ${member.color === color ? "ring-2 ring-ink ring-offset-2" : ""}`}
                    style={{ background: color }}
                    aria-label={color}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <select
                  className="field w-auto"
                  value={member.role}
                  onChange={(e) =>
                    void updateMember(member, { role: e.target.value as MemberRole })
                  }
                >
                  <option value="adult">Adult</option>
                  <option value="kid">Kid</option>
                </select>
                <button
                  type="button"
                  className="text-sm font-bold text-terracotta"
                  onClick={() => void dispatch({ type: "removeMember", id: member.id })}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={addMember} className="card p-4">
          <p className="mb-3 font-bold">Add someone</p>
          <input
            className="field mb-3"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
          />
          <div className="mb-3 flex gap-2">
            {(["adult", "kid"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setNewRole(role)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  newRole === role ? "bg-ink text-card" : "bg-paper-2"
                }`}
              >
                {role === "adult" ? "Adult" : "Kid"}
              </button>
            ))}
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            {MEMBER_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setNewColor(color)}
                className={`h-7 w-7 rounded-full ${newColor === color ? "ring-2 ring-ink ring-offset-2" : ""}`}
                style={{ background: color }}
                aria-label={color}
              />
            ))}
          </div>
          <button className="btn btn-primary w-full" disabled={busy}>
            Add person
          </button>
        </form>
      </section>

      <button
        type="button"
        className="btn btn-secondary w-full"
        onClick={async () => {
          await fetch("/api/logout", { method: "POST" });
          router.push("/login");
          router.refresh();
        }}
      >
        Sign out
      </button>
    </div>
  );
}
