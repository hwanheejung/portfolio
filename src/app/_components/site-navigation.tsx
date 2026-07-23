"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/cn";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
] as const;

export function SiteNavigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 py-3 md:py-4">
      <div className="page-shell flex items-center justify-between gap-4">
        <Link
          aria-label="Hwanhee home"
          className="maker-mark pressable technical-font shrink-0 text-[0.66rem] font-bold"
          href="/"
        >
          HHJ
        </Link>
        <nav
          aria-label="Primary navigation"
          className="nav-rail rounded-xl p-1"
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
                      "nav-link pressable block rounded-lg px-3 py-2.5 text-muted-foreground md:px-4",
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
