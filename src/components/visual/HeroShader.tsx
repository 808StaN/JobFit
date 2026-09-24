import HeroShaderCanvas from "@/components/visual/HeroShaderCanvas";

export function HeroShader() {
  return (
    <div
      aria-hidden
      className="hero-shader pointer-events-none absolute inset-0 overflow-hidden"
    >
      <HeroShaderCanvas />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--surface)_38%,transparent)_0%,color-mix(in_srgb,var(--surface)_18%,transparent)_28%,transparent_56%)]" />
      <div className="absolute inset-y-0 right-0 w-3/5 opacity-25 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:linear-gradient(90deg,transparent,black)]" />
    </div>
  );
}
