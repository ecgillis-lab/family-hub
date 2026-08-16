import type { Action, Database, Meal, PublicState } from "./types";
import { loadStore, saveStore } from "./store";

const emptyDb = (): Database => ({
  household: null,
  members: [],
  events: [],
  meals: [],
  shopping: [],
  research: [],
  appleCalendarUrl: "",
});

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(work: () => Promise<T>): Promise<T> {
  const run = queue.then(work, work);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function readDb(): Promise<Database> {
  const raw = await loadStore();
  if (!raw) return emptyDb();
  try {
    const parsed = JSON.parse(raw) as Partial<Database>;
    return {
      ...emptyDb(),
      ...parsed,
      members: parsed.members ?? [],
      events: (parsed.events ?? []).map((event) => ({
        ...event,
        repeatDays: event.repeatDays ?? [],
      })),
      meals: (parsed.meals ?? []).map((meal) => ({
        ...meal,
        slot: "dinner" as const,
        recipeId: meal.recipeId ?? "",
        protein: meal.protein ?? "",
        starch: meal.starch ?? "",
        vegetable: meal.vegetable ?? "",
        minutes: meal.minutes ?? 0,
      })),
      shopping: parsed.shopping ?? [],
      research: parsed.research ?? [],
      appleCalendarUrl: parsed.appleCalendarUrl ?? "",
    };
  } catch {
    return emptyDb();
  }
}

async function writeDb(db: Database): Promise<void> {
  await saveStore(JSON.stringify(db, null, 2));
}

export function toPublicState(db: Database): PublicState | null {
  if (!db.household) return null;
  return {
    householdName: db.household.name,
    members: db.members,
    events: db.events,
    meals: db.meals,
    shopping: db.shopping,
    research: db.research,
    appleCalendarUrl: db.appleCalendarUrl ?? "",
  };
}

export async function mutateDb(action: Action): Promise<PublicState> {
  return enqueue(async () => {
    const db = await readDb();
    applyAction(db, action);
    await writeDb(db);
    const state = toPublicState(db);
    if (!state) throw new Error("Household is not set up yet.");
    return state;
  });
}

export async function saveHousehold(db: Database): Promise<void> {
  await enqueue(async () => {
    await writeDb(db);
  });
}

function nid(): string {
  return crypto.randomUUID();
}

function normalizeMeal(meal: Meal): Meal {
  return {
    id: meal.id,
    date: meal.date,
    slot: "dinner",
    title: meal.title,
    notes: meal.notes ?? "",
    recipeId: meal.recipeId ?? "",
    protein: meal.protein ?? "",
    starch: meal.starch ?? "",
    vegetable: meal.vegetable ?? "",
    minutes: meal.minutes ?? 0,
  };
}

function applyAction(db: Database, action: Action): void {
  switch (action.type) {
    case "addMember":
      db.members.push({
        id: nid(),
        name: action.name.trim(),
        color: action.color,
        role: action.role,
      });
      break;
    case "updateMember":
      db.members = db.members.map((member) =>
        member.id === action.id
          ? {
              ...member,
              name: action.name.trim(),
              color: action.color,
              role: action.role,
            }
          : member,
      );
      break;
    case "removeMember":
      db.members = db.members.filter((member) => member.id !== action.id);
      db.events = db.events.map((event) => ({
        ...event,
        memberIds: event.memberIds.filter((id) => id !== action.id),
      }));
      break;
    case "addEvent":
      db.events.push({
        ...action.event,
        id: nid(),
        repeatDays: action.event.repeatDays ?? [],
      });
      break;
    case "updateEvent":
      db.events = db.events.map((event) =>
        event.id === action.id
          ? { ...action.event, id: event.id, repeatDays: action.event.repeatDays ?? [] }
          : event,
      );
      break;
    case "removeEvent":
      db.events = db.events.filter((event) => event.id !== action.id);
      break;
    case "addMeal":
      db.meals = db.meals.filter(
        (meal) => !(meal.date === action.meal.date && meal.slot === "dinner"),
      );
      db.meals.push(normalizeMeal({ ...action.meal, id: nid() }));
      break;
    case "updateMeal":
      db.meals = db.meals.map((meal) =>
        meal.id === action.id ? normalizeMeal({ ...action.meal, id: meal.id }) : meal,
      );
      break;
    case "removeMeal":
      db.meals = db.meals.filter((meal) => meal.id !== action.id);
      break;
    case "planDinners": {
      const dates = new Set(action.meals.map((meal) => meal.date));
      db.meals = db.meals.filter(
        (meal) => meal.slot !== "dinner" || !dates.has(meal.date),
      );
      for (const meal of action.meals) {
        db.meals.push(normalizeMeal({ ...meal, id: nid() }));
      }
      break;
    }
    case "addShoppingItems":
      for (const item of action.items) {
        const name = item.name.trim();
        if (!name) continue;
        const exists = db.shopping.some(
          (row) => !row.checked && row.name.toLowerCase() === name.toLowerCase(),
        );
        if (exists) continue;
        db.shopping.unshift({
          id: nid(),
          name,
          qty: item.qty.trim(),
          checked: false,
        });
      }
      break;
    case "addShopping":
      db.shopping.unshift({
        id: nid(),
        name: action.name.trim(),
        qty: action.qty.trim(),
        checked: false,
      });
      break;
    case "updateShopping":
      db.shopping = db.shopping.map((item) =>
        item.id === action.id
          ? { ...item, name: action.name.trim(), qty: action.qty.trim() }
          : item,
      );
      break;
    case "toggleShopping":
      db.shopping = db.shopping.map((item) =>
        item.id === action.id ? { ...item, checked: !item.checked } : item,
      );
      break;
    case "removeShopping":
      db.shopping = db.shopping.filter((item) => item.id !== action.id);
      break;
    case "clearCheckedShopping":
      db.shopping = db.shopping.filter((item) => !item.checked);
      break;
    case "addResearch":
      db.research.unshift({
        id: nid(),
        title: action.title.trim(),
        notes: action.notes.trim(),
        status: "inbox",
        createdAt: new Date().toISOString(),
      });
      break;
    case "updateResearch":
      db.research = db.research.map((item) =>
        item.id === action.id
          ? {
              ...item,
              title: action.title.trim(),
              notes: action.notes.trim(),
              status: action.status,
            }
          : item,
      );
      break;
    case "removeResearch":
      db.research = db.research.filter((item) => item.id !== action.id);
      break;
    case "renameHousehold":
      if (db.household) db.household.name = action.name.trim();
      break;
    case "setAppleCalendarUrl":
      db.appleCalendarUrl = action.url.trim();
      break;
  }
}
