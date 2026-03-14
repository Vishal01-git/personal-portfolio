import React from "react";
import { cn } from "@/utils/cn";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: "primary" | "secondary" | "accent" | "none";
  interactive?: boolean;
}

export function GlassCard({
  children,
  glowColor = "none",
  interactive = false,
  className,
  ...props
}: GlassCardProps) {
  const glowClasses = {
    // Uses CSS variable shadows so they auto-update with any palette change
    primary:   "border-primaryGlow/30   hover:border-primaryGlow/60   shadow-neon-glow",
    secondary: "border-secondaryGlow/30 hover:border-secondaryGlow/60 shadow-[var(--shadow-neon-subtle)]",
    accent:    "border-accent/30        hover:border-accent/60        shadow-[var(--shadow-neon-subtle)]",
    none:      "border-white/5",
  };

  return (
    <div
      className={cn(
        "bg-surface/60 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300",
        glowClasses[glowColor],
        interactive && "hover:-translate-y-1 hover:shadow-neon-glow cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}