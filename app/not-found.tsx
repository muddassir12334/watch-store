import Link from "next/link";
import { Ambient } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="relative isolate overflow-hidden">
      <Ambient className="opacity-50" />
      <div className="mx-auto max-w-[1400px] px-5 pt-44 pb-32 sm:px-10 lg:px-16">
        <p className="label text-accent">Error 404</p>
        <h1 className="display mt-5 text-5xl sm:text-7xl">Page not found</h1>
        <p className="mt-6 max-w-md text-lg text-white/60">
          This page has moved or the watch is no longer listed.
        </p>
        <Link href="/watches" className="label mt-8 inline-block rounded-full bg-accent px-7 py-4 text-white hover:brightness-110">
          Browse watches
        </Link>
      </div>
    </div>
  );
}
