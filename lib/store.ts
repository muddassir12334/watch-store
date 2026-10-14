"use client";

import { useSyncExternalStore } from "react";
import { findVariant } from "./products";

// Cart and wishlist live in localStorage until customer accounts exist.

export type CartLine = { sku: string; qty: number };

const CART_KEY = "arzoo.cart";
const WISHLIST_KEY = "arzoo.wishlist";

const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function read<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return fallback;
  }
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  let value = fallback;
  if (raw) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode); the change is dropped.
  }
  listeners.forEach((listener) => listener());
}

const EMPTY_CART: CartLine[] = [];
const EMPTY_WISHLIST: string[] = [];

export function useCart() {
  return useSyncExternalStore(
    subscribe,
    () => read(CART_KEY, EMPTY_CART),
    () => EMPTY_CART,
  );
}

export function useWishlist() {
  return useSyncExternalStore(
    subscribe,
    () => read(WISHLIST_KEY, EMPTY_WISHLIST),
    () => EMPTY_WISHLIST,
  );
}

export function cartCount(cart: CartLine[]) {
  return cart.reduce((sum, line) => sum + line.qty, 0);
}

export function setCartQty(sku: string, qty: number) {
  const stock = findVariant(sku)?.variant.stock ?? 0;
  const next = Math.max(0, Math.min(qty, stock));
  const cart = read(CART_KEY, EMPTY_CART);
  write(
    CART_KEY,
    next > 0
      ? cart.map((line) => (line.sku === sku ? { sku, qty: next } : line))
      : cart.filter((line) => line.sku !== sku),
  );
}

export function addToCart(sku: string, qty = 1) {
  const current = read(CART_KEY, EMPTY_CART).find((line) => line.sku === sku);
  const cart = read(CART_KEY, EMPTY_CART);
  const stock = findVariant(sku)?.variant.stock ?? 0;
  const next = Math.min((current?.qty ?? 0) + qty, stock);
  if (next <= 0) return;
  write(
    CART_KEY,
    current
      ? cart.map((line) => (line.sku === sku ? { sku, qty: next } : line))
      : [...cart, { sku, qty: next }],
  );
}

export function toggleWishlist(slug: string) {
  const list = read(WISHLIST_KEY, EMPTY_WISHLIST);
  write(
    WISHLIST_KEY,
    list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug],
  );
}

const COMPARE_KEY = "arzoo.compare";
const RECENT_KEY = "arzoo.recent";
export const COMPARE_LIMIT = 4;
const RECENT_LIMIT = 8;

export function useCompare() {
  return useSyncExternalStore(
    subscribe,
    () => read(COMPARE_KEY, EMPTY_WISHLIST),
    () => EMPTY_WISHLIST,
  );
}

export function toggleCompare(slug: string): "added" | "removed" | "full" {
  const list = read(COMPARE_KEY, EMPTY_WISHLIST);
  if (list.includes(slug)) {
    write(COMPARE_KEY, list.filter((s) => s !== slug));
    return "removed";
  }
  if (list.length >= COMPARE_LIMIT) return "full";
  write(COMPARE_KEY, [...list, slug]);
  return "added";
}

export function useRecentlyViewed() {
  return useSyncExternalStore(
    subscribe,
    () => read(RECENT_KEY, EMPTY_WISHLIST),
    () => EMPTY_WISHLIST,
  );
}

export function recordView(slug: string) {
  const list = read(RECENT_KEY, EMPTY_WISHLIST);
  if (list[0] === slug) return;
  write(RECENT_KEY, [slug, ...list.filter((s) => s !== slug)].slice(0, RECENT_LIMIT));
}
