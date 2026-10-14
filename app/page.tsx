import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";
import { accentStyle, ProductCard } from "@/components/ui";
import type { CSSProperties } from "react";
import { WatchArt } from "@/components/watch-art";
import { categories, featuredSlugs, products } from "@/lib/products";

const slides = featuredSlugs.flatMap((slug) =>
  products.filter((p) => p.slug === slug),
);

const tiles = ["men", "smart", "women"].flatMap((slug) => {
  const category = categories.find((c) => c.slug === slug);
  const product = products.find((p) => p.category === slug);
  return category && product ? [{ category, product }] : [];
});

const editorial = [
  {
    href: "/watches?category=luxury",
    label: "Haute horlogerie",
    title: "The luxury edit",
    src: "/watches/lange-perpetual-lumen.jpg",
    alt: "A dark-dialled watch glowing green on a black strap",
  },
  {
    href: "/watches?category=sports",
    label: "Built for water",
    title: "Sports and dive",
    src: "/watches/steel-diver.jpg",
    alt: "A steel dive watch resting on driftwood",
  },
  {
    href: "/watches",
    label: "The collection",
    title: "Steel, gold and between",
    src: "/watches/collection.jpg",
    alt: "Seven watches laid out side by side on dark slate",
  },
];

const bestSellers = products.filter((p) => p.bestSeller);

const promises = [
  { title: "Cash on Delivery", body: "Pay the rider when your watch arrives." },
  { title: "Easypaisa", body: "Pay from your Easypaisa account at checkout." },
  { title: "Nationwide delivery", body: "Tracked courier delivery to every city in Pakistan." },
];

export default function Home() {
  return (
    <>
      <HeroCarousel slides={slides} />

      <section aria-label="Editorial" className="mx-auto grid max-w-[1400px] gap-6 px-5 pt-4 pb-20 sm:px-10 md:grid-cols-3 lg:px-16">
        {editorial.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            style={{ "--d": `${0.9 + i * 0.12}s` } as CSSProperties}
            className="enter enter-intro group relative isolate flex h-64 flex-col justify-end overflow-hidden rounded-[2.5rem] p-7 ring-1 ring-white/10 transition duration-300 hover:ring-white/40"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="-z-20 object-cover brightness-[0.6] transition duration-700 group-hover:scale-105 group-hover:brightness-90"
            />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <p className="label text-white/60">{item.label}</p>
            <h2 className="display mt-2 text-2xl">{item.title}</h2>
          </Link>
        ))}
      </section>

      <section aria-label="Shop by category" className="mx-auto grid max-w-[1400px] gap-6 px-5 pb-20 sm:px-10 md:grid-cols-3 lg:px-16">
        {tiles.map(({ category, product }) => (
          <Link
            key={category.slug}
            href={`/watches?category=${category.slug}`}
            style={accentStyle(product.accent)}
            className="group relative isolate flex h-72 flex-col justify-end overflow-hidden rounded-[2.5rem] bg-white/5 p-8 ring-1 ring-white/5 transition hover:ring-white/20"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(70% 80% at 80% 20%, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)",
              }}
            />
            <WatchArt
              look={product.variants[0].look}
              className="absolute -top-10 -right-6 -z-10 h-80 w-auto rotate-12 opacity-90 transition-transform duration-500 group-hover:scale-105"
            />
            <h2 className="display text-3xl">{category.name}</h2>
            <p className="mt-2 max-w-[22ch] text-sm text-white/60">{category.blurb}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-10 lg:px-16">
        <div className="flex items-end justify-between gap-6">
          <h2 className="display text-4xl sm:text-6xl">Best sellers</h2>
          <Link href="/watches" className="label text-white/60 hover:text-white">
            View all
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section aria-label="Payment and delivery" className="mx-auto grid max-w-[1400px] gap-10 border-t border-white/10 px-5 py-14 sm:px-10 md:grid-cols-3 lg:px-16">
        {promises.map((item) => (
          <div key={item.title}>
            <h2 className="label text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/50">{item.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
