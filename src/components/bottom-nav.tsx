"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconCalendar,
  IconCart,
  IconHome,
  IconMeal,
  IconSearch,
} from "./icons";

const ITEMS = [
  { href: "/", label: "Today", icon: IconHome },
  { href: "/schedule", label: "Schedule", icon: IconCalendar },
  { href: "/meals", label: "Dinner", icon: IconMeal },
  { href: "/shop", label: "Shop", icon: IconCart },
  { href: "/research", label: "Look into", icon: IconSearch },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-3xl grid-cols-5 px-2 pt-2 pb-2">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-bold ${
                  active ? "text-terracotta" : "text-muted"
                }`}
              >
                <Icon className="h-6 w-6" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
