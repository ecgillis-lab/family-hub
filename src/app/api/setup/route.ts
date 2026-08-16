import { NextResponse } from "next/server";
import { hashPin, isValidPin, setSessionCookie } from "@/lib/auth";
import { readDb, saveHousehold } from "@/lib/db";
import { MEMBER_COLORS, type Member, type MemberRole } from "@/lib/types";

export const dynamic = "force-dynamic";

type SetupBody = {
  householdName?: string;
  pin?: string;
  members?: { name: string; role: MemberRole }[];
};

export async function POST(request: Request) {
  const db = await readDb();
  if (db.household) {
    return NextResponse.json({ error: "This household is already set up." }, { status: 400 });
  }

  const body = (await request.json()) as SetupBody;
  const householdName = body.householdName?.trim() ?? "";
  const pin = body.pin ?? "";
  const members = (body.members ?? []).filter((member) => member.name.trim());

  if (!householdName) {
    return NextResponse.json({ error: "Give the household a name." }, { status: 400 });
  }
  if (!isValidPin(pin)) {
    return NextResponse.json({ error: "PIN must be 4 to 6 digits." }, { status: 400 });
  }
  if (members.length === 0) {
    return NextResponse.json({ error: "Add at least one person." }, { status: 400 });
  }

  const { salt, hash } = hashPin(pin);
  db.household = { name: householdName, pinHash: hash, pinSalt: salt };
  db.members = members.map((member, index) => ({
    id: crypto.randomUUID(),
    name: member.name.trim(),
    role: member.role,
    color: MEMBER_COLORS[index % MEMBER_COLORS.length],
  })) satisfies Member[];

  await saveHousehold(db);
  await setSessionCookie();
  return NextResponse.json({ ok: true });
}
