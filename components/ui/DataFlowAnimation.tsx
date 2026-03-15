"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface DataFlowAnimationProps {
  direction?: 'horizontal' | 'vertical';
  length?: string;
  color?: "primary" | "secondary" | "accent" | "none";
  className?: string;
  duration?: number;
}

export function DataFlowAnimation({
  direction = "horizontal",
  length = "100px",
  color = "primary",
  className,
  duration = 1.5
}: DataFlowAnimationProps) {
  const isHorizontal = direction === "horizontal";

  // Stable random delay — computed once per mount, not on every re-render
  const stableDelay = useMemo(() => Math.random() * 0.5, []);

  const colors = {
    primary:   "bg-primaryGlow",
    secondary: "bg-secondaryGlow",
    accent:    "bg-accent",
    none:      "bg-white/20",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white/10 rounded-full",
        isHorizontal ? "h-[3px]" : "w-[3px]",
        className
      )}
      style={{
        width:  isHorizontal ? length : undefined,
        height: !isHorizontal ? length : undefined,
      }}
    >
      <motion.div
        className={cn("absolute rounded-full shadow-neon-glow", colors[color])}
        style={{
          width:  isHorizontal ? "30%" : "100%",
          height: isHorizontal ? "100%" : "30%",
          top:  0,
          left: 0,
        }}
        animate={
          isHorizontal
            ? { left: ["-30%", "100%"] }
            : { top:  ["-30%", "100%"] }
        }
        transition={{
          repeat: Infinity,
          duration: duration,
          ease: "linear",
          delay: stableDelay,
        }}
      />
    </div>
  );
}