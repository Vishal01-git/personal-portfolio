import React from 'react';
import { cn } from '@/utils/cn';

export interface PipelineNodeProps {
  icon: React.ReactNode;
  label: string;
  glowColor?: "primary" | "secondary" | "accent" | "none";
  status?: "active" | "idle" | "processing";
  className?: string;
}

export function PipelineNode({ icon, label, glowColor = "primary", status = "idle", className }: PipelineNodeProps) {
  const glowClasses = {
    primary: "border-primaryGlow/50 shadow-neon-glow",
    secondary: "border-secondaryGlow/50 shadow-[0_0_15px_rgba(138,43,226,0.5)]",
    accent: "border-accent/50 shadow-[0_0_15px_rgba(20,241,149,0.5)]",
    none: "border-white/10",
  };

  const statusIndicator = {
    active: "bg-accent",
    idle: "bg-white/20",
    processing: "bg-primaryGlow animate-pulse",
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className={cn(
        "relative w-[72px] h-[72px] rounded-2xl flex items-center justify-center bg-surface/80 backdrop-blur-md border",
        glowClasses[glowColor]
      )}>
        {/* Status dot */}
        <div className={cn("absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-surface", statusIndicator[status])} />
        
        {/* Icon wrapper */}
        <div className="text-white opacity-90 scale-125">
          {icon}
        </div>
      </div>
      <span className="font-mono text-sm text-textSecondary font-medium">{label}</span>
    </div>
  );
}
