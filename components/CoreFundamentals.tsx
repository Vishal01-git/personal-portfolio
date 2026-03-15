"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { fundamentals } from '@/data/skills';

function fmtTime(d: Date): string { return d.toTimeString().slice(0, 8); }

function buildLogTimes(offsetsSecondsAgo: number[]): string[] {
  const now = Date.now();
  return offsetsSecondsAgo.map(s => fmtTime(new Date(now - s * 1000)));
}

function formatUptime(startDate: Date, short = false): string {
  const diff = Math.floor((Date.now() - startDate.getTime()) / 1000);
  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return short ? `${d}d ${h}h ${m}m` : `${d}d ${h}h ${m}m ${s}s`;
}

// ─── Process icons — keyed by title ───────────────────────────────────────
const PROCESS_ICONS: Record<string, React.ReactNode> = {
  "DSA / Algorithms": (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M2 12V7l3 3 3-7 3 5 3-2v4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "System Design": (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="#F59E0B" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="#EA580C" strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="#EA580C" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="#F59E0B" strokeWidth="1.5" />
    </svg>
  ),
};

// ─── Log line ──────────────────────────────────────────────────────────────
function LogLine({ ts, level, text, delay, showCursor }: { ts: string; level: 'ok' | 'run'; text: string; delay: number; showCursor?: boolean }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -6 }} animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -6 }}
      transition={{ duration: 0.3, delay }} className="flex items-start gap-1.5 text-[10px] font-mono"
    >
      <span className="text-textTertiary shrink-0">{ts}</span>
      <span className={`shrink-0 ${level === 'ok' ? 'text-statusSuccess' : 'text-primaryGlow'}`}>
        {level === 'ok' ? '[OK] ' : '[RUN]'}
      </span>
      <span className="text-textSecondary/55">
        {text}
        {showCursor && <span className="inline-block w-1.5 h-[10px] bg-primaryGlow ml-0.5 align-middle animate-[blink_1s_step-end_infinite]" />}
      </span>
    </motion.div>
  );
}

// ─── Process card ──────────────────────────────────────────────────────────
function ProcessCard({ title, sub, logs, entryDelay }: { title: string; sub: string; logs: { ts: string; level: 'ok' | 'run'; text: string }[]; entryDelay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: entryDelay }}
      className="bg-surface/50 border border-white/6 rounded-xl p-3.5 hover:border-primaryGlow/20 transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primaryGlow/10 border border-primaryGlow/18 flex items-center justify-center shrink-0">
            {PROCESS_ICONS[title] ?? PROCESS_ICONS["DSA / Algorithms"]}
          </div>
          <div>
            <div className="text-xs font-mono font-semibold text-textPrimary leading-tight">{title}</div>
            <div className="text-[9px] font-mono text-textTertiary uppercase tracking-widest mt-0.5">{sub}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-statusSuccess bg-statusSuccess/8 border border-statusSuccess/18 px-2 py-0.5 rounded-full shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-statusSuccess animate-pulse" />
          running
        </div>
      </div>
      <div className="h-px bg-white/5 mb-2.5" />
      <div className="space-y-1.5">
        {logs.map((log, i) => (
          <LogLine key={i} ts={log.ts} level={log.level} text={log.text}
            delay={entryDelay + 0.15 + i * 0.18} showCursor={i === logs.length - 1} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Live uptime ticker ────────────────────────────────────────────────────
function UptimeTicker() {
  const [full,  setFull]  = useState<string | null>(null);
  const [short, setShort] = useState<string | null>(null);

  useEffect(() => {
    setFull(formatUptime(fundamentals.careerStart, false));
    setShort(formatUptime(fundamentals.careerStart, true));
    const id = setInterval(() => {
      setFull(formatUptime(fundamentals.careerStart, false));
      setShort(formatUptime(fundamentals.careerStart, true));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (!full || !short) return null;

  return (
    <span className="text-[10px] font-mono text-primaryGlow/35 shrink-0 tabular-nums">
      <span className="sm:hidden">uptime: {short}</span>
      <span className="hidden sm:inline">uptime: {full}</span>
    </span>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────
export function CoreFundamentals() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Build timestamps client-side only — avoids hydration mismatch
  const [logTimes, setLogTimes] = useState<string[][] | null>(null);
  useEffect(() => {
    setLogTimes(
      fundamentals.processes.map(p => buildLogTimes(p.logs.map(l => l.offsetSecondsAgo)))
    );
  }, []);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
      transition={{ duration: 0.45 }} className="relative rounded-2xl overflow-hidden border border-primaryGlow/18"
      style={{ background: '#0E0C06' }}
    >
      <div className="absolute top-0 right-0 w-56 h-56 bg-primaryGlow/6 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondaryGlow/4 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none" />

      {/* Title bar */}
      <div className="relative flex items-center justify-between px-4 md:px-5 py-2.5 bg-black/30 border-b border-white/5">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="hidden sm:block text-[10px] font-mono text-textSecondary/40 uppercase tracking-widest">
            process_monitor.sh
          </span>
        </div>
        <UptimeTicker />
      </div>

      {/* Body */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
        <div className="p-6 md:p-8 flex flex-col gap-5 justify-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-primaryGlow uppercase tracking-widest bg-primaryGlow/7 border border-primaryGlow/18 px-3 py-1 rounded-full w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-primaryGlow animate-pulse" />
            Core Fundamentals
          </div>
          <div>
            <h2 className="text-2xl md:text-[26px] font-bold font-heading text-textPrimary leading-snug mb-3">
              Engineering<br />at the root level.
            </h2>
            <p className="text-sm text-textSecondary leading-relaxed">{fundamentals.description}</p>
          </div>
        </div>

        {/* Process cards — from data/skills.ts */}
        <div className="p-4 md:p-5 flex flex-col gap-3">
          {fundamentals.processes.map((proc, procIdx) => (
            <ProcessCard
              key={proc.title}
              title={proc.title}
              sub={proc.sub}
              entryDelay={0.2 + procIdx * 0.15}
              logs={proc.logs.map((log, logIdx) => ({
                ts:    logTimes?.[procIdx]?.[logIdx] ?? '',
                level: log.level,
                text:  log.text,
              }))}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}