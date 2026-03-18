"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { CoreFundamentals } from '@/components/CoreFundamentals';
import { SkillGraph } from '@/components/SkillGraph';
import { Terminal, Database, Cloud, Cog, Layers, Code, Box, Github, BarChart2, Share2 } from 'lucide-react';
import { skills, type Skill } from '@/data/skills';

const ICON_MAP: Record<string, React.ReactNode> = {
  sql:            <Database className="w-6 h-6" />,
  sqlserver:      <Database className="w-6 h-6" />,
  python:         <Code className="w-6 h-6" />,
  aws:            <Cloud className="w-6 h-6" />,
  airflow:        <Cog className="w-6 h-6" />,
  dbt:            <Layers className="w-6 h-6" />,
  aws_eco:        <Cloud className="w-6 h-6" />,
  docker:         <Box className="w-6 h-6" />,
  github_actions: <Github className="w-6 h-6" />,
};

const CARD_GLOW: Record<'primary' | 'secondary' | 'accent', string> = {
  primary:   '0 0 0 1px rgba(217,119,6,0.35), 0 0 18px rgba(217,119,6,0.30), 0 0 40px rgba(217,119,6,0.12)',
  secondary: '0 0 0 1px rgba(194,65,12,0.35),  0 0 18px rgba(194,65,12,0.30),  0 0 40px rgba(194,65,12,0.12)',
  accent:    '0 0 0 1px rgba(253,230,138,0.40), 0 0 18px rgba(253,230,138,0.25), 0 0 40px rgba(253,230,138,0.10)',
};

const CARD_BORDER: Record<'primary' | 'secondary' | 'accent', string> = {
  primary:   'rgba(217,119,6,0.40)',
  secondary: 'rgba(194,65,12,0.40)',
  accent:    'rgba(253,230,138,0.35)',
};

const coreSkills     = skills.filter(s => s.tier === 'core');
const familiarSkills = skills.filter(s => s.tier === 'familiar');

function ProficiencyBar({ proficiency, color, animate }: {
  proficiency: number;
  color: 'primary' | 'secondary' | 'accent';
  animate: boolean;
}) {
  const barColor =
    color === 'primary'   ? 'from-primaryGlow to-secondaryGlow' :
    color === 'secondary' ? 'from-secondaryGlow to-accent' :
                            'from-accent to-primaryGlow';
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--textTertiary)' }}>
          Proficiency
        </span>
        <motion.span
          className="text-[11px] font-mono"
          style={{ color: 'var(--textSecondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: animate ? 1 : 0 }}
          transition={{ delay: 0.4 }}
        >
          {proficiency}%
        </motion.span>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--borderSubtle)' }}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: animate ? `${proficiency}%` : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
        />
      </div>
    </div>
  );
}

function SkillRow({ skill, isActive, onClick, index, inView }: {
  skill: Skill;
  isActive: boolean;
  onClick: () => void;
  index: number;
  inView: boolean;
}) {
  const barColor =
    skill.color === 'primary'   ? 'from-primaryGlow to-secondaryGlow' :
    skill.color === 'secondary' ? 'from-secondaryGlow to-accent' :
                                  'from-accent to-primaryGlow';

  const iconColor =
    isActive
      ? skill.color === 'primary'   ? 'text-primaryGlow'
      : skill.color === 'secondary' ? 'text-secondaryGlow'
      :                               'text-accent'
      : 'text-textSecondary';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -12 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onClick={onClick}
      className={`group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 border ${
        isActive
          ? 'bg-primaryGlow/8 border-primaryGlow/25'
          : 'bg-transparent border-transparent hover:bg-white/4 hover:border-white/8'
      }`}
    >
      <div className={`shrink-0 transition-colors duration-200 ${iconColor}`}>
        {ICON_MAP[skill.id] ?? <Database className="w-6 h-6" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className={`text-sm font-medium transition-colors duration-200 ${isActive ? 'text-white' : ''}`}
            style={{ color: isActive ? undefined : 'var(--textPrimary)' }}
          >
            {skill.name}
          </span>
          <span className="text-[11px] font-mono shrink-0 ml-2" style={{ color: 'var(--textSecondary)' }}>
            {skill.exp}
          </span>
        </div>
        <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'var(--borderSubtle)' }}>
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: inView ? `${skill.proficiency}%` : 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 + index * 0.04 }}
          />
        </div>
      </div>
      <motion.span
        className="shrink-0 text-[11px] font-mono w-8 text-right"
        style={{ color: 'var(--textSecondary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ delay: 0.3 + index * 0.04 }}
      >
        {skill.proficiency}%
      </motion.span>
    </motion.div>
  );
}

export default function SkillsPage() {
  const [activeSkillId, setActiveSkillId] = useState<string>(skills[0].id);
  const [view,          setView]          = useState<'bars' | 'graph'>('bars');
  const listRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(listRef, { once: true, margin: '-80px' });

  const active    = skills.find(s => s.id === activeSkillId) || skills[0];
  const color     = active.color as 'primary' | 'secondary' | 'accent';
  const iconBg    =
    color === 'primary'   ? 'bg-primaryGlow/15 text-primaryGlow' :
    color === 'secondary' ? 'bg-secondaryGlow/15 text-secondaryGlow' :
                            'bg-accent/15 text-accent';
  const tierBadge =
    active.tier === 'core'
      ? 'border-primaryGlow/30 text-primaryGlow bg-primaryGlow/8'
      : 'border-white/15 text-textSecondary';

  return (
    <div className="max-w-6xl mx-auto px-6 flex flex-col items-center pb-20">

      {/* Header + toggle */}
      <div className="text-center mb-10 space-y-4 pt-4 w-full">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Technical{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">
            Infrastructure
          </span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          Skills ranked by depth and daily use — not just a logo parade.
        </p>
        <div className="flex items-center justify-center pt-2">
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: 'var(--surface-elevated)', border: '1px solid var(--borderSubtle)' }}
          >
            {([
              { key: 'bars',  label: 'Proficiency', icon: <BarChart2 className="w-3.5 h-3.5" /> },
              { key: 'graph', label: 'Skill Graph',  icon: <Share2    className="w-3.5 h-3.5" /> },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setView(tab.key)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200"
                style={{
                  color:      view === tab.key ? 'var(--primaryGlow)' : 'var(--textSecondary)',
                  background: view === tab.key ? 'rgba(217,119,6,0.12)' : 'transparent',
                  border:     view === tab.key ? '1px solid rgba(217,119,6,0.30)' : '1px solid transparent',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* View content */}
      <AnimatePresence mode="wait">

        {view === 'graph' && (
          <motion.div
            key="graph"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <SkillGraph />
          </motion.div>
        )}

        {view === 'bars' && (
          <motion.div
            key="bars"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10">

              {/* Skill list */}
              <div ref={listRef} className="w-full lg:w-[55%] flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-2 h-2 rounded-full bg-primaryGlow shadow-neon-glow" />
                    <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--textSecondary)' }}>
                      Core — used daily in production
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {coreSkills.map((skill, i) => (
                      <SkillRow
                        key={skill.id}
                        skill={skill}
                        isActive={activeSkillId === skill.id}
                        onClick={() => setActiveSkillId(skill.id)}
                        index={i}
                        inView={inView}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 px-1">
                  <div className="flex-1 h-px" style={{ background: 'var(--borderSubtle)' }} />
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--textTertiary)' }}>
                    familiar
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'var(--borderSubtle)' }} />
                </div>

                <div className="flex flex-col gap-1">
                  {familiarSkills.map((skill, i) => (
                    <SkillRow
                      key={skill.id}
                      skill={skill}
                      isActive={activeSkillId === skill.id}
                      onClick={() => setActiveSkillId(skill.id)}
                      index={coreSkills.length + i}
                      inView={inView}
                    />
                  ))}
                </div>
              </div>

              {/* Detail card */}
              <div className="w-full lg:w-[45%]">
                <div className="lg:sticky lg:top-28">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className="rounded-2xl p-6 space-y-5 backdrop-blur-xl transition-all duration-300"
                        style={{
                          backgroundColor: 'var(--glass-bg)',
                          border:          `1px solid ${CARD_BORDER[color]}`,
                          boxShadow:        CARD_GLOW[color],
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${iconBg}`}>
                              {ICON_MAP[active.id] ?? <Database className="w-6 h-6" />}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold font-heading" style={{ color: 'var(--textPrimary)' }}>
                                {active.name}
                              </h3>
                              <span className="text-xs font-mono" style={{ color: 'var(--textSecondary)' }}>
                                {active.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <Badge variant="outline" className="text-[10px]">{active.exp}</Badge>
                            <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${tierBadge}`}>
                              {active.tier}
                            </span>
                          </div>
                        </div>

                        <ProficiencyBar proficiency={active.proficiency} color={color} animate />

                        <div className="border-t pt-4" style={{ borderColor: 'var(--borderSubtle)' }}>
                          <h4 className="text-[11px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--textSecondary)' }}>
                            Key Implementations
                          </h4>
                          <ul className="space-y-2">
                            {active.projects.map((p, i) => (
                              <motion.li
                                key={p}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className="flex items-center gap-2.5 text-sm"
                                style={{ color: 'var(--textPrimary)', opacity: 0.85 }}
                              >
                                <Terminal className="w-3 h-3 text-accent shrink-0" />
                                {p}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Core Fundamentals — always shown */}
      <div className="max-w-4xl w-full mt-16 relative">
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--primaryGlow), transparent)' }}
        />
        <CoreFundamentals />
      </div>

    </div>
  );
}