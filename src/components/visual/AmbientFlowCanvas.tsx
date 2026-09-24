"use client";

import { useEffect, useState } from "react";
import { FlowingGradient, Shader } from "shaders/react";

function mediaMatches(query: string) {
  return window.matchMedia(query).matches;
}

export default function AmbientFlowCanvas() {
  const [reducedMotion, setReducedMotion] = useState(() => mediaMatches("(prefers-reduced-motion: reduce)"));

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);

    motion.addEventListener("change", updateMotion);
    return () => {
      motion.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <Shader className="absolute inset-0 size-full opacity-75" colorSpace="srgb" toneMapping="neutral" disableTelemetry>
      <FlowingGradient
        colorA="#d8efff"
        colorB="#b7dcf5"
        colorC="#78b9e7"
        colorD="#c8e7fa"
        colorSpace="oklch"
        speed={reducedMotion ? 0 : 0.75}
        distortion={0.18}
        seed={41}
      />
    </Shader>
  );
}
