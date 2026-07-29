"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { ArticleSummary } from "@/__generated__/content";

type Direction = "left" | "right";

function MarqueeRow({
  articles,
  direction,
}: {
  articles: readonly ArticleSummary[];
  direction: Direction;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const rateFrameRef = useRef(0);
  const hoveredRef = useRef(false);
  const [cursor, setCursor] = useState({ visible: false, x: 0, y: 0 });

  const animateRate = (target: number) => {
    const animation = animationRef.current;
    if (!animation) return;
    cancelAnimationFrame(rateFrameRef.current);
    const from = animation.playbackRate;
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / 400);
      const eased = 1 - Math.pow(1 - progress, 3);
      animation.playbackRate = from + (target - from) * eased;
      if (progress < 1) rateFrameRef.current = requestAnimationFrame(tick);
    };
    rateFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const createAnimation = () => {
      animationRef.current?.cancel();
      const half = track.scrollWidth / 2;
      const keyframes =
        direction === "left"
          ? [{ transform: "translate3d(0,0,0)" }, { transform: `translate3d(${-half}px,0,0)` }]
          : [{ transform: `translate3d(${-half}px,0,0)` }, { transform: "translate3d(0,0,0)" }];
      animationRef.current = track.animate(keyframes, {
        duration: 48000,
        easing: "linear",
        iterations: Infinity,
      });
    };

    createAnimation();
    const observer = new ResizeObserver(createAnimation);
    observer.observe(track);
    return () => {
      observer.disconnect();
      animationRef.current?.cancel();
      cancelAnimationFrame(rateFrameRef.current);
    };
  }, [direction]);

  const cards = (duplicate: boolean) =>
    articles.map((article) => (
      <Link
        aria-hidden={duplicate || undefined}
        className="group block w-[17.5rem] shrink-0 outline-none md:w-[26.875rem]"
        href={`/articles/${article.slug}`}
        key={`${duplicate ? "copy" : "original"}-${article.slug}`}
        onBlur={() => {
          if (!hoveredRef.current) animationRef.current?.play();
        }}
        onFocus={() => animationRef.current?.pause()}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          hoveredRef.current = true;
          animateRate(0.2);
          setCursor({ visible: true, x: event.clientX, y: event.clientY });
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          hoveredRef.current = false;
          animateRate(1);
          setCursor((current) => ({ ...current, visible: false }));
        }}
        onPointerMove={(event) => {
          if (event.pointerType === "mouse") {
            setCursor({ visible: true, x: event.clientX, y: event.clientY });
          }
        }}
        tabIndex={duplicate ? -1 : undefined}
      >
        <div className="relative aspect-[1.55] overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#1a1d17] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
          {article.thumbnailUrl ? (
            <Image
              alt=""
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              fill
              sizes="(min-width: 768px) 430px, 280px"
              src={article.thumbnailUrl}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(8,9,7,0.55))]" />
          <p className="absolute right-5 bottom-4 left-5 line-clamp-2 text-sm font-medium tracking-[-0.01em] text-white md:text-base">
            {article.title}
          </p>
        </div>
      </Link>
    ));

  return (
    <div className="relative overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden motion-reduce:px-4">
      <div className="flex w-max gap-3 pr-3 md:gap-5 md:pr-5" ref={trackRef}>
        {cards(false)}
        <div aria-hidden="true" className="contents">
          {cards(true)}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed z-[100] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-[#d6ef6b] px-4 py-3 text-xs font-semibold text-[#0b0c09] shadow-2xl transition-opacity duration-150 md:block"
        style={{
          left: cursor.x,
          opacity: cursor.visible ? 1 : 0,
          top: cursor.y,
        }}
      >
        더보기 →
      </div>
    </div>
  );
}

export function ArticlesMarquee({
  articles,
}: {
  articles: readonly ArticleSummary[];
}) {
  const top = articles;
  const bottom = [...articles.slice(2), ...articles.slice(0, 2)].reverse();

  return (
    <div className="space-y-3 md:space-y-5">
      <MarqueeRow articles={top} direction="right" />
      <MarqueeRow articles={bottom} direction="left" />
    </div>
  );
}
