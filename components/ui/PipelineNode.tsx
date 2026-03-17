import React from 'react';
import { cn } from '@/utils/cn';

export interface PipelineNodeProps {
  icon: React.ReactNode;
  label: string;
  glowColor?: "primary" | "secondary" | "accent" | "none";
  status?: "active" | "idle" | "processing";
  isActive?: boolean;
  className?: string;
}

export function PipelineNode({
  icon,
  label,
  glowColor = "primary",
  status = "idle",
  isActive = false,
  className,
}: PipelineNodeProps) {

  // ── FIX: 'none' always resolves to 'primary' — every node glows ───────
  const effectiveColor: "primary" | "secondary" | "accent" =
    glowColor === "none" ? "primary" : glowColor;

  // Border + shadow — all three colors always produce a visible glow
  const glowClasses = {
    primary:   "border-primaryGlow/60   shadow-[0_0_12px_rgba(217,119,6,0.45),0_0_28px_rgba(217,119,6,0.20)]",
    secondary: "border-secondaryGlow/60 shadow-[0_0_12px_rgba(194,65,12,0.45),0_0_28px_rgba(194,65,12,0.20)]",
    accent:    "border-accent/60        shadow-[0_0_12px_rgba(253,230,138,0.45),0_0_28px_rgba(253,230,138,0.20)]",
  };

  // Status dot fill — matches the node's own glow color so it feels alive
  // 'idle' gets a dimmed version of the glow color; active/processing are full bright
  const statusFill: Record<"primary" | "secondary" | "accent", Record<"active" | "idle" | "processing", string>> = {
    primary:   { active: 'var(--accent)',        idle: 'var(--primaryGlow)',   processing: 'var(--primaryGlow)'   },
    secondary: { active: 'var(--primaryGlow)',   idle: 'var(--secondaryGlow)', processing: 'var(--secondaryGlow)' },
    accent:    { active: 'var(--primaryGlow)',   idle: 'var(--accent)',        processing: 'var(--accent)'        },
  };

  const dotOpacity = status === 'idle' ? 0.5 : 1;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 transition-transform duration-300",
        isActive && "scale-110",
        className
      )}
    >
      <div
        className={cn(
          "relative w-[72px] h-[72px] rounded-2xl flex items-center justify-center backdrop-blur-md border-2 transition-all duration-300",
          glowClasses[effectiveColor],
          isActive && "ring-2 ring-white/40"
        )}
        style={{ backgroundColor: 'var(--surface)' }}
      >
        {/* Status dot — color matches node's own glow, ring cuts from node edge */}
        <div
          className={cn(
            "absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2",
            status === 'processing' && "animate-pulse"
          )}
          style={{
            backgroundColor: statusFill[effectiveColor][status],
            opacity: dotOpacity,
            borderColor: 'var(--background)',
          }}
        />

        {/* Icon — uses textPrimary so it's readable in both modes */}
        <div style={{ color: 'var(--textPrimary)', opacity: 0.85, transform: 'scale(1.25)' }}>
          {icon}
        </div>
      </div>

      <span
        className="font-mono text-sm font-medium text-center w-24 leading-tight"
        style={{ color: 'var(--textSecondary)' }}
      >
        {label}
      </span>
    </div>
  );
}