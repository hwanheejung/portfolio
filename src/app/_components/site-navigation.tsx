"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/cn";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
] as const;

export function SiteNavigation() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-3 md:py-5">
      <div className="page-shell flex items-center justify-between gap-4">
        <Link
          aria-label="Hwanhee home"
          className="pressable technical-font grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-black/45 text-[0.62rem] font-bold text-white shadow-[0_10px_36px_rgba(0,0,0,0.2)] backdrop-blur-2xl md:size-11"
          href="/"
        >
          HHJ
        </Link>
        <nav
          aria-label="Primary navigation"
          className="nav-rail rounded-full p-1"
        >
          <ul className="technical-font flex items-center text-[0.64rem] font-semibold uppercase tracking-[0.08em] md:text-[0.68rem]">
            {navigationItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "nav-link pressable block rounded-full px-3 py-2.5 text-muted-foreground md:px-4",
                      active &&
                        "text-foreground",
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
