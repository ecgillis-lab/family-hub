import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { loadAppleEvents } from "@/lib/apple-calendar";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const data = await loadAppleEvents();
  return NextResponse.json(data);
}
