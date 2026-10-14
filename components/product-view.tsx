"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePageAccent } from "@/lib/page-accent";
import { badgeFor, type Product } from "@/lib/products";
import {
  addToCart,
  COMPARE_LIMIT,
  recordView,
  toggleCompare,
  toggleWishlist,
  useCart,
  useCompare,
  useWishlist,
} from "@/lib/store";
import { toast } from "@/lib/toast";
import { CompareIcon, HeartIcon, ListIcon, ShareIcon } from "./icons";
import { StoryDialog } from "./story-dialog";
import { SizeGuide } from "./size-guide";
import { BadgePill, Price, ProductMedia } from "./ui";

export function ProductView({ product }: { product: Product }) {
  const router = useRouter();
  const [sku, setSku] = useState(
    (product.variants.find((v) => v.stock > 0) ?? product.variants[0]).sku,
  );
  const [zoomed, setZoomed] = useState(false);
  const cart = useCart();
  const wishlist = useWishlist();
  const compare = useCompare();
  const comparing = compare.includes(product.slug);

  useEffect(() => recordView(product.slug), [product.slug]);
  usePageAccent(product.accent);

  const variant = product.variants.find((v) => v.sku === sku) ?? product.variants[0];
  const inCart = cart.find((line) => line.sku === variant.sku)?.qty ?? 0;
  const canAdd = variant.stock > inCart;
  const wished = wishlist.includes(product.slug);
  const badge = badgeFor(product);

  const add = () => {
    addToCart(variant.sku);
    toast(`${product.name} added to cart`);
  };
  const buyNow = () => {
    if (canAdd) addToCart(variant.sku);
    router.push("/cart");
  };
  const onCompare = () => {
    const result = toggleCompare(product.slug);
    toast(
      result === "full"
        ? `You can compare up to ${COMPARE_LIMIT} watches. Remove one first.`
        : result === "added"
          ? "Added to comparison"
          : "Removed from comparison",
    );
  };
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else {
        await navigator.clipboard.writeText(url);
        toast("Link copied");
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  const iconButton = "grid h-11 w-11 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white";

  return (
    <div className="mx-auto max-w-[1400px] px-5 pt-24 pb-8 sm:px-10 lg:px-16 lg:pb-6">
      <div className="flex h-10 items-center justify-between">
        {badge ? <BadgePill badge={badge} /> : <span />}
        <span className={`label ${variant.stock > 0 ? "text-accent" : "text-white/50"}`}>
          {variant.stock === 0 ? "Out of stock" : variant.stock <= 5 ? `Only ${variant.stock} left` : "Available"}
        </span>
      </div>

      <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_minmax(0,500px)_0.8fr] lg:gap-10">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label={`Enlarge the picture of ${product.name}`}
          className="block w-full cursor-zoom-in lg:order-2"
        >
          <ProductMedia
            key={variant.sku}
            product={product}
            look={variant.look}
            title={`${product.brand} ${product.name}, ${variant.label}`}
            priority
            natural
            sizes="(min-width: 1024px) 580px, 90vw"
            artClassName="mx-auto h-[400px] w-auto motion-safe:animate-watch-in drop-shadow-[0_50px_60px_rgba(0,0,0,0.7)] sm:h-[500px] lg:h-[clamp(340px,calc(100dvh-15rem),620px)]"
            photoClassName="mx-auto my-6 w-full max-w-[500px] lg:max-w-[min(500px,calc((100dvh-19rem)*var(--ar)))] motion-safe:animate-watch-in [mask-image:radial-gradient(ellipse_closest-side,black_62%,transparent_100%)] lg:my-8 lg:scale-115"
          />
        </button>

        <div className="motion-safe:animate-rise lg:order-1">
          <p className="label text-white/80">
            {product.brand} · {variant.sku}
          </p>
          <h1 className="display relative z-10 mt-5 text-[clamp(2.25rem,11.5vw,3rem)] sm:text-6xl lg:text-[clamp(2.75rem,3.6vw,3.5rem)]">{product.name}</h1>
          <Price product={product} className="mt-6 block text-xl" />

          {product.variants.length > 1 && (
            <fieldset className="mt-6">
              <legend className="label text-white/50">
                Colour <span className="ml-1 text-white">{variant.label}</span>
              </legend>
              <div className="mt-3 flex gap-3">
                {product.variants.map((v) => (
                  <label
                    key={v.sku}
                    title={v.label}
                    className={`relative grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white/10 has-checked:ring-2 has-checked:ring-white has-focus-visible:outline-2 has-focus-visible:outline-accent ${
                      v.stock === 0 ? "opacity-40" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="variant"
                      value={v.sku}
                      checked={v.sku === sku}
                      onChange={() => setSku(v.sku)}
                      className="sr-only"
                      aria-label={`${v.label}${v.stock === 0 ? " (out of stock)" : ""}`}
                    />
                    <span
                      className="h-6 w-6 rounded-full ring-1 ring-white/20"
                      style={{ background: `linear-gradient(135deg, ${v.look.caseColor} 50%, ${v.look.strap} 50%)` }}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={buyNow}
              disabled={variant.stock === 0}
              className="label rounded-full bg-accent px-7 py-4 text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
            >
              Buy now
            </button>
            <button
              type="button"
              onClick={add}
              disabled={!canAdd}
              className="label rounded-full bg-white/10 px-7 py-4 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:text-white/40 disabled:hover:bg-white/10"
            >
              {variant.stock === 0 ? "Out of stock" : canAdd ? "Add to cart" : "All stock in cart"}
            </button>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            <SizeGuide caseSize={product.caseSize} />
            {compare.length > 0 && (
              <Link href="/compare" className="label text-white/60 underline decoration-white/30 underline-offset-4 hover:text-white">
                View comparison ({compare.length})
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-2 lg:order-3 lg:flex-col lg:items-end lg:self-center">
          <button
            type="button"
            onClick={() => {
              toast(wished ? "Removed from wishlist" : "Saved to wishlist");
              toggleWishlist(product.slug);
            }}
            aria-pressed={wished}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className={iconButton}
          >
            <HeartIcon fill={wished ? "currentColor" : "none"} className={wished ? "text-accent" : ""} />
          </button>
          <button type="button" onClick={share} aria-label="Share this watch" className={iconButton}>
            <ShareIcon />
          </button>
          <button
            type="button"
            onClick={onCompare}
            aria-pressed={comparing}
            aria-label={comparing ? "Remove from comparison" : "Add to comparison"}
            className={`${iconButton} ${comparing ? "text-accent" : ""}`}
          >
            <CompareIcon />
          </button>
          <a href="#specs" aria-label="Jump to specifications" className={iconButton}>
            <ListIcon />
          </a>
        </div>
      </div>

      <p className="label mt-4 text-white/40">
        Cash on Delivery or Easypaisa · Delivery across Pakistan
      </p>
      <StoryDialog product={zoomed ? product : null} look={variant.look} onClose={() => setZoomed(false)} />
    </div>
  );
}
