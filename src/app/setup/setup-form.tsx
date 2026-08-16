"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FAMILY_MEMBERS } from "@/lib/family";
import type { MemberRole } from "@/lib/types";

type DraftMember = { name: string; role: MemberRole };

export function SetupForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [householdName, setHouseholdName] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [members, setMembers] = useState<DraftMember[]>(FAMILY_MEMBERS);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function addRow() {
    setMembers((current) => [...current, { name: "", role: "kid" }]);
  }

  function goToPin() {
    if (!householdName.trim()) {
      setError("Enter a family name to continue.");
      return;
    }
    setError("");
    setStep(2);
  }

  function goToPeople() {
    if (!/^\d{4,6}$/.test(pin)) {
      setError("Use 4 to 6 digits.");
      return;
    }
    if (pin !== pin2) {
      setError("Those PINs did not match.");
      return;
    }
    setError("");
    setStep(3);
  }

  async function finish() {
    setError("");
    const people = members.filter((member) => member.name.trim());
    if (people.length === 0) {
      setError("Add at least one person.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ householdName, pin, members: people }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not finish setup.");
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10">
      <p className="text-sm font-bold uppercase tracking-wide text-terracotta">Family Hub</p>
      <h1 className="mt-2 font-display text-4xl">Set up the house</h1>
      <p className="mt-2 mb-8 text-muted">A shared place for schedules, meals, shopping, and things to look into.</p>

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <label>
            <span className="mb-1 block text-sm font-bold text-muted">What should we call you?</span>
            <input
              className="field"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  goToPin();
                }
              }}
              placeholder="The Garcias, The Millers…"
              autoFocus
            />
          </label>
          {error && <p className="text-sm font-bold text-terracotta">{error}</p>}
          <button type="button" className="btn btn-primary" onClick={goToPin}>
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <p className="text-muted">A household PIN keeps this private on phones. Kids can use the same PIN — no email accounts.</p>
          <label>
            <span className="mb-1 block text-sm font-bold text-muted">PIN</span>
            <input
              className="field tracking-[0.4em]"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </label>
          <label>
            <span className="mb-1 block text-sm font-bold text-muted">Type it again</span>
            <input
              className="field tracking-[0.4em]"
              inputMode="numeric"
              value={pin2}
              onChange={(e) => setPin2(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  goToPeople();
                }
              }}
            />
          </label>
          {error && <p className="text-sm font-bold text-terracotta">{error}</p>}
          <button type="button" className="btn btn-primary" onClick={goToPeople}>
            Continue
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
            Back
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <p className="text-muted">Mom, Dad, Giada, Luca, and Nico are ready. Change anyone if needed.</p>
          {members.map((member, index) => (
            <div key={index} className="flex gap-2">
              <input
                className="field flex-1"
                value={member.name}
                onChange={(e) =>
                  setMembers((current) =>
                    current.map((row, rowIndex) =>
                      rowIndex === index ? { ...row, name: e.target.value } : row,
                    ),
                  )
                }
                placeholder={index === 0 ? "Alex" : "Name"}
              />
              <select
                className="field w-28"
                value={member.role}
                onChange={(e) =>
                  setMembers((current) =>
                    current.map((row, rowIndex) =>
                      rowIndex === index
                        ? { ...row, role: e.target.value as MemberRole }
                        : row,
                    ),
                  )
                }
              >
                <option value="adult">Adult</option>
                <option value="kid">Kid</option>
              </select>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addRow}>
            Add another person
          </button>
          {error && <p className="text-sm font-bold text-terracotta">{error}</p>}
          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void finish()}>
            Open Family Hub
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
            Back
          </button>
        </div>
      )}
    </div>
  );
}
