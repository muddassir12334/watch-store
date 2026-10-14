"use client";

import { useRef } from "react";
import { CloseIcon } from "./icons";

const rows = [
  { wrist: "Under 15 cm", min: 0, max: 36, cases: "28 to 36 mm" },
  { wrist: "15 to 17 cm", min: 37, max: 40, cases: "37 to 40 mm" },
  { wrist: "17 to 19 cm", min: 41, max: 44, cases: "41 to 44 mm" },
  { wrist: "Over 19 cm", min: 45, max: 99, cases: "45 mm and up" },
];

export function SizeGuide({ caseSize }: { caseSize: number }) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="label text-white/60 underline decoration-white/30 underline-offset-4 hover:text-white"
      >
        Size guide
      </button>
      <dialog
        ref={ref}
        aria-labelledby="size-guide-title"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto w-[min(92vw,560px)] rounded-[2.5rem] bg-[#0d1016] p-0 text-white ring-1 ring-white/10"
      >
        <div className="p-8">
          <div className="flex items-start justify-between gap-6">
            <h2 id="size-guide-title" className="display text-3xl">
              Wrist fit guide
            </h2>
            <button type="button" onClick={() => ref.current?.close()} aria-label="Close size guide" className="grid h-10 w-10 shrink-0 place-items-center text-white/70 hover:text-white">
              <CloseIcon />
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Wrap a tape measure, or a strip of paper you can mark, around your wrist just above the wrist bone. This watch has a{" "}
            <strong className="font-medium text-white">{caseSize} mm</strong> case.
          </p>
          <table className="mt-6 w-full text-left text-sm">
            <thead>
              <tr className="label text-white/40">
                <th scope="col" className="pb-3 font-medium">Wrist</th>
                <th scope="col" className="pb-3 font-medium">Case size that suits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 border-y border-white/10">
              {rows.map((row) => {
                const match = caseSize >= row.min && caseSize <= row.max;
                return (
                  <tr key={row.wrist} className={match ? "text-white" : "text-white/50"}>
                    <td className="py-3.5">{row.wrist}</td>
                    <td className="py-3.5">
                      {row.cases}
                      {match && <span className="label ml-3 rounded-full bg-accent/25 px-3 py-1.5 text-white">This watch</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-6 text-sm leading-6 text-white/50">
            A general guide only. Choose a size down for a dressier, slimmer look or a size up for a bolder one.
          </p>
        </div>
      </dialog>
    </>
  );
}
