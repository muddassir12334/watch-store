"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

const WHEEL_GAP_MS = 320;
const DRAG_STEP_PX = 36;
/** Distance between two numbered stops on the looping ruler. */
const STEP = 58;
const TICKS = 4;

type Props = {
  count: number;
  active: number;
  onSelect?: (index: number) => void;
  label: string;
  /**
   * Looping ruler: the active stop stays in the centre and the scale slides
   * under it, wrapping from the last stop back to the first.
   */
  loop?: boolean;
};

/** Wheel and drag/swipe stepping shared by both pager styles. */
function useScrub({ count, active, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const lastWheel = useRef(0);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  // Attached by hand because React's wheel listener is passive and could not
  // stop the page from scrolling underneath.
  useEffect(() => {
    const el = ref.current;
    if (!el || !onSelect) return;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!delta) return;
      e.preventDefault();
      if (e.timeStamp - lastWheel.current < WHEEL_GAP_MS) return;
      lastWheel.current = e.timeStamp;
      onSelect((active + (delta > 0 ? 1 : -1) + count) % count);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [active, count, onSelect]);

  return {
    ref,
    onPointerDown: (e: PointerEvent) => {
      drag.current = { x: e.clientX, moved: false };
    },
    onPointerMove: (e: PointerEvent) => {
      const current = drag.current;
      if (!current || !onSelect) return;
      const dx = e.clientX - current.x;
      if (Math.abs(dx) < DRAG_STEP_PX) return;
      drag.current = { x: e.clientX, moved: true };
      // Dragging left pulls the next stop in.
      onSelect((active + (dx < 0 ? 1 : -1) + count) % count);
    },
    onPointerLeave: () => {
      drag.current = null;
    },
    // A drag that ends over a number should not also count as a click on it.
    onClickCapture: (e: { stopPropagation: () => void }) => {
      if (drag.current?.moved) e.stopPropagation();
      drag.current = null;
    },
  };
}

/**
 * Ruler-style pager from the mockups. Click a number, scroll the wheel over
 * it, or drag/swipe along it to move.
 */
export function TickIndex(props: Props) {
  return props.loop ? <LoopRuler {...props} /> : <LinearRuler {...props} />;
}

function LinearRuler(props: Props) {
  const { count, active, onSelect, label } = props;
  const scrub = useScrub(props);
  return (
    <div
      {...scrub}
      role="group"
      aria-label={label}
      className="relative z-10 flex cursor-grab touch-pan-y items-center font-mono text-[10px] text-white/40 select-none active:cursor-grabbing"
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect?.(i)}
          aria-label={`${label} ${i + 1} of ${count}`}
          aria-current={i === active}
          className={`flex cursor-pointer items-center gap-1 px-1 py-3 tracking-[0.3em] transition-colors hover:text-white ${
            i === active ? "text-white" : ""
          }`}
        >
          <span aria-hidden className="hidden md:inline">ıııı</span>
          {String(i + 1).padStart(2, "0")}
          <span aria-hidden className="hidden md:inline">ıııı</span>
        </button>
      ))}
    </div>
  );
}

function LoopRuler(props: Props) {
  const { count, active, onSelect, label } = props;
  const scrub = useScrub(props);

  // `pos` counts steps without wrapping, so going from the last stop to the
  // first keeps sliding the same way instead of rewinding the whole scale.
  const [track, setTrack] = useState({ active, pos: active });
  if (track.active !== active) {
    let delta = (((active - track.active) % count) + count) % count;
    if (delta > count / 2) delta -= count;
    setTrack({ active, pos: track.pos + delta });
  }
  const { pos } = track;
  const reach = Math.min(4, Math.floor((count - 1) / 2) + 2);
  const stops = Array.from({ length: reach * 2 + 1 }, (_, i) => pos - reach + i);

  return (
    <div
      {...scrub}
      role="group"
      aria-label={label}
      className="relative z-10 h-11 w-[210px] cursor-grab touch-pan-y overflow-hidden font-mono text-[10px] select-none [mask-image:linear-gradient(90deg,transparent,black_32%,black_68%,transparent)] active:cursor-grabbing sm:w-[330px]"
    >
      <div
        className="absolute top-0 left-1/2 h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(${-pos * STEP}px)` }}
      >
        {stops.map((v) => {
          const index = ((v % count) + count) % count;
          const current = v === pos;
          // Only the nearest copy of each stop is exposed to keyboards and screen readers.
          const duplicate = Math.abs(v - pos) > Math.floor(count / 2) || (count % 2 === 0 && v - pos === -count / 2);
          // The ticks either side of the active number light up.
          const lit = v === pos || v === pos - 1;
          return (
            <div key={v} className="absolute top-0 h-full" style={{ left: v * STEP }}>
              <button
                type="button"
                onClick={() => onSelect?.(index)}
                aria-label={`${label} ${index + 1} of ${count}`}
                aria-current={current}
                aria-hidden={duplicate || undefined}
                tabIndex={duplicate ? -1 : undefined}
                className={`absolute top-1/2 grid h-11 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center tracking-[0.12em] transition-colors duration-500 hover:text-white ${
                  current ? "text-white" : "text-white/35"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
              {Array.from({ length: TICKS }, (_, k) => (
                <span
                  key={k}
                  aria-hidden
                  className={`absolute top-1/2 h-1.5 w-px -translate-y-1/2 transition-colors duration-500 ${lit ? "bg-white" : "bg-white/30"}`}
                  style={{ left: ((k + 1.5) * STEP) / (TICKS + 2) }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
