"use client";

import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MQ_FINE_POINTER } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
}

/**
 * Card with a subtle 3D tilt and a cursor-following spotlight.
 * Effects only run on fine-pointer desktops with motion allowed; elsewhere it
 * renders as a static card.
 */
export function TiltCard({ children, className, max = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery(MQ_FINE_POINTER);
  const reducedMotion = useReducedMotion();
  const enabled = finePointer && !reducedMotion;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    px.set(x);
    py.set(y);
    ref.current.style.setProperty("--spot-x", `${x * 100}%`);
    ref.current.style.setProperty("--spot-y", `${y * 100}%`);
  }

  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div className="h-full [perspective:1200px]">
      <m.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={enabled ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className={cn(
          "border-glow group relative h-full overflow-hidden rounded-card border border-line bg-surface/80 transition-colors duration-500 hover:border-white/12",
          className,
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 0%), rgb(101 117 255 / 0.14), transparent 60%)",
          }}
        />
        {children}
      </m.div>
    </div>
  );
}
