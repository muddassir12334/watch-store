"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPKR } from "@/lib/format";
import { currentPrice, findVariant } from "@/lib/products";
import { setCartQty, useCart } from "@/lib/store";
import { MinusIcon, PlusIcon } from "./icons";
import { ProductMedia } from "./ui";

export function CartView() {
  const cart = useCart();
  const [leaving, setLeaving] = useState<string | null>(null);
  // Let the row fade out before it is taken out of the cart.
  const remove = (sku: string) => {
    setLeaving(sku);
    window.setTimeout(() => {
      setCartQty(sku, 0);
      setLeaving(null);
    }, 260);
  };
  const lines = cart.flatMap((line) => {
    const found = findVariant(line.sku);
    return found ? [{ ...found, qty: line.qty }] : [];
  });
  const subtotal = lines.reduce((sum, l) => sum + currentPrice(l.product) * l.qty, 0);
  const saved = lines.reduce((sum, l) => sum + (l.product.price - currentPrice(l.product)) * l.qty, 0);

  if (lines.length === 0) {
    return (
      <div className="py-20">
        <p className="max-w-md text-lg text-white/60">Your cart is empty. Watches you add will be kept here on this device.</p>
        <Link href="/watches" className="label mt-8 inline-block rounded-full bg-accent px-7 py-4 text-white hover:brightness-110">
          Browse watches
        </Link>
      </div>
    );
  }

  const stepper = "grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {lines.map(({ product, variant, qty }) => (
          <li
            key={variant.sku}
            className={`flex gap-5 py-6 transition-[opacity,translate] duration-300 ${leaving === variant.sku ? "-translate-x-4 opacity-0" : ""}`}
          >
            <Link href={`/watches/${product.slug}`} className="grid h-32 w-24 shrink-0 place-items-center overflow-hidden rounded-3xl bg-white/5">
              <ProductMedia product={product} look={variant.look} title={product.name} sizes="96px" artClassName="h-28 w-auto" photoClassName="h-32 w-24" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="label text-white/40">
                {product.brand} · {variant.sku}
              </p>
              <Link href={`/watches/${product.slug}`} className="label mt-1.5 text-sm text-white hover:text-accent">
                {product.name}
              </Link>
              <p className="mt-1 text-sm text-white/50">{variant.label}</p>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                <button type="button" onClick={() => (qty === 1 ? remove(variant.sku) : setCartQty(variant.sku, qty - 1))} aria-label={`Decrease quantity of ${product.name}`} className={stepper}>
                  <MinusIcon width={18} height={18} />
                </button>
                <span className="w-6 text-center tabular-nums" aria-label={`Quantity ${qty}`}>
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setCartQty(variant.sku, qty + 1)}
                  disabled={qty >= variant.stock}
                  aria-label={`Increase quantity of ${product.name}`}
                  className={stepper}
                >
                  <PlusIcon width={18} height={18} />
                </button>
                <button type="button" onClick={() => remove(variant.sku)} className="label ml-2 text-white/50 hover:text-white">
                  Remove
                </button>
              </div>
            </div>
            <p className="shrink-0 text-right tabular-nums">{formatPKR(currentPrice(product) * qty)}</p>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-[2.5rem] bg-white/5 p-8 ring-1 ring-white/5">
        <h2 className="label text-white">Order summary</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-white/50">Subtotal</dt>
            <dd className="tabular-nums">{formatPKR(subtotal + saved)}</dd>
          </div>
          {saved > 0 && (
            <div className="flex justify-between">
              <dt className="text-white/50">Sale discount</dt>
              <dd className="tabular-nums text-accent">− {formatPKR(saved)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-white/50">Delivery</dt>
            <dd className="text-white/50">Calculated at checkout</dd>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-4 text-lg">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPKR(subtotal)}</dd>
          </div>
        </dl>
        <button type="button" disabled className="label mt-8 w-full cursor-not-allowed rounded-full bg-white/10 px-7 py-4 text-white/40">
          Checkout opens soon
        </button>
        <p className="mt-4 text-sm leading-6 text-white/50">
          Online checkout is still being built. You will be able to pay with Cash on Delivery or Easypaisa.
        </p>
        <Link href="/watches" className="label mt-6 inline-block text-white/60 underline decoration-white/30 underline-offset-4 hover:text-white">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
