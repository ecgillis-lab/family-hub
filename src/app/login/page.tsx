import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const db = await readDb();
  if (!db.household) redirect("/setup");
  if (await getSession()) redirect("/");
  return <LoginForm householdName={db.household.name} />;
}
