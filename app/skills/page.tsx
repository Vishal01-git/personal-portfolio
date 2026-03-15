"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { CoreFundamentals } from '@/components/CoreFundamentals';
import {
  Terminal, Database, Cloud, Cog, Layers, Code,
  Box, Network, Github, Cpu, BookOpen
} from 'lucide-react';

// ─── Skill data with proficiency (0–100) and tier ────────────────────────────
const skillsData = [
  {
    id: 'sql',
    name: 'Advanced SQL',
    icon: <Database className="w-6 h-6" />,
    category: 'Language',
    exp: '5+ Years',
    proficiency: 95,
    tier: 'core',
    projects: ['CTEs', 'Window Functions', 'Stored Procedures'],
    color: 'primary',
  },
  {
    id: 'sqlserver',
    name: 'SQL Server',
    icon: <Database className="w-6 h-6" />,
    category: 'Database',
    exp: '5+ Years',
    proficiency: 90,
    tier: 'core',
    projects: ['Stored Procedures', 'Legacy Migrations'],
    color: 'primary',
  },
  {
    id: 'python',
    name: 'Python',
    icon: <Code className="w-6 h-6" />,
    category: 'Language',
    exp: '4+ Years',
    proficiency: 88,
    tier: 'core',
    projects: ['Pandas', 'Boto3', 'File Automation'],
    color: 'secondary',
  },
  {
    id: 'aws',
    name: 'AWS Athena',
    icon: <Cloud className="w-6 h-6" />,
    category: 'Cloud Query',
    exp: '3+ Years',
    proficiency: 85,
    tier: 'core',
    projects: ['Serverless Analytics', 'Data Lake Queries'],
    color: 'primary',
  },
  {
    id: 'airflow',
    name: 'Apache Airflow',
    icon: <Cog className="w-6 h-6" />,
    category: 'Orchestration',
    exp: '3+ Years',
    proficiency: 82,
    tier: 'core',
    projects: ['Dynamic DAGs', 'ETL/ELT Pipelines'],
    color: 'secondary',
  },
  {
    id: 'dbt',
    name: 'dbt (Core/Cloud)',
    icon: <Layers className="w-6 h-6" />,
    category: 'Transform',
    exp: '2+ Years',
    proficiency: 80,
    tier: 'core',
    projects: ['Data Modeling', 'Incremental Loading', 'Macros'],
    color: 'secondary',
  },
  {
    id: 'aws_eco',
    name: 'AWS Ecosystem',
    icon: <Cloud className="w-6 h-6" />,
    category: 'Cloud',
    exp: '3+ Years',
    proficiency: 75,
    tier: 'core',
    projects: ['S3', 'Glue', 'Lambda', 'Redshift', 'DynamoDB'],
    color: 'primary',
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: <Box className="w-6 h-6" />,
    category: 'Infrastructure',
    exp: '3+ Years',
    proficiency: 72,
    tier: 'familiar',
    projects: ['Containerization', 'Microservices'],
    color: 'secondary',
  },
  {
    id: 'github_actions',
    name: 'GitHub Actions',
    icon: <Github className="w-6 h-6" />,
    category: 'CI/CD',
    exp: '3+ Years',
    proficiency: 68,
    tier: 'familiar',
    projects: ['Automated Testing', 'Deployment Pipelines'],
    color: 'primary',
  },
];

const coreSkills = skillsData.filter(s => s.tier === 'core');
const familiarSkills = skillsData.filter(s => s.tier === 'familiar');

// ─── Animated proficiency bar ─────────────────────────────────────────────────
function ProficiencyBar({
  proficiency,
  color,
  animate,
}: {
  proficiency: number;
  color: string;
  animate: boolean;
}) {
  const barColor =
    color === 'primary'
      ? 'from-primaryGlow to-secondaryGlow'
      : 'from-secondaryGlow to-accent';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-mono text-textTertiary uppercase tracking-wider">Proficiency</span>
        <motion.span
          className="text-[11px] font-mono text-textSecondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: animate ? 1 : 0 }}
          transition={{ delay: 0.4 }}
        >
          {proficiency}%
        </motion.span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
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

// ─── Single skill row in the list ─────────────────────────────────────────────
function SkillRow({
  skill,
  isActive,
  onClick,
  index,
  inView,
}: {
  skill: typeof skillsData[0];
  isActive: boolean;
  onClick: () => void;
  index: number;
  inView: boolean;
}) {
  const barColor =
    skill.color === 'primary'
      ? 'from-primaryGlow to-secondaryGlow'
      : 'from-secondaryGlow to-accent';

  const iconColor = isActive
    ? skill.color === 'primary'
      ? 'text-primaryGlow'
      : 'text-secondaryGlow'
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
      {/* Icon */}
      <div className={`shrink-0 transition-colors duration-200 ${iconColor}`}>
        {skill.icon}
      </div>

      {/* Name + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-sm font-medium transition-colors duration-200 ${isActive ? 'text-white' : 'text-white/75 group-hover:text-white/90'}`}>
            {skill.name}
          </span>
          <span className="text-[11px] font-mono text-textSecondary shrink-0 ml-2">{skill.exp}</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: inView ? `${skill.proficiency}%` : 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 + index * 0.04 }}
          />
        </div>
      </div>

      {/* Percentage badge */}
      <motion.span
        className="shrink-0 text-[11px] font-mono text-textSecondary w-8 text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ delay: 0.3 + index * 0.04 }}
      >
        {skill.proficiency}%
      </motion.span>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SkillsPage() {
  const [activeSkill, setActiveSkill] = useState<string>(skillsData[0].id);
  const listRef = useRef<HTMLDivElement>(null);
  const inView = useInView(listRef, { once: true, margin: '-80px' });

  const active = skillsData.find(s => s.id === activeSkill) || skillsData[0];

  return (
    <div className="max-w-6xl mx-auto px-6 flex flex-col items-center pb-20">
      {/* Header */}
      <div className="text-center mb-14 space-y-4 pt-4 w-full">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Technical{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">
            Infrastructure
          </span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          Skills ranked by depth and daily use — not just a logo parade.
        </p>
      </div>

      {/* Main two-column layout */}
      <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10">

        {/* ── Left: tiered skill list ─────────────────────────────────────── */}
        <div ref={listRef} className="w-full lg:w-[55%] flex flex-col gap-6">

          {/* Core skills */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-2 h-2 rounded-full bg-primaryGlow shadow-neon-glow" />
              <span className="text-xs font-mono uppercase tracking-widest text-textSecondary">
                Core — used daily in production
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {coreSkills.map((skill, i) => (
                <SkillRow
                  key={skill.id}
                  skill={skill}
                  isActive={activeSkill === skill.id}
                  onClick={() => setActiveSkill(skill.id)}
                  index={i}
                  inView={inView}
                />
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3 px-1">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[10px] font-mono text-textTertiary uppercase tracking-widest">familiar</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Familiar skills */}
          <div className="flex flex-col gap-1">
            {familiarSkills.map((skill, i) => (
              <SkillRow
                key={skill.id}
                skill={skill}
                isActive={activeSkill === skill.id}
                onClick={() => setActiveSkill(skill.id)}
                index={coreSkills.length + i}
                inView={inView}
              />
            ))}
          </div>
        </div>

        {/* ── Right: detail card ──────────────────────────────────────────── */}
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
                <GlassCard
                  glowColor={active.color as 'primary' | 'secondary'}
                  className="p-6 space-y-5"
                >
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${active.color === 'primary' ? 'bg-primaryGlow/15 text-primaryGlow' : 'bg-secondaryGlow/15 text-secondaryGlow'}`}>
                        {active.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-heading text-white">{active.name}</h3>
                        <span className="text-xs font-mono text-textSecondary">{active.category}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant="outline" className="text-[10px]">{active.exp}</Badge>
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        active.tier === 'core'
                          ? 'border-primaryGlow/30 text-primaryGlow bg-primaryGlow/8'
                          : 'border-white/15 text-textSecondary'
                      }`}>
                        {active.tier}
                      </span>
                    </div>
                  </div>

                  {/* Proficiency bar — large version */}
                  <ProficiencyBar
                    proficiency={active.proficiency}
                    color={active.color}
                    animate
                  />

                  {/* Implementations */}
                  <div className="border-t border-white/8 pt-4">
                    <h4 className="text-[11px] font-mono uppercase tracking-widest text-textSecondary mb-3">
                      Key Implementations
                    </h4>
                    <ul className="space-y-2">
                      {active.projects.map((p, i) => (
                        <motion.li
                          key={p}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="flex items-center gap-2.5 text-sm text-textPrimary/80"
                        >
                          <Terminal className="w-3 h-3 text-accent shrink-0" />
                          {p}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Core Fundamentals ─────────────────────────────────────────────── */}
      <div className="max-w-4xl w-full mt-16 relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent via-primaryGlow/40 to-transparent" />
        <CoreFundamentals />
      </div>
    </div>
  );
}