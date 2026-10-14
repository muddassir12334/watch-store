"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { usePageAccent } from "@/lib/page-accent";
import { badgeFor, getCategory, totalStock, type Product } from "@/lib/products";
import { NextIcon, PrevIcon } from "./icons";
import { StoryDialog } from "./story-dialog";
import { TickIndex } from "./tick-index";
import { accentStyle, Ambient, BadgePill, Price, ProductMedia } from "./ui";

const AUTOPLAY_MS = 7000;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

function delay(seconds: number) {
  return { "--d": `${seconds}s` } as CSSProperties;
}

export function HeroCarousel({ slides }: { slides: Product[] }) {
  const [index, setIndex] = useState(0);
  // Autoplay stops for good once the visitor takes control.
  const [touched, setTouched] = useState(false);
  const [paused, setPaused] = useState(false);
  const [story, setStory] = useState<Product | null>(null);
  const ref = useRef<HTMLElement>(null);

  const count = slides.length;
  const product = slides[index];
  const prev = slides[(index - 1 + count) % count];
  const next = slides[(index + 1) % count];
  const badge = badgeFor(product);
  usePageAccent(product.accent);

  const go = (i: number) => {
    setTouched(true);
    setIndex((i + count) % count);
  };

  useEffect(() => {
    if (touched || paused || story) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [touched, paused, story, count]);

  // Feeds the .parallax-* rules in globals.css; mouse only.
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const box = el.getBoundingClientRect();
    el.style.setProperty("--px", (((e.clientX - box.left) / box.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--py", (((e.clientY - box.top) / box.height) * 2 - 1).toFixed(3));
  };

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label="Featured watches"
      onPointerMove={onPointerMove}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="parallax-root relative isolate overflow-hidden"
    >
      {slides.map((slide, i) => (
        <div key={slide.slug} style={accentStyle(slide.accent)}>
          <Ambient className={`duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`} />
        </div>
      ))}

      <div style={accentStyle(product.accent)} className="accent-shift mx-auto max-w-[1400px] px-5 pt-28 pb-8 sm:px-10 lg:px-16">
        <div className="enter enter-intro flex h-10 items-center justify-between" style={delay(0.1)}>
          {badge ? <BadgePill badge={badge} /> : <span />}
          <span className="label text-accent transition-colors duration-700">
            {totalStock(product) > 0 ? "Available" : "Out of stock"}
          </span>
        </div>

        <div className="grid" aria-live="polite">
          {slides.map((slide, i) => {
            const active = i === index;
            const variant = slide.variants[0];
            const category = getCategory(slide.category);
            const Title = active ? "h1" : "p";
            return (
              <div
                key={slide.slug}
                inert={!active}
                style={accentStyle(slide.accent)}
                className={`col-start-1 row-start-1 grid items-center gap-6 transition-[opacity,scale,visibility] duration-700 ${EASE} lg:grid-cols-[1.2fr_minmax(0,520px)_0.8fr] lg:gap-10 ${
                  active ? "opacity-100" : "invisible scale-[0.97] opacity-0"
                }`}
              >
                <div className="enter enter-intro parallax-watch flex min-h-[340px] items-center sm:min-h-[460px] lg:order-2 lg:min-h-[clamp(340px,calc(100dvh-17rem),580px)]" style={delay(0.45)}>
                  <div className="w-full motion-safe:animate-float">
                    <ProductMedia
                      product={slide}
                      look={variant.look}
                      title={`${slide.brand} ${slide.name}`}
                      priority={i === 0}
                      natural
                      sizes="(min-width: 1024px) 650px, 90vw"
                      artClassName="mx-auto h-[340px] w-auto -rotate-[18deg] drop-shadow-[0_50px_60px_rgba(0,0,0,0.7)] sm:h-[460px] lg:h-[clamp(340px,calc(100dvh-17rem),580px)]"
                      photoClassName="mx-auto w-full max-w-[520px] lg:max-w-[min(520px,calc((100dvh-21rem)*var(--ar)))] [mask-image:radial-gradient(ellipse_closest-side,black_62%,transparent_100%)] lg:scale-125"
                    />
                  </div>
                </div>

                <div
                  className={`enter enter-intro transition-[translate,opacity] delay-150 duration-700 ${EASE} lg:order-1 ${active ? "" : "translate-y-5 opacity-0"}`}
                  style={delay(0.25)}
                >
                  <p className="label text-white/50">
                    {category?.name} · {slide.brand}
                  </p>
                  <Title className="display relative z-10 mt-5 max-w-[9ch] text-[clamp(2.25rem,11.5vw,3rem)] sm:text-6xl lg:text-[clamp(2.75rem,3.6vw,3.5rem)]">
                    {slide.name}
                  </Title>
                  <Price product={slide} className="mt-6 block text-lg" />
                  <Link
                    href={`/watches/${slide.slug}`}
                    className="label mt-8 inline-block rounded-full bg-accent px-6 py-3.5 text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
                  >
                    Find out more
                  </Link>
                </div>

                <div className="enter enter-intro hidden justify-self-end lg:order-3 lg:block" style={delay(0.65)}>
                  <button
                    type="button"
                    onClick={() => setStory(slide)}
                    aria-label={`Open the story of ${slide.name}`}
                    className="group relative block w-48 overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 transition duration-300 hover:ring-white/40"
                  >
                    <ProductMedia
                      product={slide}
                      look={variant.look}
                      sizes="200px"
                      artClassName="h-32 w-full scale-[2.4] transition-transform duration-700 group-hover:scale-[2.6]"
                      photoClassName="h-32 w-full scale-150 brightness-75 transition duration-700 group-hover:scale-[1.6] group-hover:brightness-100"
                    />
                    <span className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-white shadow-lg">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                    </span>
                  </button>
                  <p className="mt-5 max-w-[26ch] text-sm leading-6 text-white/50">
                    {slide.movement} · {slide.caseSize} mm · {slide.caseMaterial}
                    <br />
                    Strap: {slide.strapMaterial} · {slide.waterResistance}
                  </p>
                  <p className="label mt-4 text-white/30">{variant.sku}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="enter enter-intro relative z-10 mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4" style={delay(0.8)}>
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="label flex items-center gap-3 justify-self-start text-left text-white/50 transition-colors hover:text-white"
          >
            <PrevIcon />
            <span className="hidden sm:inline">{prev.name}</span>
            <span className="sr-only sm:hidden">Previous: {prev.name}</span>
          </button>
          <TickIndex loop count={count} active={index} onSelect={go} label="Slide" />
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="label flex items-center gap-3 justify-self-end text-right text-white/50 transition-colors hover:text-white"
          >
            <span className="hidden sm:inline">{next.name}</span>
            <span className="sr-only sm:hidden">Next: {next.name}</span>
            <NextIcon />
          </button>
        </div>
      </div>

      <StoryDialog product={story} story onClose={() => setStory(null)} />
    </section>
  );
}
