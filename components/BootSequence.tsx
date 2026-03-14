"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const sequence = [
    "Initializing Data Platform...",
    "Loading Infrastructure Modules...",
    "Connecting to Data Sources...",
    "Deploying Pipeline Engine...",
    "System Ready."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < sequence.length) {
        setLines(prev => [...prev, sequence[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 450);
    
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6"
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="w-full max-w-2xl bg-surface/80 border border-white/10 rounded-xl p-6 font-mono text-sm md:text-base shadow-neon-glow overflow-hidden relative">
        {/* Subtle grid in terminal background */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }} />
        
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3 relative z-10">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-accent/80 shadow-[0_0_10px_rgba(20,241,149,0.5)]" />
          <span className="ml-2 text-textSecondary text-xs tracking-wider">system_boot.sh</span>
        </div>
        
        <div className="flex flex-col gap-3 min-h-[180px] relative z-10">
          {lines.map((line, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={idx === sequence.length - 1 ? "text-primaryGlow font-bold mt-4" : "text-textPrimary"}
            >
              <span className="text-secondaryGlow mr-3">{">"}</span>
              {line}
            </motion.div>
          ))}
          {lines.length < sequence.length && (
            <motion.div 
              animate={{ opacity: [1, 0, 1] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2.5 h-5 bg-primaryGlow mt-1 shadow-[0_0_8px_rgba(0,229,255,0.8)]"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
