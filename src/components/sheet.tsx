"use client";

import { useEffect } from "react";
import { IconClose } from "./icons";

export function Sheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-paper p-5 shadow-2xl sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-paper-2"
            aria-label="Close"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
