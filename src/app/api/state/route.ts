import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readDb, toPublicState } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await readDb();
  if (!db.household) {
    return NextResponse.json({ setup: false, authenticated: false, state: null });
  }
  const authenticated = await getSession();
  if (!authenticated) {
    return NextResponse.json({
      setup: true,
      authenticated: false,
      householdName: db.household.name,
      state: null,
    });
  }
  return NextResponse.json({
    setup: true,
    authenticated: true,
    state: toPublicState(db),
  });
}
