"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Product, WatchLook } from "@/lib/products";
import { CloseIcon } from "./icons";
import { accentStyle, Price, ProductMedia } from "./ui";

/**
 * Full-screen viewer for a watch. With `story` it also shows the description
 * and a link to the product; without it, it is a plain enlarged view.
 */
export function StoryDialog({
  product,
  look,
  story,
  onClose,
}: {
  product: Product | null;
  look?: WatchLook;
  story?: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
  }, [product]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      aria-label={product ? `${product.brand} ${product.name}` : undefined}
      style={product ? accentStyle(product.accent) : undefined}
      className="viewer m-auto max-h-[92dvh] w-[min(94vw,980px)] overflow-y-auto rounded-[2.5rem] bg-[#0A0D12] p-0 text-[#F4F4F2] ring-1 ring-white/10"
    >
      {product && (
        <div className={`relative grid gap-8 p-6 sm:p-10 ${story ? "md:grid-cols-[1.1fr_1fr] md:items-center" : ""}`}>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Close" className="absolute top-5 right-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white/80 hover:text-white">
            <CloseIcon />
          </button>
          <ProductMedia
            product={product}
            look={look ?? product.variants[0].look}
            title={`${product.brand} ${product.name}`}
            natural
            sizes="(min-width: 768px) 520px, 90vw"
            artClassName={`mx-auto w-auto drop-shadow-[0_40px_50px_rgba(0,0,0,0.7)] ${story ? "h-[50dvh]" : "h-[78dvh]"}`}
            photoClassName={`mx-auto w-full rounded-[2rem] ${story ? "" : "max-w-[720px]"}`}
          />
          {story && (
            <div>
              <p className="label text-white/50">{product.brand}</p>
              <h2 className="display mt-4 text-4xl">{product.name}</h2>
              <p className="mt-5 leading-7 text-white/70">{product.description}</p>
              <Price product={product} className="mt-6 block text-lg" />
              <Link href={`/watches/${product.slug}`} className="label mt-7 inline-block rounded-full bg-accent px-6 py-3.5 text-white transition hover:brightness-110">
                View this watch
              </Link>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
