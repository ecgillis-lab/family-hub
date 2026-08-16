import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { mutateDb } from "@/lib/db";
import { clearAppleCache } from "@/lib/apple-calendar";
import type { Action } from "@/lib/types";

export const dynamic = "force-dynamic";

const TYPES = new Set<Action["type"]>([
  "addMember",
  "updateMember",
  "removeMember",
  "addEvent",
  "updateEvent",
  "removeEvent",
  "addMeal",
  "updateMeal",
  "removeMeal",
  "planDinners",
  "addShoppingItems",
  "addShopping",
  "updateShopping",
  "toggleShopping",
  "removeShopping",
  "clearCheckedShopping",
  "addResearch",
  "updateResearch",
  "removeResearch",
  "renameHousehold",
  "setAppleCalendarUrl",
]);

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const action = (await request.json()) as Action;
  if (!action?.type || !TYPES.has(action.type)) {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  const state = await mutateDb(action);
  if (action.type === "setAppleCalendarUrl") clearAppleCache();
  return NextResponse.json({ state });
}
