import type { Metadata } from "next";
import Link from "next/link";
import { Ambient } from "@/components/ui";

export const metadata: Metadata = { title: "Account" };

const links = [
  { href: "/wishlist", title: "Wishlist", body: "Watches you have saved." },
  { href: "/cart", title: "Shopping cart", body: "What you are about to order." },
  { href: "/compare", title: "Compare", body: "Up to four watches side by side." },
];

export default function AccountPage() {
  return (
    <div className="relative isolate overflow-hidden">
      <Ambient className="opacity-50" />
      <div className="mx-auto max-w-[1400px] px-5 pt-36 pb-24 sm:px-10 lg:px-16">
        <h1 className="display text-5xl sm:text-7xl">Account</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
          Sign-in is not open yet. Until it is, your wishlist, cart and comparison are kept in this browser on this device, and you can order without an account.
        </p>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {links.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block h-full rounded-[2.5rem] bg-white/5 p-8 ring-1 ring-white/5 transition duration-300 hover:ring-white/30">
                <h2 className="label text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/50">{item.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
