import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { Ambient } from "@/components/ui";

export const metadata: Metadata = { title: "Shopping cart" };

export default function CartPage() {
  return (
    <div className="relative isolate overflow-hidden">
      <Ambient className="opacity-50" />
      <div className="mx-auto max-w-[1400px] px-5 pt-36 pb-24 sm:px-10 lg:px-16">
        <h1 className="display text-5xl sm:text-7xl">Shopping cart</h1>
        <CartView />
      </div>
    </div>
  );
}
