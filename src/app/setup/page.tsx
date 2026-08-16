import { redirect } from "next/navigation";
import { readDb } from "@/lib/db";
import { SetupForm } from "./setup-form";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const db = await readDb();
  if (db.household) redirect("/login");
  return <SetupForm />;
}
