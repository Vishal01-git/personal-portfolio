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
    primary: "border-primaryGlow/30 hover:border-primaryGlow shadow-[0_0_15px_rgba(0,229,255,0.1)]",
    secondary: "border-secondaryGlow/30 hover:border-secondaryGlow shadow-[0_0_15px_rgba(138,43,226,0.1)]",
    accent: "border-accent/30 hover:border-accent shadow-[0_0_15px_rgba(20,241,149,0.1)]",
    none: "border-white/5",
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
