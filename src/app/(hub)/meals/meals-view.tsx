"use client";

import { useMemo, useState } from "react";
import { useFamily } from "@/components/family-provider";
import { IconChevron, IconPlus } from "@/components/icons";
import { Sheet } from "@/components/sheet";
import {
  addDays,
  monthDay,
  startOfWeek,
  todayKey,
  weekdayLong,
  weekdayShort,
  weekKeys,
  weekRangeLabel,
} from "@/lib/dates";
import {
  DINNERS,
  dinnerById,
  mealFromRecipe,
  mergeGroceries,
  pickWeekDinners,
  type DinnerRecipe,
} from "@/lib/dinners";
import type { Meal } from "@/lib/types";

export function MealsView() {
  const { state, dispatch, busy } = useFamily();
  const [anchor, setAnchor] = useState(() => new Date());
  const [pickingFor, setPickingFor] = useState<string | null>(null);
  const [detail, setDetail] = useState<DinnerRecipe | null>(null);
  const [message, setMessage] = useState("");
  const keys = weekKeys(anchor);

  const byDate = useMemo(() => {
    const map = new Map<string, Meal>();
    for (const meal of state.meals) {
      if (meal.slot === "dinner") map.set(meal.date, meal);
    }
    return map;
  }, [state.meals]);

  const plannedRecipes = keys
    .map((key) => byDate.get(key))
    .filter((meal): meal is Meal => Boolean(meal))
    .map((meal) => dinnerById(meal.recipeId))
    .filter((recipe): recipe is DinnerRecipe => Boolean(recipe));

  async function assignRecipe(date: string, recipe: DinnerRecipe) {
    const meal = mealFromRecipe(date, recipe);
    const existing = byDate.get(date);
    if (existing) {
      await dispatch({ type: "updateMeal", id: existing.id, meal });
    } else {
      await dispatch({ type: "addMeal", meal });
    }
    setPickingFor(null);
    setDetail(null);
  }

  async function fillWeek() {
    const recipes = pickWeekDinners(keys[0] ?? todayKey());
    await dispatch({
      type: "planDinners",
      meals: keys.map((date, index) => mealFromRecipe(date, recipes[index] ?? DINNERS[0])),
    });
    setMessage("This week’s dinners are filled. Swap any night you want.");
  }

  async function addWeekGroceries() {
    const items = mergeGroceries(plannedRecipes);
    if (items.length === 0) {
      setMessage("Plan dinners first, then add groceries.");
      return;
    }
    await dispatch({ type: "addShoppingItems", items });
    setMessage("Groceries for this week’s dinners are on the shopping list.");
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
          <p className="text-sm font-bold text-muted">Dinner only</p>
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

      <p className="mb-4 text-muted">
        Every dinner is a protein, a starch, and a vegetable. About 20–35 minutes, sized for five.
      </p>

      <div className="mb-5 flex flex-col gap-2">
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy}
          onClick={() => void fillWeek()}
        >
          Plan this week for me
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy || plannedRecipes.length === 0}
          onClick={() => void addWeekGroceries()}
        >
          Add week’s groceries to shop
        </button>
      </div>
      {message && <p className="mb-4 text-sm font-bold text-sage">{message}</p>}

      <div className="flex flex-col gap-3">
        {keys.map((key) => {
          const meal = byDate.get(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => setPickingFor(key)}
              className="card w-full p-4 text-left"
            >
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <p className="text-sm font-bold text-muted">
                  {weekdayShort(key)} {monthDay(key).split(" ")[1]}
                </p>
                {key === todayKey() && (
                  <span className="text-xs font-bold uppercase tracking-wide text-terracotta">
                    Tonight
                  </span>
                )}
              </div>
              {meal ? (
                <>
                  <p className="font-display text-2xl">{meal.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {meal.protein} · {meal.starch} · {meal.vegetable}
                  </p>
                  {meal.minutes > 0 && (
                    <p className="mt-1 text-sm font-bold text-muted">{meal.minutes} min</p>
                  )}
                </>
              ) : (
                <p className="flex items-center gap-2 text-muted">
                  <IconPlus className="h-4 w-4" />
                  Pick a dinner
                </p>
              )}
            </button>
          );
        })}
      </div>

      <Sheet
        open={Boolean(pickingFor)}
        title={pickingFor ? weekdayLong(pickingFor) : "Dinner"}
        onClose={() => {
          setPickingFor(null);
          setDetail(null);
        }}
      >
        {detail ? (
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-display text-2xl">{detail.title}</p>
              <p className="text-sm font-bold text-muted">{detail.minutes} minutes</p>
              <p className="mt-2 text-muted">
                {detail.protein} · {detail.starch} · {detail.vegetable}
              </p>
            </div>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {detail.how.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy || !pickingFor}
              onClick={() => pickingFor && void assignRecipe(pickingFor, detail)}
            >
              Use this dinner
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setDetail(null)}>
              See other options
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted">Tap one. Each plate already has a protein, starch, and vegetable.</p>
            {DINNERS.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                onClick={() => setDetail(recipe)}
                className="rounded-2xl bg-paper px-4 py-3 text-left"
              >
                <p className="font-bold">{recipe.title}</p>
                <p className="text-sm text-muted">
                  {recipe.protein} · {recipe.starch} · {recipe.vegetable}
                </p>
                <p className="text-sm font-bold text-muted">{recipe.minutes} min</p>
              </button>
            ))}
            {pickingFor && byDate.get(pickingFor) && (
              <button
                type="button"
                className="btn btn-secondary text-terracotta"
                onClick={async () => {
                  const meal = byDate.get(pickingFor);
                  if (!meal) return;
                  await dispatch({ type: "removeMeal", id: meal.id });
                  setPickingFor(null);
                }}
              >
                Clear this night
              </button>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
}
