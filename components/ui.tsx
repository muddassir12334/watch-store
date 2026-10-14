import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { formatPKR } from "@/lib/format";
import { badgeFor, type Badge, type Product, type WatchLook } from "@/lib/products";
import { WatchArt } from "./watch-art";

export function accentStyle(color: string) {
  return { "--accent": color } as CSSProperties;
}

/** Soft coloured light behind a section. Parent needs `relative isolate overflow-hidden`. */
export function Ambient({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700 ${className}`}
      style={{
        background:
          "radial-gradient(60% 70% at calc(18% + var(--px) * 2.5%) calc(18% + var(--py) * 2.5%), color-mix(in oklab, var(--accent) 55%, transparent), transparent 70%), radial-gradient(40% 50% at calc(85% + var(--px) * 1.5%) calc(95% + var(--py) * 1.5%), color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
      }}
    />
  );
}

/** A product's photo when it has one, otherwise the drawn stand-in. */
export function ProductMedia({
  product,
  look,
  artClassName,
  photoClassName,
  sizes,
  title,
  priority,
  natural,
}: {
  product: Product;
  look: WatchLook;
  artClassName: string;
  photoClassName: string;
  sizes: string;
  title?: string;
  priority?: boolean;
  /** Size the frame from the photo's own proportions (wide shots are cropped to 4:3). */
  natural?: boolean;
}) {
  const photo = product.image;
  if (!photo) return <WatchArt look={look} title={title} className={artClassName} />;
  const ratio = Math.min(photo.width / photo.height, 4 / 3);
  return (
    <div
      className={`relative overflow-hidden ${photoClassName}`}
      style={natural ? ({ aspectRatio: ratio, "--ar": ratio } as CSSProperties) : undefined}
    >
      <Image
        src={photo.src}
        alt={title ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

export function BadgePill({ badge, className = "" }: { badge: Badge; className?: string }) {
  return (
    <span
      className={`label inline-block rounded-full px-4 py-2.5 ${
        badge.tone === "accent"
          ? "bg-accent/20 text-white"
          : "bg-white/10 text-white/70"
      } ${className}`}
    >
      {badge.label}
    </span>
  );
}

export function Price({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <span className={className}>
      <span className="text-accent">{formatPKR(product.salePrice ?? product.price)}</span>
      {product.salePrice && (
        <s className="ml-2 text-white/40">{formatPKR(product.price)}</s>
      )}
    </span>
  );
}

export function ProductCard({
  product,
  className = "",
  index,
}: {
  product: Product;
  className?: string;
  /** Position in a list; staggers the entrance animation. */
  index?: number;
}) {
  const badge = badgeFor(product);
  const variant = product.variants.find((v) => v.stock > 0) ?? product.variants[0];
  return (
    <Link
      href={`/watches/${product.slug}`}
      style={{ ...accentStyle(product.accent), animationDelay: index === undefined ? undefined : `${Math.min(index, 8) * 70}ms` }}
      className={`group relative isolate flex flex-col overflow-hidden rounded-[1.75rem] bg-black/60 p-3 ring-1 sm:rounded-[2.5rem] sm:p-6 ring-white/5 transition hover:ring-white/20 ${
        index === undefined ? "" : "motion-safe:animate-rise"
      } ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 40%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 75%)",
        }}
      />
      <div className="h-7 sm:h-9">{badge && <BadgePill badge={badge} className="max-sm:px-2.5! max-sm:py-1.5! max-sm:text-[10px]!" />}</div>
      <ProductMedia
        product={product}
        look={variant.look}
        sizes="(min-width: 1024px) 360px, 45vw"
        artClassName="mx-auto my-2 h-40 w-auto -rotate-12 sm:h-64 drop-shadow-[0_30px_30px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105"
        photoClassName="my-2 h-36 w-full rounded-2xl bg-black sm:h-64 sm:rounded-[1.75rem]"
      />
      <div className="mt-auto px-1 pb-1 sm:px-2 sm:pb-2">
        <p className="label text-white/40 max-sm:text-[10px]!">
          {product.brand}
          <span className="max-sm:hidden"> · {variant.sku}</span>
        </p>
        <h3 className="label mt-1.5 text-white max-sm:text-[11px]! sm:mt-2 sm:text-sm">{product.name}</h3>
        <Price product={product} className="mt-1.5 block text-xs sm:mt-2 sm:text-sm" />
      </div>
    </Link>
  );
}
