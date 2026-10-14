"use client";

import Link from "next/link";
import { products } from "@/lib/products";
import { toggleWishlist, useWishlist } from "@/lib/store";
import { ProductCard } from "./ui";

export function WishlistView() {
  const wishlist = useWishlist();
  const items = products.filter((p) => wishlist.includes(p.slug));

  if (items.length === 0) {
    return (
      <div className="py-20">
        <p className="max-w-md text-lg text-white/60">Nothing saved yet. Tap the heart on any watch to keep it here.</p>
        <Link href="/watches" className="label mt-8 inline-block rounded-full bg-accent px-7 py-4 text-white hover:brightness-110">
          Browse watches
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
      {items.map((product) => (
        <li key={product.slug} className="flex flex-col">
          <ProductCard product={product} className="flex-1" />
          <button type="button" onClick={() => toggleWishlist(product.slug)} className="label mt-4 self-start px-2 text-white/50 hover:text-white">
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
