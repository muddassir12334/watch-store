"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { categories, products } from "@/lib/products";
import { cartCount, useCart, useCompare, useWishlist } from "@/lib/store";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./icons";
import { SearchDialog } from "./search-dialog";

const primaryNav = [
  { category: "", label: "Watches" },
  { category: "luxury", label: "Luxury" },
  { category: "men", label: "Men" },
  { category: "women", label: "Women" },
  { category: "smart", label: "Smart" },
];

const stocked = categories.filter((c) =>
  products.some((p) => p.category === c.slug),
);

const iconLink =
  "relative grid h-10 w-10 place-items-center text-white/70 transition duration-300 hover:-translate-y-0.5 hover:text-white";

function NavLinks({ current }: { current?: string }) {
  return primaryNav.map((item) => {
    const active = current === item.category;
    return (
      <Link
        key={item.label}
        href={item.category ? `/watches?category=${item.category}` : "/watches"}
        aria-current={active ? "page" : undefined}
        className={`label relative py-2 transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-white after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100 ${
          active ? "text-white after:scale-x-100" : "text-white/55 after:scale-x-0"
        }`}
      >
        {item.label}
      </Link>
    );
  });
}

/** Reads the URL to mark the active link; falls back to plain links while prerendering. */
function ActiveNavLinks() {
  const pathname = usePathname();
  const params = useSearchParams();
  const current = pathname === "/watches" ? (params.get("category") ?? "") : undefined;
  return <NavLinks current={current} />;
}

function Count({ value }: { value: number }) {
  if (value === 0) return null;
  // Keyed by value so the badge replays its pop whenever the count changes.
  return (
    <span
      key={value}
      className="absolute top-0.5 right-0 grid h-4 min-w-4 place-items-center rounded-full bg-white px-1 text-[10px] leading-none font-semibold text-black motion-safe:animate-pop"
    >
      {value}
    </span>
  );
}

export function SiteHeader() {
  const [panel, setPanel] = useState<"menu" | "search" | null>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const compare = useCompare();
  const cart = useCart();
  const wishlist = useWishlist();
  const menuOpen = panel === "menu";

  useEffect(() => {
    const dialog = drawer.current;
    if (!dialog) return;
    if (menuOpen && !dialog.open) dialog.showModal();
    if (!menuOpen && dialog.open) dialog.close();
  }, [menuOpen]);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [panel]);

  const close = () => setPanel(null);
  const drawerLink = "display block py-1.5 text-3xl text-white/65 transition-colors hover:text-white";

  return (
    <>
      <header className="enter enter-intro absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex h-24 max-w-[1400px] items-center gap-5 px-5 sm:px-10 lg:px-16">
          <Link href="/" className="text-2xl font-medium tracking-tight">
            ARZOO
          </Link>
          <button
            type="button"
            onClick={() => setPanel("menu")}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className={iconLink}
          >
            <MenuIcon />
          </button>

          <nav className="mx-auto hidden items-center gap-9 lg:flex" aria-label="Primary">
            <Suspense fallback={<NavLinks />}>
              <ActiveNavLinks />
            </Suspense>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:ml-0">
            <button type="button" onClick={() => setPanel("search")} aria-label="Search watches" className={iconLink}>
              <SearchIcon />
            </button>
            <Link href="/account" aria-label="Account" className={`${iconLink} max-sm:hidden`}>
              <UserIcon />
            </Link>
            <Link href="/wishlist" aria-label={`Wishlist, ${wishlist.length} saved`} className={iconLink}>
              <HeartIcon />
              <Count value={wishlist.length} />
            </Link>
            <Link href="/cart" aria-label={`Cart, ${cartCount(cart)} in cart`} className={iconLink}>
              <BagIcon />
              <Count value={cartCount(cart)} />
            </Link>
          </div>
        </div>
      </header>

      <dialog
        ref={drawer}
        aria-label="Menu"
        onClose={close}
        onClick={(e) => e.target === drawer.current && close()}
        className="drawer m-0 h-dvh max-h-none w-[min(88vw,440px)] max-w-none overflow-y-auto bg-[#0A0D12] p-0 text-[#F4F4F2] ring-1 ring-white/10"
      >
        <div className="flex min-h-full flex-col px-7 pb-10 sm:px-10">
          <div className="flex h-24 items-center justify-between">
            <Link href="/" onClick={close} className="text-2xl font-medium tracking-tight">
              ARZOO
            </Link>
            <button type="button" onClick={close} aria-label="Close menu" className={iconLink}>
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="All categories">
            <p className="label text-white/40">Shop</p>
            <ul className="mt-5">
              <li>
                <Link href="/watches" onClick={close} className={drawerLink}>
                  All watches
                </Link>
              </li>
              {stocked.map((c) => (
                <li key={c.slug}>
                  <Link href={`/watches?category=${c.slug}`} onClick={close} className={drawerLink}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="mt-auto grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-8">
            {[
              { href: "/account", label: "Account" },
              { href: "/wishlist", label: `Wishlist${wishlist.length ? ` (${wishlist.length})` : ""}` },
              { href: "/cart", label: `Cart${cart.length ? ` (${cartCount(cart)})` : ""}` },
              { href: "/compare", label: `Compare${compare.length ? ` (${compare.length})` : ""}` },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} className="label text-white/60 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </dialog>

      {panel === "search" && <SearchDialog onClose={close} />}
    </>
  );
}
