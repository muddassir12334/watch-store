"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { TickIndex } from "./tick-index";

/** Horizontal card row with the ruler pager from the mockups when it overflows. */
export function Rail({
  title,
  fallback,
  children,
}: {
  title: string;
  fallback: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const count = Math.max(1, Math.ceil((el.scrollWidth - 8) / el.clientWidth));
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      setPages(count);
      setPage(atEnd ? count - 1 : Math.min(count - 1, Math.round(el.scrollLeft / el.clientWidth)));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [children]);

  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <h2 className="display text-5xl sm:text-6xl">{title}</h2>
        {pages > 1 ? (
          <TickIndex
            count={pages}
            active={page}
            label={`${title} page`}
            onSelect={(i) => {
              const el = ref.current;
              el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
            }}
          />
        ) : (
          fallback
        )}
      </div>
      <div
        ref={ref}
        className="-mx-5 mt-8 flex snap-x gap-3 overflow-x-auto sm:gap-6 scroll-px-5 px-5 pb-2 no-scrollbar sm:-mx-10 sm:scroll-px-10 sm:px-10 lg:-mx-16 lg:scroll-px-16 lg:px-16"
      >
        {children}
      </div>
    </>
  );
}
