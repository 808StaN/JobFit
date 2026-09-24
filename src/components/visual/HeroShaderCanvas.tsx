"use client";

import { useEffect, useState } from "react";
import {FlowingGradient, Shader } from "shaders/react";

export default function HeroShaderCanvas() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);

    updateMotion();
    motion.addEventListener("change", updateMotion);
    return () => {
      motion.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <Shader
      className={`absolute inset-0 size-full transition-opacity duration-300 ${ready ? "opacity-95" : "opacity-0"}`}
      colorSpace="srgb"
      toneMapping="neutral"
      disableTelemetry
      onReady={() => setReady(true)}
    >
      
        <FlowingGradient
          colorA="#f5f9ff"
          colorB="#bfdef7"
          colorC="#67b6ea"
          colorD="#dceeff"
          colorSpace="oklch"
          speed={reducedMotion ? 0 : 1}
          distortion={0.42}
          seed={19}
        />
      
    </Shader>
  );
}
