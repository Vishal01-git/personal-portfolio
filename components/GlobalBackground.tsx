"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function GlobalBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate random particles for the data flow effect
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    glowType: i % 3 === 0 ? "bg-primaryGlow" : i % 3 === 1 ? "bg-secondaryGlow" : "bg-accent",
  }));

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Layer 1: Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(230, 237, 243, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(230, 237, 243, 0.4) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Layer 2: Subtle Radial Gradient Glows across the screen */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.08),transparent_60%)] blur-3xl opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(138,43,226,0.08),transparent_60%)] blur-3xl opacity-60" />

      {/* Layer 3: Animated Glowing Data Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${p.glowType} shadow-neon-glow`}
          style={{ width: p.size, height: p.size }}
          initial={{
            x: `${p.x}vw`,
            y: `${p.y}vh`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{
            y: [`${p.y}vh`, `${(p.y - 20 + 100) % 100}vh`, `${p.y}vh`], /* floating up */
            x: [`${p.x}vw`, `${(p.x + 10) % 100}vw`, `${p.x}vw`],
            opacity: [0.1, 0.8, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Layer 4: Vignette overlay for cinematic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0B0F14_100%)]" />
    </div>
  );
}
