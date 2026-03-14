import React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primaryGlow/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        {
          // Variants
          "bg-primaryGlow/10 text-primaryGlow border border-primaryGlow/50 hover:bg-primaryGlow/20 hover:shadow-neon-glow": variant === "primary",
          "bg-secondaryGlow/10 text-secondaryGlow border border-secondaryGlow/50 hover:bg-secondaryGlow/20 hover:shadow-[0_0_15px_rgba(138,43,226,0.3)]": variant === "secondary",
          "border border-white/10 bg-surface/50 hover:bg-white/5 text-textPrimary hover:text-white backdrop-blur-md": variant === "outline",
          "hover:bg-white/5 text-textSecondary hover:text-textPrimary": variant === "ghost",
          // Sizes
          "h-9 px-4 text-sm": size === "sm",
          "h-11 px-6 text-base": size === "md",
          "h-14 px-8 text-lg font-semibold": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
