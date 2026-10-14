import type { Metadata } from "next";
import { CompareView } from "@/components/compare-view";
import { Ambient } from "@/components/ui";

export const metadata: Metadata = { title: "Compare watches" };

export default function ComparePage() {
  return (
    <div className="relative isolate overflow-hidden">
      <Ambient className="opacity-50" />
      <div className="mx-auto max-w-[1400px] px-5 pt-36 pb-24 sm:px-10 lg:px-16">
        <h1 className="display text-5xl sm:text-7xl">Compare</h1>
        <CompareView />
      </div>
    </div>
  );
}
