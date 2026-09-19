"use client";

import dynamic from "next/dynamic";

const HeroShaderCanvas = dynamic(() => import("@/components/visual/HeroShaderCanvas"), {
  ssr: false,
  loading: () => null,
});

export function HeroShader() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_76%_20%,#b9ddf8,transparent_45%),linear-gradient(145deg,#f8fbff,#dcecf9)]"
    >
      <HeroShaderCanvas />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--surface)_0%,color-mix(in_srgb,var(--surface)_70%,transparent)_38%,transparent_72%)]" />
      <div className="absolute inset-y-0 right-0 w-3/5 opacity-25 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:linear-gradient(90deg,transparent,black)]" />
    </div>
  );
}
