"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPKR } from "@/lib/format";
import { categories, currentPrice, products } from "@/lib/products";
import { CloseIcon, SearchIcon } from "./icons";
import { ProductMedia } from "./ui";

const brands = [...new Set(products.map((p) => p.brand))];
const stocked = categories.filter((c) => products.some((p) => p.category === c.slug));

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const productHits = q
    ? products
        .filter((p) =>
          [p.name, p.brand, ...p.variants.map((v) => v.sku)].join(" ").toLowerCase().includes(q),
        )
        .slice(0, 5)
    : [];
  const brandHits = q ? brands.filter((b) => b.toLowerCase().includes(q)) : brands;
  const categoryHits = q ? stocked.filter((c) => c.name.toLowerCase().includes(q)) : stocked;
  const nothing = q && !productHits.length && !brandHits.length && !categoryHits.length;

  const chip = "label rounded-full bg-white/10 px-4 py-3 text-white/80 hover:bg-white/20";

  return (
    <div role="dialog" aria-modal="true" aria-label="Search" className="fixed inset-0 z-50 overflow-y-auto bg-ink/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1000px] px-5 pt-8 pb-16 sm:px-10">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (!q) return;
            router.push(`/watches?q=${encodeURIComponent(query.trim())}`);
            onClose();
          }}
          className="flex items-center gap-4 border-b border-white/20 pb-4 focus-within:border-white"
        >
          <SearchIcon className="shrink-0 text-white/50" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search watches, brands, SKUs"
            aria-label="Search watches"
            className="min-w-0 flex-1 bg-transparent text-2xl font-light placeholder:text-white/30 focus:outline-none sm:text-3xl"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="grid h-10 w-10 shrink-0 place-items-center text-white/70 hover:text-white">
            <CloseIcon />
          </button>
        </form>

        <div aria-live="polite">
          {nothing && (
            <p className="mt-10 text-white/60">
              No matches for “{query.trim()}”. Try a brand such as {brands.slice(0, 2).join(" or ")}, or browse a category below.
            </p>
          )}

          {productHits.length > 0 && (
            <section className="mt-10">
              <h2 className="label text-white/40">Watches</h2>
              <ul className="mt-4 divide-y divide-white/10">
                {productHits.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/watches/${p.slug}`} onClick={onClose} className="group flex items-center gap-5 py-3">
                      <ProductMedia product={p} look={p.variants[0].look} sizes="48px" artClassName="h-16 w-auto -rotate-12" photoClassName="h-16 w-12 rounded-xl" />
                      <span className="min-w-0 flex-1">
                        <span className="label block text-white/40">{p.brand}</span>
                        <span className="label mt-1 block text-sm text-white group-hover:text-accent">{p.name}</span>
                      </span>
                      <span className="text-sm tabular-nums text-white/70">{formatPKR(currentPrice(p))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(nothing ? brands : brandHits).length > 0 && (
            <section className="mt-10">
              <h2 className="label text-white/40">Brands</h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {(nothing ? brands : brandHits).map((b) => (
                  <Link key={b} href={`/watches?q=${encodeURIComponent(b)}`} onClick={onClose} className={chip}>
                    {b}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(nothing ? stocked : categoryHits).length > 0 && (
            <section className="mt-10">
              <h2 className="label text-white/40">Categories</h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {(nothing ? stocked : categoryHits).map((c) => (
                  <Link key={c.slug} href={`/watches?category=${c.slug}`} onClick={onClose} className={chip}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
