"use client";

import { useToasts } from "@/lib/toast";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex flex-col items-center gap-2 px-5">
      {toasts.map((t) => (
        <p key={t.id} className="label animate-toast rounded-full bg-[#F4F4F2] px-6 py-3.5 text-black shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {t.message}
        </p>
      ))}
    </div>
  );
}
