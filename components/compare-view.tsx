"use client";

import Link from "next/link";
import { formatPKR } from "@/lib/format";
import { currentPrice, products, totalStock, type Product } from "@/lib/products";
import { COMPARE_LIMIT, toggleCompare, useCompare } from "@/lib/store";
import { accentStyle, ProductMedia } from "./ui";

const rows: { label: string; value: (p: Product) => string }[] = [
  { label: "Price", value: (p) => formatPKR(currentPrice(p)) },
  { label: "Availability", value: (p) => (totalStock(p) > 0 ? "In stock" : "Out of stock") },
  { label: "Movement", value: (p) => p.movement },
  { label: "Case size", value: (p) => `${p.caseSize} mm` },
  { label: "Case material", value: (p) => p.caseMaterial },
  { label: "Strap material", value: (p) => p.strapMaterial },
  { label: "Dial colour", value: (p) => p.dialColor },
  { label: "Water resistance", value: (p) => p.waterResistance },
  { label: "Gender", value: (p) => p.gender },
];

export function CompareView() {
  const compare = useCompare();
  const items = compare.flatMap((slug) => products.filter((p) => p.slug === slug));

  if (items.length === 0) {
    return (
      <div className="py-20">
        <p className="max-w-md text-lg text-white/60">
          Nothing to compare yet. Use the compare button on a watch&apos;s page to add up to {COMPARE_LIMIT} watches.
        </p>
        <Link href="/watches" className="label mt-8 inline-block rounded-full bg-accent px-7 py-4 text-white hover:brightness-110">
          Browse watches
        </Link>
      </div>
    );
  }

  return (
    <div className="-mx-5 mt-12 overflow-x-auto px-5 sm:-mx-10 sm:px-10 lg:mx-0 lg:px-0">
      <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-x-3 text-sm">
        <caption className="sr-only">Side by side comparison of {items.length} watches</caption>
        <thead>
          <tr>
            <td className="w-32" />
            {items.map((p) => (
              <th key={p.slug} scope="col" style={accentStyle(p.accent)} className="rounded-t-[2rem] bg-white/5 px-5 pt-6 text-left align-bottom font-normal">
                <Link href={`/watches/${p.slug}`} className="group block">
                  <ProductMedia
                    product={p}
                    look={p.variants[0].look}
                    sizes="260px"
                    artClassName="mx-auto h-44 w-auto -rotate-12 drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)]"
                    photoClassName="h-44 w-full rounded-3xl"
                  />
                  <span className="label mt-4 block text-white/40">{p.brand}</span>
                  <span className="label mt-1.5 block text-sm text-white group-hover:text-accent">{p.name}</span>
                </Link>
                <button type="button" onClick={() => toggleCompare(p.slug)} className="label mt-3 pb-4 text-white/50 hover:text-white" aria-label={`Remove ${p.name} from comparison`}>
                  Remove
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const values = items.map(row.value);
            const differs = new Set(values).size > 1;
            return (
              <tr key={row.label}>
                <th scope="row" className="label border-t border-white/10 py-4 pr-3 text-left align-top font-medium text-white/40">
                  {row.label}
                </th>
                {items.map((p, col) => (
                  <td
                    key={p.slug}
                    className={`border-t border-white/10 bg-white/5 px-5 py-4 align-top ${
                      i === rows.length - 1 ? "rounded-b-[2rem] pb-6" : ""
                    } ${differs ? "text-white" : "text-white/50"}`}
                  >
                    {values[col]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-6 text-sm text-white/40">Values that differ between watches are shown brighter.</p>
    </div>
  );
}
