import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { FamilyProvider } from "@/components/family-provider";
import { getSession } from "@/lib/auth";
import { readDb, toPublicState } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = await readDb();
  if (!db.household) redirect("/setup");
  if (!(await getSession())) redirect("/login");
  const state = toPublicState(db);
  if (!state) redirect("/setup");

  return (
    <FamilyProvider initialState={state}>
      <div className="mx-auto min-h-dvh w-full max-w-3xl pb-28">{children}</div>
      <BottomNav />
    </FamilyProvider>
  );
}
