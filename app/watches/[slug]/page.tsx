import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductView } from "@/components/product-view";
import { RecentlyViewed } from "@/components/recently-viewed";
import { accentStyle, Ambient, ProductCard } from "@/components/ui";
import { WatchArt } from "@/components/watch-art";
import {
  currentPrice,
  getCategory,
  getProduct,
  products,
  totalStock,
} from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/watches/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const title = `${product.brand} ${product.name}`;
  return {
    title,
    description: product.description,
    openGraph: { title, description: product.description },
  };
}

// The slug is read inside Suspense so the page shell renders at once, even for
// a product that was not prerendered at build time.
export default function ProductPage({ params }: PageProps<"/watches/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <div role="status" aria-label="Loading watch" className="mx-auto max-w-[1400px] px-5 pt-36 pb-24 sm:px-10 lg:px-16">
      <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_minmax(0,500px)_0.8fr] lg:gap-10">
        <div className="mx-auto aspect-square w-full max-w-[440px] rounded-full bg-white/5 motion-safe:animate-pulse lg:order-2" />
        <div className="space-y-5 lg:order-1">
          <div className="h-3 w-40 rounded-full bg-white/10" />
          <div className="h-12 w-72 max-w-full rounded-2xl bg-white/10" />
          <div className="h-12 w-52 rounded-2xl bg-white/10" />
          <div className="h-5 w-28 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

async function ProductDetails({
  params,
}: Pick<PageProps<"/watches/[slug]">, "params">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .concat(products.filter((p) => p.category !== product.category && p.brand === product.brand))
    .slice(0, 3);

  const specs = [
    ["Brand", product.brand],
    ["Movement", product.movement],
    ["Case size", `${product.caseSize} mm`],
    ["Case material", product.caseMaterial],
    ["Strap material", product.strapMaterial],
    ["Dial colour", product.dialColor],
    ["Water resistance", product.waterResistance],
    ["Gender", product.gender],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.name}`,
    description: product.description,
    sku: product.variants[0].sku,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: currentPrice(product),
      availability:
        totalStock(product) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div style={accentStyle(product.accent)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="relative isolate overflow-hidden">
        <Ambient />
        <ProductView product={product} />
      </div>

      <div className="relative isolate overflow-hidden rounded-t-[2.5rem] bg-white/[0.04]">
        <Ambient className="opacity-40" />
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-16 sm:px-10 lg:grid-cols-2 lg:px-16">
          <section>
            <h2 className="label text-white">
              {product.name} <span className="text-white/40">{product.variants[0].sku}</span>
            </h2>
            <p className="mt-6 max-w-prose text-lg leading-8 text-white/70">{product.description}</p>
            {category && (
              <Link href={`/watches?category=${category.slug}`} className="label mt-8 inline-block text-accent hover:brightness-125">
                More in {category.name}
              </Link>
            )}
          </section>

          <section id="specs" className="scroll-mt-10">
            <h2 className="label text-white">Specifications</h2>
            <dl className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {specs.map(([term, value]) => (
                <div key={term} className="flex justify-between gap-6 py-3.5 text-sm">
                  <dt className="text-white/50">{term}</dt>
                  <dd className="text-right text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {product.variants.length > 1 && (
            <section className="lg:col-span-2">
              <h2 className="label text-white">
                Various <span className="text-white/40">models</span>
              </h2>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {product.variants.map((v) => (
                  <li key={v.sku} className="flex items-center gap-5">
                    <WatchArt look={v.look} className="h-28 w-auto -rotate-12" />
                    <div>
                      <p className="label text-white/50">{v.sku}</p>
                      <p className="mt-1 text-sm text-white">{v.label}</p>
                      <p className="mt-1 text-sm text-white/50">
                        {v.stock > 0 ? `${v.stock} in stock` : "Out of stock"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-10 lg:px-16">
          <h2 className="display text-4xl sm:text-5xl">Related watches</h2>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed exclude={product.slug} />
    </div>
  );
}
