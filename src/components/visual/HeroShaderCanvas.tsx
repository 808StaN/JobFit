"use client";

import { useEffect, useState } from "react";
import { FlowingGradient, Paper, Shader } from "shaders/react";

function mediaMatches(query: string) {
  return window.matchMedia(query).matches;
}

export default function HeroShaderCanvas() {
  const [dark, setDark] = useState(() => mediaMatches("(prefers-color-scheme: dark)"));
  const [reducedMotion, setReducedMotion] = useState(() => mediaMatches("(prefers-reduced-motion: reduce)"));

  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateDark = () => setDark(darkMode.matches);
    const updateMotion = () => setReducedMotion(motion.matches);

    darkMode.addEventListener("change", updateDark);
    motion.addEventListener("change", updateMotion);
    return () => {
      darkMode.removeEventListener("change", updateDark);
      motion.removeEventListener("change", updateMotion);
    };
  }, []);

  const palette = dark
    ? ["#0d1511", "#183e30", "#2d6e55", "#101b16"]
    : ["#edf1ec", "#cce6da", "#8fb8a6", "#f6f2e8"];

  return (
    <Shader
      className="absolute inset-0 size-full opacity-80"
      colorSpace="srgb"
      toneMapping="neutral"
      disableTelemetry
    >
      <Paper roughness={0.12} grainScale={2.2} displacement={0.025} seed={37}>
        <FlowingGradient
          colorA={palette[0]}
          colorB={palette[1]}
          colorC={palette[2]}
          colorD={palette[3]}
          colorSpace="oklch"
          speed={reducedMotion ? 0 : 0.08}
          distortion={0.18}
          seed={19}
        />
      </Paper>
    </Shader>
  );
}
