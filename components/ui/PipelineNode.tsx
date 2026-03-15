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

export function PipelineNode({ icon, label, glowColor = "primary", status = "idle", isActive = false, className }: PipelineNodeProps) {
  const glowClasses = {
    primary: "border-primaryGlow/50 shadow-neon-glow",
    secondary: "border-secondaryGlow/50 shadow-[var(--shadow-neon-subtle)]",
    accent:    "border-accent/50 shadow-[var(--shadow-neon-subtle)]",
    none: "border-white/10",
  };

  const statusIndicator = {
    active: "bg-accent",
    idle: "bg-white/20",
    processing: "bg-primaryGlow animate-pulse",
  };

  return (
    <div className={cn("flex flex-col items-center gap-3 transition-transform duration-300", isActive && "scale-110", className)}>
      <div className={cn(
        "relative w-[72px] h-[72px] rounded-2xl flex items-center justify-center bg-surface/80 backdrop-blur-md border transition-all duration-300",
        glowClasses[glowColor],
        isActive && "ring-2 ring-white/60 box-shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-[pulse_3s_ease-in-out_infinite]"
      )}>
        {/* Status dot */}
        <div className={cn("absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-surface", statusIndicator[status])} />
        
        {/* Icon wrapper */}
        <div className="text-white opacity-90 scale-125">
          {icon}
        </div>
      </div>
      <span className="font-mono text-sm text-textSecondary font-medium text-center w-24 leading-tight">{label}</span>
    </div>
  );
}
