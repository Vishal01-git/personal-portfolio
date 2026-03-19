"use client";

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';
import { GraduationCap, ChevronRight, Terminal, Clock, CheckCircle2, Zap, BookOpen } from 'lucide-react';
import { experiences } from '@/data/experience';

// ── Status config per experience type ─────────────────────────────────────
const STATUS = {
  work:      { label: 'ACTIVE',    color: 'var(--statusSuccess)', pulse: true  },
  education: { label: 'COMPLETE',  color: 'var(--textTertiary)',  pulse: false },
};

// ── Layer badge — maps work index to pipeline stage ───────────────────────
const PIPELINE_STAGES = ['STAGING', 'TRANSFORM', 'MART'];
const STAGE_COLORS    = [
  { color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.28)' },
  { color: '#EA580C', bg: 'rgba(234,88,12,0.10)',  border: 'rgba(234,88,12,0.28)'  },
  { color: '#6EAF6E', bg: 'rgba(110,175,110,0.10)',border: 'rgba(110,175,110,0.28)'},
];

// ── Log line component ─────────────────────────────────────────────────────
function LogLine({ text, index, active }: { text: string; index: number; active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: active ? 1 : 0, x: active ? 0 : -8 }}
      transition={{ delay: index * 0.07, duration: 0.25 }}
      className="flex items-start gap-2.5 text-xs font-mono"
    >
      <ChevronRight className="w-3 h-3 shrink-0 mt-0.5" style={{ color: 'var(--primaryGlow)' }} />
      <span style={{ color: 'var(--textSecondary)' }}>{text}</span>
    </motion.div>
  );
}

// ── Experience card ────────────────────────────────────────────────────────
function ExperienceCard({
  exp, stageIndex, isLast, appeared,
}: {
  exp: typeof experiences[0];
  stageIndex: number;
  isLast: boolean;
  appeared: boolean;
}) {
  const [expanded, setExpanded] = useState(stageIndex === 0); // first card open by default
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const isWork    = exp.type !== 'education';
  const stage     = isWork ? STAGE_COLORS[stageIndex % STAGE_COLORS.length] : null;
  const stageName = isWork ? PIPELINE_STAGES[stageIndex % PIPELINE_STAGES.length] : 'SOURCE';
  const stageColor= stage ?? { color: '#A89880', bg: 'rgba(168,152,128,0.08)', border: 'rgba(168,152,128,0.22)' };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.4, delay: stageIndex * 0.1 }}
      className="relative"
    >
      {/* Connector line to next card */}
      {!isLast && (
        <div className="absolute left-[19px] top-full w-px z-0" style={{ height: '40px' }}>
          <DataFlowAnimation
            direction="vertical"
            length="40px"
            color={stageIndex === 0 ? 'primary' : stageIndex === 1 ? 'secondary' : 'accent'}
          />
        </div>
      )}

      {/* Card */}
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
        style={{
          background:  'var(--surface)',
          border:      `1px solid ${expanded ? stageColor.border : 'var(--borderSubtle)'}`,
          boxShadow:   expanded ? `0 0 20px ${stageColor.color}18, 0 4px 24px rgba(0,0,0,0.15)` : 'none',
        }}
        onClick={() => setExpanded(p => !p)}
      >
        {/* Colored left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl transition-all duration-300"
          style={{ background: expanded ? stageColor.color : 'var(--borderSubtle)' }}
        />

        {/* Header row */}
        <div className="flex items-center gap-4 px-5 py-4 pl-6">
          {/* Stage dot */}
          <div className="relative shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: stageColor.bg, border: `1px solid ${stageColor.border}` }}
            >
              {isWork
                ? <Terminal className="w-4 h-4" style={{ color: stageColor.color }} />
                : <GraduationCap className="w-4 h-4" style={{ color: stageColor.color }} />
              }
            </div>
            {/* Live pulse for active */}
            {stageIndex === 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-statusSuccess border-2 flex items-center justify-center"
                style={{ borderColor: 'var(--surface)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-statusSuccess animate-pulse" />
              </span>
            )}
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span
                className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ color: stageColor.color, background: stageColor.bg, border: `1px solid ${stageColor.border}` }}
              >
                {stageName}
              </span>
              {stageIndex === 0 && (
                <span className="text-[9px] font-mono text-statusSuccess flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-statusSuccess animate-pulse" />
                  RUNNING
                </span>
              )}
            </div>
            <h3 className="font-mono font-bold text-sm leading-tight" style={{ color: 'var(--textPrimary)' }}>
              {exp.role}
            </h3>
            <div className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--textSecondary)' }}>
              {exp.company}
            </div>
          </div>

          {/* Duration + chevron */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: 'var(--textTertiary)' }}>
              <Clock className="w-3 h-3" />
              {exp.duration}
            </div>
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--textTertiary)' }} />
            </motion.div>
          </div>
        </div>

        {/* Expanded log output */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {/* Terminal-style log area */}
              <div
                className="mx-4 mb-4 rounded-xl p-4 font-mono"
                style={{
                  background: 'rgba(0,0,0,0.30)',
                  border: '1px solid var(--borderSubtle)',
                }}
              >
                {/* Log header */}
                <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid var(--borderSubtle)' }}>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <div className="w-2 h-2 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--textTertiary)' }}>
                    execution_log · {exp.company.split(' ')[0].toLowerCase()}.sh
                  </span>
                  {stageIndex === 0 && (
                    <div className="ml-auto flex items-center gap-1 text-[9px] text-statusSuccess">
                      <CheckCircle2 className="w-3 h-3" />
                      in progress
                    </div>
                  )}
                </div>

                {/* Log lines */}
                <div className="space-y-1.5">
                  {exp.projects.map((bullet, i) => (
                    <LogLine key={i} text={bullet} index={i} active={appeared} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function ExperiencePage() {
  const workExperiences = experiences.filter(e => e.type !== 'education');
  const education       = experiences.find(e => e.type === 'education');
  const headerRef = useRef<HTMLDivElement>(null);
  const appeared  = useInView(headerRef, { once: true });

  return (
    <div className="max-w-3xl mx-auto px-6 pt-10 pb-20">

      {/* ── Header ── */}
      <div ref={headerRef} className="text-center mb-14 space-y-4">
        <div
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full"
          style={{ color: 'var(--primaryGlow)', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.22)' }}
        >
          <Zap className="w-3 h-3" />
          career_pipeline.yml · {workExperiences.length} runs · 0 errors
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Execution{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">
            History
          </span>
        </h1>
        <p className="text-textSecondary max-w-xl mx-auto text-sm md:text-base">
          Career mapped as a sequential pipeline — each role a transformation stage with measurable output.
        </p>
      </div>

      {/* ── Pipeline run header bar ── */}
      <div
        className="flex items-center justify-between px-4 py-2.5 rounded-xl mb-8 font-mono text-[10px] uppercase tracking-widest"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--borderSubtle)',
        }}
      >
        <div className="flex items-center gap-2" style={{ color: 'var(--textTertiary)' }}>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>
          <span>career_dag · vishal_prajapati</span>
        </div>
        <div className="flex items-center gap-3" style={{ color: 'var(--textTertiary)' }}>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-statusSuccess animate-pulse" />
            <span style={{ color: 'var(--statusSuccess)' }}>RUNNING</span>
          </span>
          <span>·</span>
          <span>{workExperiences.length} stages</span>
        </div>
      </div>

      {/* ── Work experience cards ── */}
      <div className="flex flex-col gap-10 relative">
        {workExperiences.map((exp, i) => (
          <ExperienceCard
            key={exp.id}
            exp={exp}
            stageIndex={i}
            isLast={i === workExperiences.length - 1}
            appeared={appeared}
          />
        ))}
      </div>

      {/* ── Education ── */}
      {education && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="mt-14 pt-10"
          style={{ borderTop: '1px solid var(--borderSubtle)' }}
        >
          {/* Section label */}
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-4 h-4" style={{ color: 'var(--textTertiary)' }} />
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--textTertiary)' }}>
              Source Layer · Education
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--borderSubtle)' }} />
          </div>

          {/* Education card — lighter treatment, SOURCE stage aesthetic */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'var(--surface)',
              border: '1px solid rgba(168,152,128,0.22)',
            }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
              style={{ background: 'rgba(168,152,128,0.45)' }} />
            <div className="px-5 py-5 pl-6 flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(168,152,128,0.10)', border: '1px solid rgba(168,152,128,0.22)' }}
              >
                <GraduationCap className="w-4 h-4" style={{ color: '#A89880' }} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div>
                    <span
                      className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-1.5"
                      style={{ color: '#A89880', background: 'rgba(168,152,128,0.10)', border: '1px solid rgba(168,152,128,0.22)' }}
                    >
                      SOURCE
                    </span>
                    <h3 className="font-mono font-bold text-sm" style={{ color: 'var(--textPrimary)' }}>
                      {education.role}
                    </h3>
                    <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--textSecondary)' }}>
                      {education.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: 'var(--textTertiary)' }}>
                    <Clock className="w-3 h-3" />
                    {education.duration}
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {education.projects.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-mono" style={{ color: 'var(--textSecondary)' }}>
                      <span className="mt-0.5 shrink-0" style={{ color: 'var(--textTertiary)' }}>–</span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Footer status ── */}
      <div
        className="mt-12 flex items-center justify-center gap-2 text-[10px] font-mono"
        style={{ color: 'var(--textTertiary)' }}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-statusSuccess" />
        <span>Completed {workExperiences.length} pipeline stages · 0 errors · 0 warnings</span>
      </div>
    </div>
  );
}