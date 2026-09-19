"use client";

import { useCallback, useRef, useState, type MouseEvent, type RefObject } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from "framer-motion";

type GravityIcon = "none" | "arrow-right" | "arrow-down" | "arrow-up-right" | "download" | "chevron-right" | "plus" | "sparkle" | "lightning" | "star";
type GravityVariant = "primary" | "secondary" | "project";

type GravityColors = {
  background: string;
  backgroundHover: string;
  border: string;
  text: string;
  shadow: string;
};

type GravitySizing = {
  paddingX?: number;
  paddingY?: number;
  borderRadius?: number;
  fontSize?: number;
};

type GravityEffects = {
  magneticStrength?: number;
  textReveal?: boolean;
};

type GravityActionProps = {
  text: string;
  variant?: GravityVariant;
  icon?: GravityIcon;
  iconPosition?: "left" | "right";
  colors?: Partial<GravityColors>;
  effects?: GravityEffects;
  sizing?: GravitySizing;
  fontFamily?: string;
};

export type GravityLinkProps = Omit<HTMLMotionProps<"a">, "children"> & GravityActionProps;
export type GravityButtonProps = Omit<HTMLMotionProps<"button">, "children"> & GravityActionProps;

const variantColors: Record<GravityVariant, GravityColors> = {
  primary: {
    background: "rgba(255, 255, 255, 0.08)",
    backgroundHover: "rgba(255, 255, 255, 0.13)",
    border: "rgba(255, 255, 255, 0.42)",
    text: "#f8fbff",
    shadow: "rgba(255, 255, 255, 0.07)",
  },
  secondary: {
    background: "rgba(255, 255, 255, 0.035)",
    backgroundHover: "rgba(255, 255, 255, 0.075)",
    border: "rgba(255, 255, 255, 0.24)",
    text: "rgba(255, 255, 255, 0.86)",
    shadow: "rgba(255, 255, 255, 0.045)",
  },
  project: {
    background: "rgba(255, 255, 255, 0.04)",
    backgroundHover: "rgba(255, 255, 255, 0.085)",
    border: "rgba(255, 255, 255, 0.25)",
    text: "rgba(244, 249, 255, 0.9)",
    shadow: "rgba(255, 255, 255, 0.045)",
  },
};

function IconSvg({ name, size = 16, color = "currentColor" }: { name: GravityIcon; size?: number; color?: string }) {
  if (name === "none") return null;

  const common = { width: size, height: size, display: "block", flexShrink: 0 };

  switch (name) {
    case "arrow-right":
      return <svg style={common} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
    case "arrow-down":
      return <svg style={common} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>;
    case "arrow-up-right":
      return <svg style={common} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>;
    case "download":
      return <svg style={common} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>;
    case "chevron-right":
      return <svg style={common} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="9 18 15 12 9 6" /></svg>;
    case "plus":
      return <svg style={common} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="5" y1="12" x2="19" y2="12" /><line x1="12" y1="5" x2="12" y2="19" /></svg>;
    case "sparkle":
      return <svg style={common} viewBox="0 0 24 24" fill={color} aria-hidden><path d="M12 2 13.09 8.26 18 6 14.74 10.91 21 12 14.74 13.09 18 18 13.09 15.74 12 22 10.91 15.74 6 18 9.26 13.09 3 12 9.26 10.91 6 6 10.91 8.26 12 2Z" /></svg>;
    case "lightning":
      return <svg style={common} viewBox="0 0 24 24" fill={color} aria-hidden><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" /></svg>;
    case "star":
      return <svg style={common} viewBox="0 0 24 24" fill={color} aria-hidden><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z" /></svg>;
    default:
      return null;
  }
}

function RollingText({ text, isHovered, enabled, fontSize }: { text: string; isHovered: boolean; enabled: boolean; fontSize: number }) {
  if (!enabled) return <span>{text}</span>;

  const lineHeight = fontSize * 1.4;
  return (
    <span style={{ display: "inline-flex", height: lineHeight, lineHeight: `${lineHeight}px`, overflow: "hidden" }}>
      {text.split("").map((character, index) => (
        <span
          key={`${index}-${character}`}
          style={{
            display: "inline-block",
            position: "relative",
            width: character === " " ? fontSize * 0.3 : "auto",
            transform: isHovered ? `translateY(-${lineHeight}px)` : "translateY(0)",
            transition: `transform 0.35s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.025}s`,
          }}
        >
          <span style={{ display: "block", height: lineHeight }}>{character === " " ? "\u00A0" : character}</span>
          <span style={{ display: "block", height: lineHeight }}>{character === " " ? "\u00A0" : character}</span>
        </span>
      ))}
    </span>
  );
}

type GravityActionOptions<T extends HTMLElement> = GravityActionProps & {
  containerRef: RefObject<T | null>;
  style?: HTMLMotionProps<"a">["style"];
  onMouseMove?: (event: MouseEvent<T>) => void;
  onMouseEnter?: (event: MouseEvent<T>) => void;
  onMouseLeave?: (event: MouseEvent<T>) => void;
  disabled?: boolean;
};

type GravityActionContentState = {
  buttonFont: string;
  fontSize: number;
  icon: GravityIcon;
  iconPosition: "left" | "right";
  isHovered: boolean;
  paddingX: number;
  paddingY: number;
  palette: GravityColors;
  text: string;
  textReveal: boolean;
};

function useGravityAction<T extends HTMLElement>({
  containerRef,
  text,
  variant = "primary",
  icon = "arrow-right",
  iconPosition = "right",
  colors,
  effects,
  sizing,
  fontFamily,
  style,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  disabled = false,
}: GravityActionOptions<T>) {
  const palette = { ...variantColors[variant], ...colors };
  const reduceMotion = useReducedMotion();
  const magneticStrength = reduceMotion || disabled ? 0 : effects?.magneticStrength ?? 0.28;
  const textReveal = reduceMotion || disabled ? false : effects?.textReveal ?? true;
  const paddingX = sizing?.paddingX ?? 24;
  const paddingY = sizing?.paddingY ?? 12;
  const borderRadius = sizing?.borderRadius ?? 999;
  const fontSize = sizing?.fontSize ?? 14;
  const buttonFont = fontFamily || "var(--font-sans)";
  const [isHovered, setIsHovered] = useState(false);
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const springX = useSpring(magnetX, { stiffness: 150, damping: 15, mass: 0.5 });
  const springY = useSpring(magnetY, { stiffness: 150, damping: 15, mass: 0.5 });

  const handleMouseMove = useCallback((event: MouseEvent<T>) => {
    onMouseMove?.(event);
    const element = containerRef.current;
    if (!element || magneticStrength === 0) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    magnetX.set((event.clientX - centerX) * magneticStrength);
    magnetY.set((event.clientY - centerY) * magneticStrength);
  }, [containerRef, magneticStrength, magnetX, magnetY, onMouseMove]);

  const handleMouseEnter = useCallback((event: MouseEvent<T>) => {
    onMouseEnter?.(event);
    setIsHovered(true);
  }, [onMouseEnter]);

  const handleMouseLeave = useCallback((event: MouseEvent<T>) => {
    onMouseLeave?.(event);
    setIsHovered(false);
    magnetX.set(0);
    magnetY.set(0);
  }, [magnetX, magnetY, onMouseLeave]);

  const actionStyle: NonNullable<HTMLMotionProps<"a">["style"]> = {
    ...style,
    x: springX,
    y: springY,
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "default" : "pointer",
    borderRadius,
    overflow: "visible",
    isolation: "isolate",
    color: palette.text,
    textDecoration: "none",
    border: `1px solid ${isHovered ? "rgba(255, 255, 255, 0.52)" : palette.border}`,
    background: isHovered ? palette.backgroundHover : palette.background,
    boxShadow: isHovered ? `0 8px 22px ${palette.shadow}` : "0 0 0 rgba(255, 255, 255, 0)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    transition: "border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease",
    WebkitTapHighlightColor: "transparent",
  };

  return {
    buttonFont,
    fontSize,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
    icon,
    iconPosition,
    isHovered,
    palette,
    paddingX,
    paddingY,
    reduceMotion,
    style: actionStyle,
    text,
    textReveal,
  };
}

function GravityActionContent({
  action,
}: {
  action: GravityActionContentState;
}) {
  return (
    <span
      style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: `${action.paddingY}px ${action.paddingX}px`,
        color: action.palette.text,
        fontFamily: action.buttonFont,
        fontSize: action.fontSize,
        fontWeight: 560,
        letterSpacing: "0.035em",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {action.iconPosition === "left" ? <IconSvg name={action.icon} color={action.palette.text} /> : null}
      <RollingText text={action.text} isHovered={action.isHovered} enabled={action.textReveal} fontSize={action.fontSize} />
      {action.iconPosition === "right" ? <IconSvg name={action.icon} color={action.palette.text} /> : null}
    </span>
  );
}

export function GravityLink({
  text,
  variant,
  icon,
  iconPosition,
  colors,
  effects,
  sizing,
  fontFamily,
  style,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...props
}: GravityLinkProps) {
  const containerRef = useRef<HTMLAnchorElement | null>(null);
  const action = useGravityAction<HTMLAnchorElement>({
    containerRef,
    text,
    variant,
    icon,
    iconPosition,
    colors,
    effects,
    sizing,
    fontFamily,
    style,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
  });

  return (
    <motion.a
      ref={containerRef}
      style={action.style}
      onMouseMove={action.handleMouseMove}
      onMouseEnter={action.handleMouseEnter}
      onMouseLeave={action.handleMouseLeave}
      whileTap={action.reduceMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      aria-label={text}
      {...props}
    >
      <GravityActionContent action={action} />
    </motion.a>
  );
}

export function GravityButton({
  text,
  variant,
  icon,
  iconPosition,
  colors,
  effects,
  sizing,
  fontFamily,
  style,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  disabled = false,
  ...props
}: GravityButtonProps) {
  const containerRef = useRef<HTMLButtonElement | null>(null);
  const action = useGravityAction<HTMLButtonElement>({
    containerRef,
    text,
    variant,
    icon,
    iconPosition,
    colors,
    effects,
    sizing,
    fontFamily,
    style,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    disabled,
  });

  return (
    <motion.button
      ref={containerRef}
      style={action.style}
      onMouseMove={action.handleMouseMove}
      onMouseEnter={action.handleMouseEnter}
      onMouseLeave={action.handleMouseLeave}
      whileTap={action.reduceMotion || disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      aria-label={text}
      disabled={disabled}
      {...props}
    >
      <GravityActionContent action={action} />
    </motion.button>
  );
}
