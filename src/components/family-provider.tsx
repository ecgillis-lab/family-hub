"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Action, PublicState } from "@/lib/types";

type FamilyContextValue = {
  state: PublicState;
  busy: boolean;
  dispatch: (action: Action) => Promise<void>;
  refresh: () => Promise<void>;
};

const FamilyContext = createContext<FamilyContextValue | null>(null);

export function FamilyProvider({
  initialState,
  children,
}: {
  initialState: PublicState;
  children: React.ReactNode;
}) {
  const [state, setState] = useState(initialState);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/state", { cache: "no-store" });
    const data = (await res.json()) as { state?: PublicState | null };
    if (data.state) setState(data.state);
  }, []);

  const dispatch = useCallback(async (action: Action) => {
    setBusy(true);
    try {
      const res = await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      });
      const data = (await res.json()) as { state?: PublicState; error?: string };
      if (!res.ok || !data.state) {
        throw new Error(data.error || "Could not save.");
      }
      setState(data.state);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const onFocus = () => {
      void refresh();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const value = useMemo(
    () => ({ state, busy, dispatch, refresh }),
    [state, busy, dispatch, refresh],
  );

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamily(): FamilyContextValue {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error("useFamily must be used inside FamilyProvider");
  return ctx;
}
