"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function GlobalBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    // Ember palette: amber / orange / pale gold
    glowType: i % 3 === 0 ? "bg-primaryGlow" : i % 3 === 1 ? "bg-secondaryGlow" : "bg-accent",
  }));

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Layer 1: Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(245,158,11,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.4) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Layer 2: Ember radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.07),transparent_60%)] blur-3xl opacity-70" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.07),transparent_60%)] blur-3xl opacity-70" />

      {/* Layer 3: Animated ember particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${p.glowType}`}
          style={{ width: p.size, height: p.size, opacity: 0.15 }}
          initial={{
            x: `${p.x}vw`,
            y: `${p.y}vh`,
          }}
          animate={{
            y: [`${p.y}vh`, `${(p.y - 20 + 100) % 100}vh`, `${p.y}vh`],
            x: [`${p.x}vw`, `${(p.x + 10) % 100}vw`, `${p.x}vw`],
            opacity: [0.08, 0.45, 0.08],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Layer 4: Vignette with ember background color */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#111008_100%)]" />
    </div>
  );
}