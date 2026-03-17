"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// ─── Ember cursor trail ────────────────────────────────────────────────────
interface EmberParticle {
  id: number;
  x: number;
  y: number;
  born: number;
}

const TRAIL_LENGTH  = 5;
const TRAIL_LIFETIME = 600;
const EMBER_COLORS  = ['#F59E0B', '#EA580C', '#FDE68A', '#F59E0B', '#EA580C'];

function CursorTrail() {
  const [particles, setParticles] = useState<EmberParticle[]>([]);
  const counterRef = useRef(0);
  const lastPos    = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx   = e.clientX - lastPos.current.x;
      const dy   = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 12) return;
      lastPos.current = { x: e.clientX, y: e.clientY };
      const id = counterRef.current++;
      setParticles(prev => [
        ...prev.slice(-(TRAIL_LENGTH - 1)),
        { id, x: e.clientX, y: e.clientY, born: Date.now() },
      ]);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      const now = Date.now();
      setParticles(prev => prev.filter(p => now - p.born < TRAIL_LIFETIME));
    }, TRAIL_LIFETIME);
    return () => clearTimeout(timer);
  }, [particles]);

  return (
    <>
      {particles.map((p, i) => {
        const size  = 4 + (TRAIL_LENGTH - i) * 1.2;
        const color = EMBER_COLORS[i % EMBER_COLORS.length];
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 1,   x: p.x - size / 2, y: p.y - size / 2 }}
            animate={{ opacity: 0,   scale: 0.3,  y: p.y - size / 2 - 18 }}
            transition={{ duration: TRAIL_LIFETIME / 1000, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              width: size, height: size,
              borderRadius: '50%',
              background: color,
              pointerEvents: 'none',
              zIndex: 9999,
              boxShadow: `0 0 ${size * 2}px ${color}80`,
              willChange: 'transform, opacity',
            }}
          />
        );
      })}
    </>
  );
}

// ─── Main background ───────────────────────────────────────────────────────
export function GlobalBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    colorVar: i % 3 === 0
      ? 'var(--primaryGlow)'
      : i % 3 === 1
      ? 'var(--secondaryGlow)'
      : 'var(--accent)',
  }));

  return (
    <>
      <CursorTrail />

      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" style={{ backgroundColor: 'var(--background)' }}>

        {/* Layer 1: Blueprint grid — uses CSS variable so it lightens in light mode */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--grid-color) 1px, transparent 1px),
              linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Layer 2: Radial glows — CSS variables swap automatically */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] blur-3xl opacity-70"
          style={{ background: `radial-gradient(circle at center, var(--bg-glow-1), transparent 60%)` }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-3xl opacity-70"
          style={{ background: `radial-gradient(circle at center, var(--bg-glow-2), transparent 60%)` }}
        />

        {/* Layer 3: Animated floating particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              width: p.size, height: p.size,
              borderRadius: '50%',
              background: p.colorVar,
              opacity: 0.15,
            }}
            initial={{ x: `${p.x}vw`, y: `${p.y}vh` }}
            animate={{
              y: [`${p.y}vh`, `${(p.y - 20 + 100) % 100}vh`, `${p.y}vh`],
              x: [`${p.x}vw`, `${(p.x + 10) % 100}vw`, `${p.x}vw`],
              opacity: [0.08, 0.35, 0.08],
            }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {/* Layer 4: Vignette — adapts to theme */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at center, transparent 40%, var(--background) 100%)' }}
        />
      </div>
    </>
  );
}