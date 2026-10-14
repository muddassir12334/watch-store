"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type DropdownOption = { value: string; label: string; swatch?: string };

/**
 * Styled replacement for a native <select>. The browser's own option list
 * cannot be themed reliably, so this draws the list itself.
 */
export function Dropdown({
  label,
  value,
  options,
  onChange,
  align = "right",
  placeholder,
  compact,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  /** Which edge of the button the list lines up with. */
  align?: "left" | "right";
  /** Shown on the button while the empty value is selected. */
  placeholder?: string;
  /** Smaller button for tight rows. */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const selected = Math.max(0, options.findIndex((o) => o.value === value));

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const show = () => {
    setCursor(selected);
    setOpen(true);
  };
  const choose = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      return;
    }
    const step = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (step) {
      e.preventDefault();
      if (!open) show();
      else setCursor((cursor + step + options.length) % options.length);
    } else if (e.key === "Home" || e.key === "End") {
      if (!open) return;
      e.preventDefault();
      setCursor(e.key === "Home" ? 0 : options.length - 1);
    } else if ((e.key === "Enter" || e.key === " ") && open) {
      e.preventDefault();
      choose(cursor);
    }
  };

  return (
    <div ref={ref} className="relative z-40" onKeyDown={onKeyDown}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${cursor}` : undefined}
        aria-label={`${label}: ${options[selected].label}`}
        onClick={() => (open ? setOpen(false) : show())}
        className={`label flex items-center rounded-full text-white transition-colors hover:bg-white/20 ${
          compact ? "h-10 gap-2 pr-3 pl-4" : "h-11 gap-3 pr-4 pl-5"
        } ${placeholder && value ? "bg-accent" : "bg-white/10"}`}
      >
        {options[selected].swatch && <span aria-hidden className="h-3.5 w-3.5 rounded-full ring-1 ring-white/30" style={{ background: options[selected].swatch }} />}
        {placeholder && !value ? placeholder : options[selected].label}
        <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className={`absolute top-full mt-2 ${align === "left" ? "left-0" : "right-0"} max-h-[min(28rem,70dvh)] min-w-full overflow-y-auto rounded-3xl bg-[#0A0D12] p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/15`}
        >
          {options.map((option, i) => (
            <li
              key={option.value}
              id={`${id}-${i}`}
              role="option"
              aria-selected={i === selected}
              onPointerEnter={() => setCursor(i)}
              onClick={() => choose(i)}
              className={`label flex cursor-pointer items-center justify-between gap-6 rounded-full px-4 py-3 whitespace-nowrap ${
                i === cursor ? "bg-white/10 text-white" : "text-white/70"
              }`}
            >
              <span className="flex items-center gap-3">
                {option.swatch && <span aria-hidden className="h-4 w-4 rounded-full ring-1 ring-white/30" style={{ background: option.swatch }} />}
                {option.label}
              </span>
              {i === selected && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
