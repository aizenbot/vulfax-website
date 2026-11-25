"use client";

import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE_OUT_EXPO, MQ_FINE_POINTER } from "@/lib/constants";

/**
 * Abstract "3D-inspired" hero visual built from CSS gradients and SVG only —
 * no WebGL, no 3D library. Layers react to the pointer with different depths
 * on desktop; on touch devices / reduced motion it stays still.
 */
export function HeroOrb() {
  const finePointer = useMediaQuery(MQ_FINE_POINTER);
  const reducedMotion = useReducedMotion();
  const interactive = finePointer && !reducedMotion;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  const coreX = useTransform(sx, (v) => v * 14);
  const coreY = useTransform(sy, (v) => v * 14);
  const ringX = useTransform(sx, (v) => v * -26);
  const ringY = useTransform(sy, (v) => v * -26);
  const tiltX = useTransform(sy, (v) => 62 + v * -8);
  const tiltY = useTransform(sx, (v) => v * 10);

  useEffect(() => {
    if (!interactive) {
      mx.set(0);
      my.set(0);
      return;
    }
    function onMove(event: PointerEvent) {
      mx.set((event.clientX / window.innerWidth) * 2 - 1);
      my.set((event.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, mx, my]);

  return (
    <m.div
      data-reveal=""
      aria-hidden
      className="relative aspect-square w-full max-w-[min(34rem,88vw)] select-none"
      initial={{ opacity: 0, scale: 0.86 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.35 }}
    >
      {/* Atmospheric glow */}
      <div className="animate-pulse-glow absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgb(101_117_255/0.55),rgb(139_92_246/0.25)_45%,transparent_70%)]" />

      {/* Outer dashed ring */}
      <m.div className="absolute inset-0" style={{ x: ringX, y: ringY }}>
        <div className="animate-spin-slower absolute inset-[2%] rounded-full border border-dashed border-white/[0.09]" />
        <div className="animate-spin-slow absolute inset-[12%] rounded-full border border-white/[0.06]">
          <span className="absolute top-[8%] left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_12px_2px_rgb(0_212_255/0.8)]" />
        </div>
      </m.div>

      {/* Tilted orbital rings (fake 3D via rotateX) */}
      <m.div
        className="absolute inset-[4%] [transform-style:preserve-3d]"
        style={{ rotateX: tiltX, rotateY: tiltY, x: ringX, y: ringY }}
      >
        <div className="animate-spin-slow absolute inset-0 rounded-full border border-primary/40 shadow-[0_0_30px_rgb(101_117_255/0.25)]">
          <span className="absolute top-1/2 -right-1 size-2.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_16px_4px_rgb(101_117_255/0.9)]" />
        </div>
        <div className="animate-spin-slower absolute inset-[14%] rounded-full border border-violet/35">
          <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-violet shadow-[0_0_14px_3px_rgb(139_92_246/0.9)]" />
        </div>
      </m.div>

      {/* Core sphere */}
      <m.div className="absolute inset-[27%]" style={{ x: coreX, y: coreY }}>
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#c9cfff_6%,#6575ff_28%,#3b2a8f_58%,#0b0d18_82%)] shadow-[0_0_80px_-10px_rgb(101_117_255/0.85),inset_-20px_-30px_60px_rgb(0_0_0/0.55)]" />
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_210deg,transparent_0deg,rgb(0_212_255/0.35)_60deg,transparent_140deg)] mix-blend-screen" />
        <div className="absolute inset-[8%] rounded-full border border-white/10" />
        <svg viewBox="0 0 200 200" className="absolute inset-0 size-full opacity-40">
          <defs>
            <clipPath id="vx-orb-clip">
              <circle cx="100" cy="100" r="100" />
            </clipPath>
          </defs>
          <g clipPath="url(#vx-orb-clip)" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="0.6">
            <ellipse cx="100" cy="100" rx="100" ry="34" />
            <ellipse cx="100" cy="100" rx="100" ry="68" />
            <ellipse cx="100" cy="100" rx="34" ry="100" />
            <ellipse cx="100" cy="100" rx="68" ry="100" />
          </g>
        </svg>
      </m.div>

      {/* Floor reflection */}
      <div className="absolute inset-x-[15%] -bottom-[6%] h-[14%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(101_117_255/0.35),transparent_70%)]" />
    </m.div>
  );
}
