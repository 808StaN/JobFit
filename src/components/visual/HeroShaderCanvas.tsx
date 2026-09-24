"use client";

import { useEffect, useState } from "react";
import { Aurora, FlowingGradient, Paper, Shader } from "shaders/react";

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
      <Paper roughness={0.2} grainScale={1.5} displacement={0.06} seed={37}>
        <FlowingGradient
          colorA="#f5f9ff"
          colorB="#bfdef7"
          colorC="#67b6ea"
          colorD="#dceeff"
          colorSpace="oklch"
          speed={reducedMotion ? 0 : 0.22}
          distortion={0.42}
          seed={19}
        />
      </Paper>
      <Aurora
        colorA="#6eb8e9"
        colorB="#e4f5ff"
        colorC="#4d9edc"
        colorSpace="oklch"
        balance={44}
        intensity={58}
        curtainCount={3}
        speed={reducedMotion ? 0 : 0.85}
        waviness={68}
        rayDensity={26}
        height={150}
        center={{ x: 0.72, y: 0.08 }}
        seed={11}
        blendMode="screen"
        opacity={0.48}
      />
    </Shader>
  );
}
