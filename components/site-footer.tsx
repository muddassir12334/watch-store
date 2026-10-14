import Link from "next/link";
import { categories, products } from "@/lib/products";

const stocked = categories.filter((c) =>
  products.some((p) => p.category === c.slug),
);

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr] lg:px-16">
        <div>
          <p className="text-2xl font-medium tracking-tight">ARZOO</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/50">
            Watches delivered to your door anywhere in Pakistan. Pay with Cash
            on Delivery or Easypaisa.
          </p>
        </div>
        <div>
          <p className="label text-white/40">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {stocked.map((c) => (
              <li key={c.slug}>
                <Link href={`/watches?category=${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label text-white/40">Your order</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link href="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-white">
                Wishlist
              </Link>
            </li>
            <li>
              <Link href="/compare" className="hover:text-white">
                Compare
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="label mx-auto max-w-[1400px] px-5 pb-10 text-white/30 sm:px-10 lg:px-16">
        Prices in PKR · Delivery within Pakistan
      </p>
    </footer>
  );
}
