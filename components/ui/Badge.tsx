import React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "accent" | "outline";
}

export function Badge({ className, variant = "primary", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-mono font-medium transition-colors",
        {
          "bg-primaryGlow/10 text-primaryGlow border border-primaryGlow/30": variant === "primary",
          "bg-secondaryGlow/10 text-secondaryGlow border border-secondaryGlow/30": variant === "secondary",
          "bg-accent/10 text-accent border border-accent/30": variant === "accent",
          "text-textSecondary border border-white/10 bg-surface/50": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
