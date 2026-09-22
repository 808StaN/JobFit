"use client";

import dynamic from "next/dynamic";

const AmbientFlowCanvas = dynamic(() => import("@/components/visual/AmbientFlowCanvas"), {
  ssr: false,
  loading: () => null,
});

export function AmbientSectionShader() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(145deg,#d9efff,#8ec6eb)]"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 5rem, black 100%)",
        maskImage: "linear-gradient(to bottom, transparent 0, black 5rem, black 100%)",
      }}
    >
      <AmbientFlowCanvas />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(238,249,255,0.18),rgba(120,185,231,0.14))]" />
    </div>
  );
}
