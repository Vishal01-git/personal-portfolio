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

// ── Process icons ──────────────────────────────────────────────────────────
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

// ── Log line ───────────────────────────────────────────────────────────────
function LogLine({
  ts, level, text, delay, showCursor,
}: {
  ts: string; level: 'ok' | 'run'; text: string; delay: number; showCursor?: boolean;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -6 }} animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -6 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-1.5 text-[10px] font-mono"
    >
      <span className="text-textTertiary shrink-0">{ts}</span>
      <span className={`shrink-0 ${level === 'ok' ? 'text-statusSuccess' : 'text-primaryGlow'}`}>
        {level === 'ok' ? '[OK] ' : '[RUN]'}
      </span>
      <span className="text-textSecondary/70">
        {text}
        {showCursor && (
          <span className="inline-block w-1.5 h-[10px] bg-primaryGlow ml-0.5 align-middle animate-[blink_1s_step-end_infinite]" />
        )}
      </span>
    </motion.div>
  );
}

// ── Process card — always uses the terminal dark bg (intentional design) ──
// The CARD itself stays dark in both themes — it's a terminal window aesthetic.
// Only the LEFT PANEL (the prose side) adapts to the theme.
function ProcessCard({
  title, sub, logs, entryDelay,
}: {
  title: string; sub: string;
  logs: { ts: string; level: 'ok' | 'run'; text: string }[];
  entryDelay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: entryDelay }}
      className="rounded-xl p-3.5 hover:border-primaryGlow/30 transition-colors duration-300"
      // Terminal cards always stay dark — that's the aesthetic
      style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.2)' }}>
            {PROCESS_ICONS[title] ?? PROCESS_ICONS["DSA / Algorithms"]}
          </div>
          <div>
            <div className="text-xs font-mono font-semibold leading-tight" style={{ color: '#F5F0E8' }}>{title}</div>
            <div className="text-[9px] font-mono uppercase tracking-widest mt-0.5" style={{ color: '#5C4A30' }}>{sub}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-statusSuccess px-2 py-0.5 rounded-full shrink-0"
          style={{ background: 'rgba(110,175,110,0.10)', border: '1px solid rgba(110,175,110,0.20)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-statusSuccess animate-pulse" />
          running
        </div>
      </div>
      <div className="h-px mb-2.5" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="space-y-1.5">
        {logs.map((log, i) => (
          <LogLine
            key={i} ts={log.ts} level={log.level} text={log.text}
            delay={entryDelay + 0.15 + i * 0.18}
            showCursor={i === logs.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ── Uptime ticker ──────────────────────────────────────────────────────────
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
    <span className="text-[10px] font-mono shrink-0 tabular-nums" style={{ color: 'rgba(245,158,11,0.5)' }}>
      <span className="sm:hidden">uptime: {short}</span>
      <span className="hidden sm:inline">uptime: {full}</span>
    </span>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function CoreFundamentals() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [logTimes, setLogTimes] = useState<string[][] | null>(null);
  useEffect(() => {
    setLogTimes(
      fundamentals.processes.map(p => buildLogTimes(p.logs.map(l => l.offsetSecondsAgo)))
    );
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
      transition={{ duration: 0.45 }}
      className="relative rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(245,158,11,0.20)' }}
      // FIX: use var(--surface-subtle) instead of hardcoded #0E0C06
      // This gives a warm parchment bg in light mode, near-black in dark
    >
      {/* Decorative glows — low opacity, fine in both modes */}
      <div className="absolute top-0 right-0 w-56 h-56 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"
        style={{ background: 'var(--bg-glow-1)', opacity: 0.6 }} />
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"
        style={{ background: 'var(--bg-glow-2)', opacity: 0.4 }} />

      {/* Title bar */}
      <div
        className="relative flex items-center justify-between px-4 md:px-5 py-2.5 border-b"
        style={{ background: 'var(--surface-elevated)', borderColor: 'var(--borderSubtle)' }}
      >
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="hidden sm:block text-[10px] font-mono uppercase tracking-widest"
            style={{ color: 'var(--textTertiary)' }}>
            process_monitor.sh
          </span>
        </div>
        <UptimeTicker />
      </div>

      {/* Body */}
      <div
        className="relative grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x"
        style={{
          background: 'var(--surface-subtle)',
          // FIX: divider uses borderSubtle CSS var — visible in both modes
          '--tw-divide-opacity': '1',
        } as React.CSSProperties}
      >
        {/* ── Left: prose — FIX: uses CSS vars so text is readable in light mode ── */}
        <div
          className="p-6 md:p-8 flex flex-col gap-5 justify-center border-r"
          style={{ borderColor: 'var(--borderSubtle)' }}
        >
          <div
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full w-fit"
            style={{
              color: 'var(--primaryGlow)',
              background: 'rgba(217,119,6,0.08)',
              border: '1px solid rgba(217,119,6,0.20)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primaryGlow animate-pulse" />
            Core Fundamentals
          </div>

          <div>
            {/* FIX: textPrimary → always readable heading in both modes */}
            <h2
              className="text-2xl md:text-[26px] font-bold font-heading leading-snug mb-3"
              style={{ color: 'var(--textPrimary)' }}
            >
              Engineering<br />at the root level.
            </h2>
            {/* FIX: textSecondary → readable in light mode */}
            <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
              {fundamentals.description}
            </p>
          </div>
        </div>

        {/* ── Right: terminal cards — always dark terminal aesthetic ── */}
        <div
          className="p-4 md:p-5 flex flex-col gap-3"
          // The right panel keeps a deliberately darker bg for terminal feel
          style={{ background: 'rgba(0,0,0,0.25)' }}
        >
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