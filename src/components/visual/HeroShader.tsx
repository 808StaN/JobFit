"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroShaderCanvas = dynamic(() => import("@/components/visual/HeroShaderCanvas"), {
  ssr: false,
  loading: () => null,
});

type IdleWindow = Window & {
  cancelIdleCallback?: (handle: number) => void;
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
};

export function HeroShader() {
  const [mountCanvas, setMountCanvas] = useState(false);

  useEffect(() => {
    const idleWindow = window as IdleWindow;
    const mount = () => setMountCanvas(true);
    const fallback = window.setTimeout(mount, 1_500);
    const idle = idleWindow.requestIdleCallback?.(mount, { timeout: 3_000 });

    return () => {
      window.clearTimeout(fallback);
      if (idle !== undefined) {
        idleWindow.cancelIdleCallback?.(idle);
      }
    };
  }, []);

  return (
    <div
      aria-hidden
      className="hero-shader pointer-events-none absolute inset-0 overflow-hidden"
    >
      {mountCanvas ? <HeroShaderCanvas /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--surface)_38%,transparent)_0%,color-mix(in_srgb,var(--surface)_18%,transparent)_28%,transparent_56%)]" />
      <div className="absolute inset-y-0 right-0 w-3/5 opacity-25 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:linear-gradient(90deg,transparent,black)]" />
    </div>
  );
}
