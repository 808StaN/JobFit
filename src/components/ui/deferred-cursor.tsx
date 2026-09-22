"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CustomCursor = dynamic(() => import("@/components/ui/custom-cursor"), {
  ssr: false,
  loading: () => null,
});

type IdleWindow = Window & {
  cancelIdleCallback?: (handle: number) => void;
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
};

export function DeferredCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointer = window.matchMedia("(pointer: coarse)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (pointer.matches || motion.matches) {
      return;
    }

    const idleWindow = window as IdleWindow;
    const enable = () => setEnabled(true);
    const fallback = window.setTimeout(enable, 1_500);
    const idle = idleWindow.requestIdleCallback?.(enable, { timeout: 3_000 });

    return () => {
      window.clearTimeout(fallback);
      if (idle !== undefined) {
        idleWindow.cancelIdleCallback?.(idle);
      }
    };
  }, []);

  return enabled ? <CustomCursor color="#2f76b5" /> : null;
}
