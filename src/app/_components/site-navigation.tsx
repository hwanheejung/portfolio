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
    <header className="page-shell py-8 md:py-12">
      <div className="flex items-center justify-between gap-5">
        <Link
          aria-label="Hwanhee home"
          className="display-font grid size-10 place-items-center rounded-full border border-border bg-card text-xs shadow-sm"
          href="/"
        >
          HW
        </Link>
        <nav
          aria-label="Primary navigation"
          className="rounded-full border border-border bg-card/80 p-1"
        >
          <ul className="flex items-center text-[0.68rem] font-semibold uppercase md:text-xs">
            {navigationItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "display-font block rounded-full px-3 py-2 text-muted-foreground transition-colors hover:text-foreground md:px-4",
                      active && "text-accent",
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <span
                aria-disabled="true"
                className="display-font block cursor-default rounded-full px-3 py-2 text-muted-foreground md:px-4"
              >
                Resume
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
