"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const AmbientFlowCanvas = dynamic(() => import("@/components/visual/AmbientFlowCanvas"), {
  ssr: false,
  loading: () => null,
});

export function AmbientSectionShader() {
  const element = useRef<HTMLDivElement>(null);
  const [mountCanvas, setMountCanvas] = useState(false);

  useEffect(() => {
    const target = element.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMountCanvas(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={element}
      aria-hidden
      className="ambient-shader pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 5rem, black calc(100% - 5rem), transparent 100%)",
        maskImage: "linear-gradient(to bottom, transparent 0, black 5rem, black calc(100% - 5rem), transparent 100%)",
      }}
    >
      {mountCanvas ? <AmbientFlowCanvas /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(238,249,255,0.18),rgba(120,185,231,0.14))]" />
    </div>
  );
}
