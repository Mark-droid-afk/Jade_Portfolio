import Image from "next/image";
import type { Project } from "@/lib/data";

// Phone or window frame around a project image (or a wireframe until a screenshot is added).
export function Frame({ p, sizes = "(min-width: 1024px) 560px, 90vw" }: { p: Project; sizes?: string }) {
  if (p.frame === "phone") {
    return (
      <div className="mx-auto w-56 rounded-[2.4rem] border-[9px] border-[#0b0f0e] bg-[#0b0f0e] shadow-2xl shadow-black/50 sm:w-64">
        <div className="relative aspect-[9/17] overflow-hidden rounded-[1.8rem]" style={{ background: p.imageBg ?? "#fff" }}>
          <span aria-hidden className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-[#0b0f0e]" />
          {p.image ? <Image src={p.image} alt={`${p.name} app`} fill sizes="256px" className="object-contain p-6" /> : <Wire />}
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-forest shadow-2xl shadow-black/50">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-abyss px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-coral" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F2B632]" />
        <span className="h-2.5 w-2.5 rounded-full bg-jade" />
        <span className="ml-3 truncate text-xs text-white/50">{p.name}</span>
      </div>
      <div className="relative aspect-[16/10]" style={{ background: p.imageBg ?? "#0B3328" }}>
        {p.image ? <Image src={p.image} alt={`${p.name} screenshot`} fill sizes={sizes} className="object-cover" /> : <Wire />}
      </div>
    </div>
  );
}

// Shown until a screenshot is added to /public/projects and set as `image` in lib/data.ts.
function Wire() {
  return (
    <div className="absolute inset-0 flex gap-3 p-4">
      <div className="w-1/5 space-y-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-3 rounded bg-white/15" />
        ))}
      </div>
      <div className="flex-1 space-y-3">
        <div className="h-6 w-1/2 rounded bg-white/15" />
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-mint/20" />
          ))}
        </div>
        <div className="h-24 rounded-lg bg-white/10" />
      </div>
      <p className="absolute bottom-3 right-4 text-xs text-white/50">Screenshot coming soon</p>
    </div>
  );
}
