"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const CustomCursor = dynamic(() => import("@/components/ui/custom-cursor"), {
  ssr: false,
  loading: () => null,
});

const coarsePointerQuery = "(pointer: coarse)";
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToCursorPreferences(onChange: () => void) {
  const pointer = window.matchMedia(coarsePointerQuery);
  const motion = window.matchMedia(reducedMotionQuery);
  pointer.addEventListener("change", onChange);
  motion.addEventListener("change", onChange);

  return () => {
    pointer.removeEventListener("change", onChange);
    motion.removeEventListener("change", onChange);
  };
}

function cursorIsEnabled() {
  return !window.matchMedia(coarsePointerQuery).matches && !window.matchMedia(reducedMotionQuery).matches;
}

function cursorIsDisabledOnServer() {
  return false;
}

export function DeferredCursor() {
  const enabled = useSyncExternalStore(subscribeToCursorPreferences, cursorIsEnabled, cursorIsDisabledOnServer);

  return enabled ? <CustomCursor color="#2f76b5" /> : null;
}
