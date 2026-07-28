"use client";

import { useEffect, useState } from "react";

import type { ArticleTocItem } from "@/lib/content/toc";
import { cn } from "@/shared/lib/cn";

type Props = {
  items: ArticleTocItem[];
};

export function ArticleToc({ items }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    if (headings.length === 0) return;

    const updateActiveHeading = () => {
      const activationLine = window.innerHeight * 0.3;
      let current = headings[0];

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= activationLine) {
          current = heading;
        } else {
          break;
        }
      }

      if (current) setActiveId(current.id);
    };

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [items]);

  if (items.length < 2) return null;

  return (
    <aside
      aria-label="Table of contents"
      className="group/toc fixed top-1/2 right-[clamp(1rem,2vw,2rem)] z-20 hidden min-h-72 -translate-y-1/2 items-center xl:flex"
    >
      <nav className="pointer-events-none absolute right-3 max-h-[min(75vh,44rem)] w-[min(25rem,calc(100vw-3rem))] origin-right translate-x-3 scale-[0.98] overflow-y-auto rounded-3xl border border-[color-mix(in_srgb,var(--border)_88%,transparent)] bg-[color-mix(in_srgb,var(--card)_92%,transparent)] px-7 pt-[1.65rem] pb-7 opacity-0 shadow-[0_1px_0_rgb(255_255_255/0.05)_inset,0_22px_60px_rgb(0_0_0/0.28)] backdrop-blur-[22px] backdrop-saturate-[145%] transition-[opacity,transform] duration-200 ease-[var(--ease-out)] group-hover/toc:pointer-events-auto group-hover/toc:translate-x-0 group-hover/toc:scale-100 group-hover/toc:opacity-100 group-focus-within/toc:pointer-events-auto group-focus-within/toc:translate-x-0 group-focus-within/toc:scale-100 group-focus-within/toc:opacity-100">
        <p className="mb-3.5 text-[0.78rem] font-[650] tracking-[0.08em] text-accent uppercase">
          On this page
        </p>
        <ol className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={`${item.id}-${item.title}`}>
              <a
                aria-current={activeId === item.id ? "location" : undefined}
                className={cn(
                  "block rounded-lg px-2 py-1.5 text-[0.92rem] leading-[1.35] text-muted-foreground transition-[color,background-color,transform] duration-150 hover:translate-x-0.5 hover:bg-muted hover:text-foreground aria-[current=location]:bg-[color-mix(in_srgb,var(--muted)_78%,transparent)] aria-[current=location]:text-foreground",
                  item.level === 2 && "pl-5 text-[0.86rem]",
                  item.level === 3 && "pl-8 text-[0.82rem]"
                )}
                data-level={item.level}
                href={`#${item.id}`}
                onClick={() => setActiveId(item.id)}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <button
        aria-label="Open table of contents"
        className="flex w-10 cursor-pointer flex-col items-end gap-3 border-0 bg-transparent py-4 transition-opacity duration-150 group-hover/toc:opacity-0 group-focus-within/toc:opacity-0"
        type="button"
      >
        {items.map((item) => (
          <span
            className={cn(
              "h-0.5 w-4 rounded-full bg-[color-mix(in_srgb,var(--muted-foreground)_35%,transparent)] transition-[width,background-color] duration-200 ease-[var(--ease-out)]",
              item.level === 1 && "w-6",
              item.level === 2 && "w-5",
              activeId === item.id && "w-7 bg-foreground"
            )}
            data-active={activeId === item.id ? "true" : undefined}
            data-level={item.level}
            key={`${item.id}-${item.title}`}
          />
        ))}
      </button>
    </aside>
  );
}
