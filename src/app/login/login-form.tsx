"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ householdName }: { householdName: string }) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(value = pin) {
    if (value.length < 4) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: value }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not sign in.");
        setPin("");
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function press(digit: string) {
    const next = (pin + digit).slice(0, 6);
    setPin(next);
    if (next.length === 6) void submit(next);
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5 py-10">
      <p className="text-sm font-bold uppercase tracking-wide text-terracotta">Family Hub</p>
      <h1 className="mt-2 font-display text-4xl">{householdName}</h1>
      <p className="mt-2 mb-8 text-muted">Enter the household PIN to open the shared board.</p>

      <div className="mb-6 flex justify-center gap-3">
        {Array.from({ length: Math.max(4, pin.length) }).map((_, index) => (
          <span
            key={index}
            className={`h-3 w-3 rounded-full ${index < pin.length ? "bg-ink" : "bg-paper-2"}`}
          />
        ))}
      </div>

      {error && <p className="mb-4 text-center text-sm font-bold text-terracotta">{error}</p>}

      <div className="grid grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((key) =>
          key === "" ? (
            <span key="empty" />
          ) : (
            <button
              key={key}
              type="button"
              disabled={busy}
              onClick={() => {
                if (key === "⌫") {
                  setPin((current) => current.slice(0, -1));
                  return;
                }
                press(key);
              }}
              className="btn btn-secondary h-16 text-2xl"
            >
              {key}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        className="btn btn-primary mt-6 w-full"
        disabled={busy || pin.length < 4}
        onClick={() => void submit()}
      >
        Open
      </button>
    </div>
  );
}
