"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  categories,
  currentPrice,
  dialSwatches,
  products,
  type DialColor,
  type Product,
} from "@/lib/products";
import { Dropdown } from "./dropdown";
import { usePageAccent } from "@/lib/page-accent";
import { SearchIcon } from "./icons";
import { Rail } from "./rail";
import { accentStyle, Ambient, ProductCard } from "./ui";

type Filters = {
  category: string;
  brand: string;
  movement: string;
  size: string;
  dial: string;
  q: string;
  sort: string;
};

const EMPTY: Filters = { category: "", brand: "", movement: "", size: "", dial: "", q: "", sort: "" };

const brands = [...new Set(products.map((p) => p.brand))];
const movements = [...new Set(products.map((p) => p.movement))];
const sizes = [...new Set(products.map((p) => p.caseSize))].sort((a, b) => a - b);
const dials = [...new Set(products.map((p) => p.dialColor))];
const stocked = categories.filter((c) => products.some((p) => p.category === c.slug));

const sorts: Record<string, { label: string; compare: (a: Product, b: Product) => number }> = {
  "price-asc": { label: "Price: low to high", compare: (a, b) => currentPrice(a) - currentPrice(b) },
  "price-desc": { label: "Price: high to low", compare: (a, b) => currentPrice(b) - currentPrice(a) },
  newest: { label: "Newest", compare: (a, b) => Number(!!b.isNew) - Number(!!a.isNew) },
  "best-selling": { label: "Best selling", compare: (a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller) },
};

function applyFilters(filters: Filters) {
  const q = filters.q.trim().toLowerCase();
  const list = products.filter(
    (p) =>
      (!filters.category || p.category === filters.category) &&
      (!filters.brand || p.brand === filters.brand) &&
      (!filters.movement || p.movement === filters.movement) &&
      (!filters.size || String(p.caseSize) === filters.size) &&
      (!filters.dial || p.dialColor === filters.dial) &&
      (!q ||
        [p.name, p.brand, p.category, ...p.variants.map((v) => v.sku)]
          .join(" ")
          .toLowerCase()
          .includes(q)),
  );
  const sort = sorts[filters.sort];
  return sort ? [...list].sort(sort.compare) : list;
}

function Group({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="shrink-0">
      <p className="label text-white">
        {label} {value && <span className="ml-1 text-accent">{value}</span>}
      </p>
      <div className="mt-3 flex items-center gap-2">{children}</div>
    </div>
  );
}

function CatalogView({
  filters,
  onChange,
  searchOpen = false,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  searchOpen?: boolean;
}) {
  const [showSearch, setShowSearch] = useState(searchOpen || filters.q !== "");
  const [query, setQuery] = useState(filters.q);
  // The filter bar gains its frosted backdrop once it is pinned to the top.
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const results = applyFilters(filters);
  const toggle = (key: keyof Filters, value: string) =>
    onChange({ [key]: filters[key] === value ? "" : value });
  const sections = stocked
    .map((category) => ({
      category,
      items: results.filter((p) => p.category === category.slug),
    }))
    .filter((s) => s.items.length > 0);
  const narrowed = [filters.brand, filters.movement, filters.size, filters.dial, filters.q].some(Boolean);
  // Changes whenever the result set does, so cards replay their entrance.
  const signature = results.map((p) => p.slug).join("|");
  // The page tint follows whichever collection is crossing the middle of the screen.
  const root = useRef<HTMLDivElement>(null);
  const [sectionAccent, setSectionAccent] = useState<string | null>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSectionAccent((entry.target as HTMLElement).dataset.accent ?? null);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    el.querySelectorAll("section[data-accent]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [signature]);
  const accent =
    sectionAccent ?? products.find((p) => p.category === filters.category)?.accent ?? "#c98a5e";
  usePageAccent(accent);

  const tools = (
            <div className="flex shrink-0 items-center gap-3">
              {narrowed && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    onChange({ ...EMPTY, category: filters.category, sort: filters.sort });
                  }}
                  className="label h-11 rounded-full px-2 text-white/60 underline decoration-white/30 underline-offset-4 hover:text-white"
                >
                  Reset filters
                </button>
              )}
              <button
                type="button"
                aria-label="Search"
                aria-expanded={showSearch}
                onClick={() => setShowSearch(!showSearch)}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <SearchIcon />
              </button>
            </div>
  );

  return (
    <div ref={root} style={accentStyle(accent)} className="accent-shift relative isolate overflow-x-clip">
      {/* Pinned to the screen so the glow stays in view the whole way down the page. */}
      <div aria-hidden className="pointer-events-none sticky top-0 -z-10 -mb-[100dvh] h-dvh">
        <Ambient />
      </div>
      <div className="mx-auto max-w-[1400px] px-5 pt-32 pb-24 sm:px-10 lg:px-16">
        <h1 className="sr-only">Watches</h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="-mx-5 flex min-w-0 flex-1 gap-2.5 overflow-x-auto px-5 no-scrollbar max-sm:basis-full sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Category">
            {[{ slug: "", name: "All" }, ...stocked].map((c) => (
              <button
                key={c.slug}
                type="button"
                aria-pressed={filters.category === c.slug}
                onClick={() => onChange({ category: c.slug })}
                className={`label shrink-0 rounded-full px-5 py-3 transition-colors ${
                  filters.category === c.slug
                    ? "bg-accent text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Dropdown
              label="Brand"
              align="left"
              value={filters.brand}
              onChange={(brand) => onChange({ brand })}
              options={[{ value: "", label: "All brands" }, ...brands.map((b) => ({ value: b, label: b }))]}
            />
            <Dropdown
              label="Sort by"
              value={filters.sort}
              onChange={(sort) => onChange({ sort })}
              options={[
                { value: "", label: "Featured" },
                ...Object.entries(sorts).map(([value, sort]) => ({ value, label: sort.label })),
              ]}
            />
          </div>
        </div>

        <div ref={sentinel} aria-hidden className="mt-6 h-px" />
        <div
          className={`sticky top-0 z-30 -mx-5 rounded-b-[2rem] px-5 py-4 transition-[background-color,box-shadow] duration-300 sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16 ${
            stuck ? "bg-ink/70 shadow-[0_24px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl" : ""
          }`}
        >
          {/* Below desktop width the three filters fold into dropdowns. */}
          <div className="flex flex-wrap items-center gap-2 lg:hidden">
            <Dropdown
              compact
              align="left"
              label="Movement"
              placeholder="Movement"
              value={filters.movement}
              onChange={(movement) => onChange({ movement })}
              options={[{ value: "", label: "Any movement" }, ...movements.map((m) => ({ value: m, label: m }))]}
            />
            <Dropdown
              compact
              align="left"
              label="Case size"
              placeholder="Size"
              value={filters.size}
              onChange={(size) => onChange({ size })}
              options={[{ value: "", label: "Any size" }, ...sizes.map((size) => ({ value: String(size), label: `${size} mm` }))]}
            />
            <Dropdown
              compact
              label="Dial colour"
              placeholder="Dial"
              value={filters.dial}
              onChange={(dial) => onChange({ dial })}
              options={[{ value: "", label: "Any dial" }, ...dials.map((d) => ({ value: d, label: d, swatch: dialSwatches[d as DialColor] }))]}
            />
            <div className="ml-auto">{tools}</div>
          </div>

          <div className="hidden items-end gap-x-7 overflow-x-auto py-2 no-scrollbar sm:px-1 lg:flex xl:justify-between">
            <Group label="Movement" value={filters.movement}>
              {movements.map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={filters.movement === m}
                  onClick={() => toggle("movement", m)}
                  className={`label h-11 rounded-full px-4 transition-colors ${
                    filters.movement === m ? "bg-accent text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {m}
                </button>
              ))}
            </Group>
            <Group label="Sizes" value={filters.size && `${filters.size} mm`}>
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={filters.size === String(s)}
                  aria-label={`${s} millimetres`}
                  onClick={() => toggle("size", String(s))}
                  className={`grid h-11 w-11 place-items-center rounded-full text-sm font-medium outline-1 outline-offset-2 outline-dashed transition-colors ${
                    filters.size === String(s)
                      ? "bg-accent text-white outline-accent"
                      : "bg-white/10 text-white/80 outline-white/20 hover:bg-white/20"
                  }`}
                >
                  {s}
                </button>
              ))}
            </Group>
            <Group label="Dial" value={filters.dial}>
              {dials.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={filters.dial === d}
                  aria-label={`${d} dial`}
                  title={d}
                  onClick={() => toggle("dial", d)}
                  className={`grid h-11 w-11 place-items-center rounded-full bg-white/10 transition ${
                    filters.dial === d ? "ring-2 ring-white" : "hover:bg-white/20"
                  }`}
                >
                  <span className="h-6 w-6 rounded-full ring-1 ring-white/20" style={{ background: dialSwatches[d as DialColor] }} />
                </button>
              ))}
            </Group>

            {tools}
          </div>

          {showSearch && (
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onChange({ q: e.target.value });
              }}
              placeholder="Search by name, brand or SKU"
              aria-label="Search watches"
              className="mt-4 w-full border-b border-white/20 bg-transparent pb-3 text-2xl font-light placeholder:text-white/30 focus:border-white focus:outline-none"
            />
          )}
        </div>

        <p className="sr-only" role="status">
          {results.length} {results.length === 1 ? "watch" : "watches"} found
        </p>

        {sections.length === 0 && (
          <div className="py-24 text-center">
            <h2 className="display text-4xl">No watches match</h2>
            <p className="mt-4 text-white/50">Try removing a filter or searching for a brand such as Meridian or Kestrel.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                onChange(EMPTY);
              }}
              className="label mt-8 rounded-full bg-accent px-6 py-3.5 text-white hover:brightness-110"
            >
              Clear filters
            </button>
          </div>
        )}

        {sections.map(({ category, items }) => {
          const count = (
            <p className="label text-white/40">
              {String(items.length).padStart(2, "0")} {items.length === 1 ? "model" : "models"}
            </p>
          );
          return (
            <section key={category.slug} data-accent={items[0].accent} className="mt-16">
              {filters.category ? (
                <>
                  <div className="flex items-end justify-between gap-6">
                    <h2 className="display text-5xl sm:text-6xl">{category.name}</h2>
                    {count}
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                    {items.map((p, i) => (
                      <ProductCard key={`${p.slug}:${signature}`} product={p} index={i} />
                    ))}
                  </div>
                </>
              ) : (
                <Rail title={category.name} fallback={count}>
                  {items.map((p, i) => (
                    <ProductCard key={`${p.slug}:${signature}`} product={p} index={i} className="w-[43vw] max-w-[380px] shrink-0 snap-start sm:w-[380px]" />
                  ))}
                </Rail>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export function Catalog() {
  const params = useSearchParams();
  const router = useRouter();
  const filters: Filters = {
    category: params.get("category") ?? "",
    brand: params.get("brand") ?? "",
    movement: params.get("movement") ?? "",
    size: params.get("size") ?? "",
    dial: params.get("dial") ?? "",
    q: params.get("q") ?? "",
    sort: params.get("sort") ?? "",
  };
  const onChange = (patch: Partial<Filters>) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...filters, ...patch })) {
      if (value) next.set(key, value);
    }
    if (params.has("search")) next.set("search", "1");
    const query = next.toString();
    router.replace(query ? `/watches?${query}` : "/watches", { scroll: false });
  };
  const searchOpen = params.has("search");
  return <CatalogView key={String(searchOpen)} filters={filters} onChange={onChange} searchOpen={searchOpen} />;
}

/** Prerendered into the static shell while the URL filters are read on the client. */
export function CatalogFallback() {
  return <CatalogView filters={EMPTY} onChange={() => {}} />;
}
