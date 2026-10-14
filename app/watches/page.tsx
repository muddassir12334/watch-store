import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog, CatalogFallback } from "@/components/catalog";

export const metadata: Metadata = {
  title: "All watches",
  description:
    "Browse every watch by category, movement, case size and dial colour. Cash on Delivery and Easypaisa available.",
};

export default function WatchesPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <Catalog />
    </Suspense>
  );
}
