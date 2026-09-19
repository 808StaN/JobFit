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
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_72%_24%,var(--accent-soft),transparent_48%),linear-gradient(145deg,var(--surface),var(--surface-muted))]"
    >
      <HeroShaderCanvas />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--surface)_0%,color-mix(in_srgb,var(--surface)_84%,transparent)_42%,transparent_78%)]" />
    </div>
  );
}
