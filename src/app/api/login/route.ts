import { NextResponse } from "next/server";
import { isValidPin, setSessionCookie, verifyPin } from "@/lib/auth";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const db = await readDb();
  if (!db.household) {
    return NextResponse.json({ error: "Household is not set up yet." }, { status: 400 });
  }

  const { pin } = (await request.json()) as { pin?: string };
  if (!pin || !isValidPin(pin) || !verifyPin(pin, db.household.pinSalt, db.household.pinHash)) {
    return NextResponse.json({ error: "That PIN did not match." }, { status: 401 });
  }

  await setSessionCookie();
  return NextResponse.json({ ok: true });
}
