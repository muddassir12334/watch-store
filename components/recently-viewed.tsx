"use client";

import { products } from "@/lib/products";
import { useRecentlyViewed } from "@/lib/store";
import { ProductCard } from "./ui";

export function RecentlyViewed({ exclude }: { exclude: string }) {
  const recent = useRecentlyViewed();
  const items = recent
    .filter((slug) => slug !== exclude)
    .flatMap((slug) => products.filter((p) => p.slug === slug))
    .slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-10 lg:px-16">
      <h2 className="display text-4xl sm:text-5xl">Recently viewed</h2>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
