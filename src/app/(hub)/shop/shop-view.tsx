"use client";

import { useState } from "react";
import { useFamily } from "@/components/family-provider";
import { IconPlus } from "@/components/icons";

export function ShopView() {
  const { state, dispatch } = useFamily();
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");
  const open = state.shopping.filter((item) => !item.checked);
  const got = state.shopping.filter((item) => item.checked);

  async function addItem() {
    const itemName = name.trim();
    if (!itemName) {
      setError("Type what you need to buy, then tap Add.");
      return;
    }
    setError("");
    try {
      await dispatch({ type: "addShopping", name: itemName, qty: qty.trim() });
      setName("");
      setQty("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add that item.");
    }
  }

  return (
    <div className="px-4 pt-6">
      <h1 className="font-display text-4xl">Shopping</h1>
      <p className="mb-5 text-muted">Shared list for the house. Check things off at the store.</p>

      <div className="mb-6 flex flex-col gap-2">
        <input
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void addItem();
            }
          }}
          placeholder="Milk, lightbulbs, birthday card…"
        />
        <div className="flex gap-2">
          <input
            className="field w-28"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void addItem();
              }
            }}
            placeholder="Qty"
          />
          <button
            className="btn btn-primary min-w-0 flex-1"
            type="button"
            onClick={() => void addItem()}
          >
            <IconPlus className="h-5 w-5" />
            Add
          </button>
        </div>
        {error && <p className="text-sm font-bold text-terracotta">{error}</p>}
      </div>

      {state.shopping.length === 0 ? (
        <div className="card px-5 py-10 text-center text-muted">
          Nothing to buy yet. Add groceries, household stuff, and wish-list items.
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {open.map((item) => (
              <li key={item.id} className="card flex items-center gap-3 px-4 py-3">
                <button
                  type="button"
                  onClick={() => void dispatch({ type: "toggleShopping", id: item.id })}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-ink"
                  aria-label={`Got ${item.name}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{item.name}</p>
                  {item.qty && <p className="text-sm text-muted">{item.qty}</p>}
                </div>
                <button
                  type="button"
                  className="text-sm font-bold text-muted"
                  onClick={() => void dispatch({ type: "removeShopping", id: item.id })}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {got.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Got it</h2>
                <button
                  type="button"
                  className="text-sm font-bold text-terracotta"
                  onClick={() => void dispatch({ type: "clearCheckedShopping" })}
                >
                  Clear
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                {got.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-2 text-muted">
                    <button
                      type="button"
                      onClick={() => void dispatch({ type: "toggleShopping", id: item.id })}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sage text-xs font-bold text-white"
                      aria-label={`Still need ${item.name}`}
                    >
                      ✓
                    </button>
                    <span className="line-through">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
