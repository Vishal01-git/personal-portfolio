"use client";

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BootSequence } from '@/components/BootSequence';
import { Button } from '@/components/ui/Button';
import { PipelineNode } from '@/components/ui/PipelineNode';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';
import { Database, Server, Cloud, Activity, Network, Cpu, Terminal, User, Mail, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { hero } from '@/data/hero';
import { links } from '@/data/links';

function useCountUp(target: number, duration = 1400, started = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    const steps = 40;
    const stepTime = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setValue(parseFloat((target * (step / steps)).toFixed(1)));
      if (step >= steps) { setValue(target); clearInterval(timer); }
    }, stepTime);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return value;
}

function MetricCard({ label, value, suffix, color, started }: { label: string; value: number; suffix: string; color: string; started: boolean }) {
  const display  = useCountUp(value, 1400, started);
  const isDecimal = value % 1 !== 0;
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-surface/40 border border-white/5 min-w-[100px]">
      <span className={`font-mono font-bold text-2xl md:text-3xl ${color}`}>
        {isDecimal ? display.toFixed(1) : Math.round(display)}{suffix}
      </span>
      <span className="text-[11px] font-mono text-textSecondary text-center leading-tight">{label}</span>
    </div>
  );
}

export default function Home() {
  const [bootStrapComplete, setBootStrapComplete] = useState(false);
  const [metricsStarted,    setMetricsStarted]    = useState(false);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bootStrapComplete) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setMetricsStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (metricsRef.current) obs.observe(metricsRef.current);
    return () => obs.disconnect();
  }, [bootStrapComplete]);

  const mobileLinks = [
    { name: 'Architecture', href: '/architecture', icon: <Network className="w-5 h-5 text-primaryGlow" /> },
    { name: 'Projects',     href: '/projects',     icon: <Database className="w-5 h-5 text-secondaryGlow" /> },
    { name: 'Skills',       href: '/skills',       icon: <Cpu className="w-5 h-5 text-accent" /> },
    { name: 'Experience',   href: '/experience',   icon: <Terminal className="w-5 h-5 text-primaryGlow" /> },
    { name: 'About',        href: '/about',        icon: <User className="w-5 h-5 text-secondaryGlow" /> },
    { name: 'Contact',      href: '/contact',      icon: <Mail className="w-5 h-5 text-accent" /> },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative w-full pt-4">
      <AnimatePresence>
        {!bootStrapComplete && <BootSequence onComplete={() => setBootStrapComplete(true)} />}
      </AnimatePresence>

      {bootStrapComplete && (
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-10"
        >
          {/* Pipeline diagram */}
          <div className="hidden md:flex w-full justify-center py-6">
            <div className="flex items-center gap-1 md:gap-4 scale-[0.55] sm:scale-75 md:scale-100 origin-center transition-transform">
              <PipelineNode icon={<Database className="w-6 h-6" />} label="Source"     glowColor="primary"   status="active"     />
              <DataFlowAnimation length="40px" color="primary" />
              <PipelineNode icon={<Server className="w-6 h-6" />}   label="Processing" glowColor="primary"   status="processing" />
              <DataFlowAnimation length="40px" color="secondary" />
              <PipelineNode icon={<Cloud className="w-6 h-6" />}    label="Warehouse"  glowColor="secondary" status="active"     />
              <DataFlowAnimation length="40px" color="accent" />
              <PipelineNode icon={<Activity className="w-6 h-6" />} label="Analytics"  glowColor="accent"    status="processing" />
            </div>
          </div>

          {/* Hero heading — driven by data/hero.ts */}
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-tight">
              {hero.greeting}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">
                {hero.firstName}
              </span>
              <br />{hero.role}
            </h1>
            <p className="text-lg md:text-xl text-textSecondary font-medium max-w-2xl mx-auto">
              {hero.subtitle}
            </p>
          </div>

          {/* Impact metrics — values from data/hero.ts */}
          <div ref={metricsRef} className="w-full flex flex-wrap justify-center gap-3 py-2">
            {hero.metrics.map(m => (
              <MetricCard key={m.label} {...m} started={metricsStarted} />
            ))}
          </div>

          {/* Mobile quick nav */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto md:hidden">
            {mobileLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <div className="bg-surface/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-white/5 transition-colors">
                  <div className="opacity-80">{link.icon}</div>
                  <span className="text-xs font-mono font-medium text-textSecondary">{link.name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/resume">
              <Button size="lg" variant="primary" className="shadow-neon-glow border border-primaryGlow/50 flex items-center gap-2">
                <GitBranch className="w-5 h-5" /> Pipeline Resume
              </Button>
            </Link>
            <Link href="/projects" className="hidden md:block">
              <Button size="lg" variant="outline">{hero.ctas.exploreProjects}</Button>
            </Link>
            <Link href="/architecture" className="hidden md:block">
              <Button size="lg" variant="outline">{hero.ctas.architectureLab}</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}