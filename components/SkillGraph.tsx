"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ChevronRight, Zap, Settings, Workflow, Cloud, Code2, Database } from 'lucide-react';
import { SiGit, SiGithubactions, SiDocker, SiDbt, SiApacheairflow, SiPython, SiJinja } from 'react-icons/si';
import { DiMsqlServer } from 'react-icons/di';
import { FaAws } from 'react-icons/fa6';

// ── Canvas constants ───────────────────────────────────────────────────────
const CX = 500;   // center X
const CY = 450;   // center Y
const VW = 1000;  // viewBox width
const VH = 900;   // viewBox height

// ── Types ──────────────────────────────────────────────────────────────────
type Cat = 'pipeline' | 'cloud' | 'languages' | 'devops';

interface SGNode {
  id: string;
  type: 'center' | 'category' | 'skill';
  cat?: Cat;
  label: string;
  sub?: string;
  icon: React.ElementType;
  x: number; y: number; r: number;
  // label rendered outside the circle
  lx: number; ly: number; anchor: 'start' | 'middle' | 'end';
  proficiency?: number;
  desc?: string;
}

interface SGTrace {
  id: string; from: string; to: string;
  pts: number[][];       // [[x,y], ...] polyline
  type: 'main';
}

// ── Category colors ────────────────────────────────────────────────────────
const CAT: Record<Cat, { color: string; glow: string; bg: string }> = {
  pipeline:  { color: '#F59E0B', glow: 'rgba(245,158,11,0.55)', bg: 'rgba(245,158,11,0.14)' },
  cloud:     { color: '#6B9AC4', glow: 'rgba(107,154,196,0.55)', bg: 'rgba(107,154,196,0.14)' },
  languages: { color: '#EA580C', glow: 'rgba(234,88,12,0.55)',   bg: 'rgba(234,88,12,0.14)'  },
  devops:    { color: '#6EAF6E', glow: 'rgba(110,175,110,0.55)', bg: 'rgba(110,175,110,0.14)' },
};
const AMBER = '#F59E0B';
const TRACE_COLOR = '#C17F24';  // copper trace color matching the reference

// ── Pre-calculated node positions ──────────────────────────────────────────
// Category ring r=175, Skill ring r=310, Waypoints r=235
// All positions verified to fit within 1000×900 canvas with label room

const NODES: SGNode[] = [
  // ── CENTER ──────────────────────────────────────────────────────────────
  { id:'center', type:'center', label:'Data Engineer', sub:'Vishal Prajapati',
    icon:Zap, x:500, y:450, r:58,
    lx:500, ly:528, anchor:'middle' },

  // ── CATEGORIES ──────────────────────────────────────────────────────────
  { id:'cat_devops',    type:'category', cat:'devops',
    label:'DevOps & CI', sub:'Infra & Automation',
    icon:Settings, x:376, y:326, r:42,
    lx:376, ly:383, anchor:'middle' },
  { id:'cat_pipeline',  type:'category', cat:'pipeline',
    label:'Pipeline', sub:'Transform & Orchestrate',
    icon:Workflow, x:624, y:326, r:42,
    lx:624, ly:383, anchor:'middle' },
  { id:'cat_cloud',     type:'category', cat:'cloud',
    label:'Cloud / AWS', sub:'Data Lake & Queries',
    icon:Cloud, x:624, y:574, r:42,
    lx:624, ly:631, anchor:'middle' },
  { id:'cat_languages', type:'category', cat:'languages',
    label:'Languages', sub:'Code & Query',
    icon:Code2, x:376, y:574, r:42,
    lx:376, ly:631, anchor:'middle' },

  // ── DEVOPS SKILLS ────────────────────────────────────────────────────────
  { id:'git', type:'skill', cat:'devops',
    label:'Git', sub:'Version control',
    icon:SiGit, x:205, y:344, r:30, proficiency:82,
    desc:'Branching strategy, PR workflows, code review processes.',
    lx:159, ly:349, anchor:'end' },
  { id:'github_actions', type:'skill', cat:'devops',
    label:'GH Actions', sub:'CI/CD · 1+ yr',
    icon:SiGithubactions, x:281, y:231, r:30, proficiency:60,
    desc:'Automated testing, dbt CI runs, deployment pipelines.',
    lx:235, ly:236, anchor:'end' },
  { id:'docker', type:'skill', cat:'devops',
    label:'Docker', sub:'Containers · 1.5+ yrs',
    icon:SiDocker, x:404, y:155, r:30, proficiency:70,
    desc:'Containerization, microservices, Airflow deployment.',
    lx:404, ly:113, anchor:'middle' },

  // ── PIPELINE SKILLS ──────────────────────────────────────────────────────
  { id:'dbt', type:'skill', cat:'pipeline',
    label:'dbt', sub:'Transform · 2+ yrs',
    icon:SiDbt, x:596, y:155, r:30, proficiency:80,
    desc:'Incremental models, macros, Jinja, schema.yml automation.',
    lx:596, ly:113, anchor:'middle' },
  { id:'airflow', type:'skill', cat:'pipeline',
    label:'Airflow', sub:'Orchestration · 1+ yr',
    icon:SiApacheairflow, x:719, y:231, r:30, proficiency:70,
    desc:'Dynamic DAG factory, conditional execution, 99.9% reliability.',
    lx:765, ly:236, anchor:'start' },
  { id:'sql_server', type:'skill', cat:'pipeline',
    label:'SQL Server', sub:'Legacy source DB',
    icon:DiMsqlServer, x:795, y:354, r:30, proficiency:80,
    desc:'Stored procedures, legacy migrations, migrated to Athena.',
    lx:841, ly:359, anchor:'start' },

  // ── CLOUD SKILLS ────────────────────────────────────────────────────────
  { id:'athena', type:'skill', cat:'cloud',
    label:'Athena', sub:'Serverless SQL · 3+ yrs',
    icon:FaAws, x:795, y:546, r:30, proficiency:85,
    desc:'Serverless analytics, 35% cost reduction, partition optimization.',
    lx:841, ly:551, anchor:'start' },
  { id:'s3', type:'skill', cat:'cloud',
    label:'S3', sub:'Data lake · 3+ yrs',
    icon:FaAws, x:719, y:669, r:30, proficiency:82,
    desc:'Data lake, parquet/snappy, lifecycle policies, partitioning.',
    lx:765, ly:674, anchor:'start' },
  { id:'glue', type:'skill', cat:'cloud',
    label:'AWS Glue', sub:'Catalog · 2+ yrs',
    icon:FaAws, x:596, y:745, r:30, proficiency:72,
    desc:'Data catalog, schema discovery, Athena integration.',
    lx:596, ly:791, anchor:'middle' },

  // ── LANGUAGE SKILLS ──────────────────────────────────────────────────────
  { id:'python', type:'skill', cat:'languages',
    label:'Python', sub:'Scripting · 2+ yrs',
    icon:SiPython, x:404, y:745, r:30, proficiency:75,
    desc:'Pandas, Boto3, file automation, Flask APIs, dbt schema generation.',
    lx:404, ly:791, anchor:'middle' },
  { id:'sql', type:'skill', cat:'languages',
    label:'SQL', sub:'Advanced · 1.5+ yrs',
    icon:Database, x:281, y:669, r:30, proficiency:80,
    desc:'CTEs, window functions, stored procedures, query optimization.',
    lx:235, ly:674, anchor:'end' },
  { id:'jinja', type:'skill', cat:'languages',
    label:'Jinja', sub:'Templating · dbt macros',
    icon:SiJinja, x:205, y:546, r:30, proficiency:70,
    desc:'dbt macro language, dynamic SQL generation, schema injection.',
    lx:159, ly:551, anchor:'end' },
];

// ── Pre-calculated PCB traces ──────────────────────────────────────────────
// Format: polyline points for right-angle routing
// Waypoints: DevOps(334,284) Pipeline(666,284) Cloud(666,616) Languages(334,616)
// Skill waypoints at r=235 from center

const TRACES: SGTrace[] = [
  // Center → Categories (straight radial)
  { id:'c-d',  from:'center', to:'cat_devops',    type:'main', pts:[[500,450],[376,326]] },
  { id:'c-p',  from:'center', to:'cat_pipeline',  type:'main', pts:[[500,450],[624,326]] },
  { id:'c-cl', from:'center', to:'cat_cloud',     type:'main', pts:[[500,450],[624,574]] },
  { id:'c-l',  from:'center', to:'cat_languages', type:'main', pts:[[500,450],[376,574]] },

  // DevOps → Skills (shared junction at 334,284)
  { id:'d-git', from:'cat_devops', to:'git',            type:'main', pts:[[376,326],[334,284],[276,377],[205,344]] },
  { id:'d-gh',  from:'cat_devops', to:'github_actions', type:'main', pts:[[376,326],[334,284],[281,231]] },
  { id:'d-doc', from:'cat_devops', to:'docker',         type:'main', pts:[[376,326],[334,284],[427,226],[404,155]] },

  // Pipeline → Skills (shared junction at 666,284)
  { id:'p-dbt', from:'cat_pipeline', to:'dbt',        type:'main', pts:[[624,326],[666,284],[573,226],[596,155]] },
  { id:'p-af',  from:'cat_pipeline', to:'airflow',    type:'main', pts:[[624,326],[666,284],[719,231]] },
  { id:'p-ss',  from:'cat_pipeline', to:'sql_server', type:'main', pts:[[624,326],[666,284],[724,377],[795,354]] },

  // Cloud → Skills (shared junction at 666,616)
  { id:'cl-at', from:'cat_cloud', to:'athena', type:'main', pts:[[624,574],[666,616],[724,523],[795,546]] },
  { id:'cl-s3', from:'cat_cloud', to:'s3',     type:'main', pts:[[624,574],[666,616],[719,669]] },
  { id:'cl-gl', from:'cat_cloud', to:'glue',   type:'main', pts:[[624,574],[666,616],[573,674],[596,745]] },

  // Languages → Skills (shared junction at 334,616)
  { id:'l-py',  from:'cat_languages', to:'python', type:'main', pts:[[376,574],[334,616],[427,674],[404,745]] },
  { id:'l-sql', from:'cat_languages', to:'sql',    type:'main', pts:[[376,574],[334,616],[281,669]] },
  { id:'l-ji',  from:'cat_languages', to:'jinja',  type:'main', pts:[[376,574],[334,616],[276,523],[205,546]] },

];

// ── Adjacency for lineage ──────────────────────────────────────────────────
function buildAdj() {
  const m: Record<string, Set<string>> = {};
  NODES.forEach(n => { m[n.id] = new Set(); });
  TRACES.forEach(t => { m[t.from]?.add(t.to); m[t.to]?.add(t.from); });
  return m;
}

function getConnected(id: string, adj: Record<string, Set<string>>) {
  const v = new Set([id]); const q = [id];
  while (q.length) { const c = q.shift()!; adj[c]?.forEach(n => { if (!v.has(n)) { v.add(n); q.push(n); } }); }
  return v;
}

// ── Detail panel ────────────────────────────────────────────────────────────
function DetailPanel({ node, onClose }: { node: SGNode; onClose: () => void }) {
  const cfg = node.cat ? CAT[node.cat] : { color: AMBER, glow: 'rgba(245,158,11,0.45)', bg: 'rgba(245,158,11,0.12)' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{   opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl p-5"
      style={{
        background: 'var(--surface-elevated)',
        border:     `1px solid ${cfg.color}55`,
        boxShadow:  `0 0 28px ${cfg.glow}, 0 8px 32px rgba(0,0,0,0.25)`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: cfg.bg, border: `1px solid ${cfg.color}40`, color: cfg.color }}>
            <node.icon />
          </div>
          <div>
            <div className="font-mono font-bold text-sm" style={{ color: cfg.color }}>
              {node.label}
            </div>
            {node.sub && (
              <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--textSecondary)' }}>
                {node.sub}
              </div>
            )}
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity"
          style={{ color: 'var(--textSecondary)' }}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {node.proficiency && (
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: 'var(--textTertiary)' }}>Proficiency</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: cfg.color }}>{node.proficiency}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--borderSubtle)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}80)` }}
              initial={{ width: 0 }}
              animate={{ width: `${node.proficiency}%` }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
        </div>
      )}

      {node.desc && (
        <p className="text-xs font-mono leading-relaxed mb-4" style={{ color: 'var(--textSecondary)' }}>
          {node.desc}
        </p>
      )}
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function SkillGraph() {
  const [hoverId,    setHoverId]    = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [appeared,   setAppeared]   = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });

  useEffect(() => {
    if (inView) { const t = setTimeout(() => setAppeared(true), 100); return () => clearTimeout(t); }
  }, [inView]);

  const adj       = useMemo(() => buildAdj(), []);
  const activeId  = hoverId || selectedId;
  const connected = useMemo(
    () => activeId ? getConnected(activeId, adj) : new Set<string>(),
    [activeId, adj]
  );

  const selectedNode = NODES.find(n => n.id === selectedId);

  // Helper: get effective color for a node
  const nodeColor = (n: SGNode) => n.cat ? CAT[n.cat].color : AMBER;

  // Helper: trace opacity
  const traceOp = (t: SGTrace) => {
    if (!activeId) return 0.45;
    const lit = connected.has(t.from) && connected.has(t.to);
    if (!lit) return 0.04;
    return 0.95;
  };

  // Dots to render at each bend point in traces
  const bendDots = useMemo(() => {
    const dots: { x: number; y: number; traceId: string }[] = [];
    TRACES.forEach(t => {
      // Bend points = all points except first and last
      for (let i = 1; i < t.pts.length - 1; i++) {
        dots.push({ x: t.pts[i][0], y: t.pts[i][1], traceId: t.id });
      }
    });
    return dots;
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex flex-col xl:flex-row gap-6 items-start">

        {/* ── Main SVG Canvas ── */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            // Dark circuit board background
            background: 'var(--surface-subtle)',
            border:     '1px solid var(--borderSubtle)',
            aspectRatio: `${VW} / ${VH}`,
          }}
        >
          {/* Very dark inner bg for PCB look */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.30) 100%)',
              pointerEvents: 'none',
            }}
          />

          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="w-full h-full relative z-10"
            style={{ display: 'block' }}
          >
            <defs>
              {/* Subtle PCB grid pattern */}
              <pattern id="pcb-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40,0 L0,0 0,40" fill="none" stroke={TRACE_COLOR} strokeWidth="0.3" strokeOpacity="0.15" />
              </pattern>

              {/* Center radial glow */}
              <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={AMBER} stopOpacity="0.28" />
                <stop offset="60%"  stopColor={AMBER} stopOpacity="0.08" />
                <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
              </radialGradient>

              {/* Glow filter for active elements */}
              <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feColorMatrix in="blur" type="matrix"
                  values="3 2 0 0 0  1.5 0.8 0 0 0  0 0.2 0 0 0  0 0 0 0.9 0" result="colored" />
                <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>

              <filter id="glow-soft">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* PCB grid background */}
            <rect width={VW} height={VH} fill="url(#pcb-grid)" />

            {/* Center ambient glow */}
            <circle cx={CX} cy={CY} r={220} fill="url(#center-glow)" />

            {/* ── Center decorative rings ── */}
            {/* Outer dashed orbit */}
            <motion.circle cx={CX} cy={CY} r={90}
              fill="none" stroke={AMBER} strokeWidth={0.8}
              strokeOpacity={0.18} strokeDasharray="8 6"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            />
            {/* Inner dashed orbit */}
            <motion.circle cx={CX} cy={CY} r={74}
              fill="none" stroke={AMBER} strokeWidth={0.6}
              strokeOpacity={0.12} strokeDasharray="4 8"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            />
            {/* Solid inner ring */}
            <circle cx={CX} cy={CY} r={66}
              fill="none" stroke={AMBER} strokeWidth={1} strokeOpacity={0.35} />

            {/* ── PCB Traces ── */}
            {TRACES.map(t => {
              const op    = traceOp(t);
              const isLit = activeId ? connected.has(t.from) && connected.has(t.to) : false;
              const fromNode = NODES.find(n => n.id === t.from);
              const col   = isLit && fromNode?.cat ? CAT[fromNode.cat].color : TRACE_COLOR;
              const pts   = t.pts.map(p => p.join(',')).join(' ');
              return (
                <polyline
                  key={t.id}
                  points={pts}
                  fill="none"
                  stroke={col}
                  strokeWidth={isLit ? 1.8 : 1.2}
                  strokeOpacity={op}
                  strokeLinejoin="round"
                  strokeDasharray="none"
                  style={{
                    filter: isLit ? `drop-shadow(0 0 3px ${col})` : 'none',
                    transition: 'stroke-opacity 0.2s ease, stroke-width 0.2s ease, stroke 0.2s ease',
                  }}
                />
              );
            })}

            {/* Flowing particles on active main traces */}
            {TRACES.filter(t => t.type === 'main').map(t => {
              const isLit = activeId ? connected.has(t.from) && connected.has(t.to) : false;
              if (!isLit) return null;
              const fromNode = NODES.find(n => n.id === t.from);
              const col = fromNode?.cat ? CAT[fromNode.cat].color : TRACE_COLOR;
              const pts = t.pts.map(p => p.join(',')).join(' ');
              return (
                <circle key={`p-${t.id}`} r={3} fill={col} opacity={0.9}
                  style={{ filter: `drop-shadow(0 0 4px ${col})` }}>
                  <animateMotion dur="1.5s" repeatCount="indefinite" path={
                    `M${t.pts[0][0]},${t.pts[0][1]}` +
                    t.pts.slice(1).map(p => `L${p[0]},${p[1]}`).join('')
                  } />
                </circle>
              );
            })}

            {/* ── Bend dots ── */}
            {bendDots.map((d, i) => {
              const t     = TRACES.find(t => t.id === d.traceId);
              const isLit = t ? (activeId ? connected.has(t.from) && connected.has(t.to) : false) : false;
              const op    = t ? traceOp(t) : 0.3;
              const fromNode = t ? NODES.find(n => n.id === t.from) : undefined;
              const col   = isLit && fromNode?.cat ? CAT[fromNode.cat].color : TRACE_COLOR;
              return (
                <circle key={`bd-${i}`} cx={d.x} cy={d.y} r={3}
                  fill={col} opacity={op}
                  style={{ transition: 'opacity 0.2s ease', filter: isLit ? `drop-shadow(0 0 3px ${col})` : 'none' }}
                />
              );
            })}

            {/* Endpoint dots at skill/category positions (on trace ends) */}
            {TRACES.filter(t => t.pts.length > 0).map(t => {
              const isLit = activeId ? connected.has(t.from) && connected.has(t.to) : false;
              const op    = traceOp(t);
              const fromNode = NODES.find(n => n.id === t.from);
              const col = isLit && fromNode?.cat ? CAT[fromNode.cat].color : TRACE_COLOR;
              const last = t.pts[t.pts.length - 1];
              const first = t.pts[0];
              return (
                <g key={`ep-${t.id}`}>
                  <circle cx={first[0]} cy={first[1]} r={2.5} fill={col} opacity={op * 0.8}
                    style={{ transition: 'opacity 0.2s ease' }} />
                  <circle cx={last[0]}  cy={last[1]}  r={2.5} fill={col} opacity={op * 0.8}
                    style={{ transition: 'opacity 0.2s ease' }} />
                </g>
              );
            })}

            {/* ── Nodes ── */}
            {NODES.map((node, ni) => {
              const isHov  = hoverId === node.id;
              const isSel  = selectedId === node.id;
              const isDim  = !!activeId && !connected.has(node.id);
              const isConn = activeId ? connected.has(node.id) && node.id !== activeId : false;
              const active = isHov || isSel;
              const col    = nodeColor(node);
              const catCfg = node.cat ? CAT[node.cat] : { color: AMBER, glow: 'rgba(245,158,11,0.55)', bg: 'rgba(245,158,11,0.14)' };

              // Entrance delay
              const delay = node.type === 'center' ? 0 : node.type === 'category' ? 0.3 + ni * 0.05 : 0.6 + (ni - 5) * 0.04;

              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: appeared ? (isDim ? 0.12 : 1) : 0, scale: appeared ? 1 : 0.4 }}
                  transition={{ delay, duration: 0.4, ease: 'easeOut' }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px`, cursor: 'pointer' }}
                  onMouseEnter={() => setHoverId(node.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onClick={() => setSelectedId(p => p === node.id ? null : node.id)}
                >
                  {/* Pulse ring on active */}
                  {active && (
                    <motion.circle cx={node.x} cy={node.y} r={node.r + 8}
                      fill="none" stroke={col} strokeWidth={0.8} strokeOpacity={0.3}
                      initial={{ r: node.r + 4, opacity: 0 }}
                      animate={{ r: node.r + 20, opacity: [0.4, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}

                  {/* Outer glow ring (shown on connected/active) */}
                  {(active || isConn) && (
                    <circle cx={node.x} cy={node.y} r={node.r + 5}
                      fill="none" stroke={col}
                      strokeWidth={0.8} strokeOpacity={0.4}
                      style={{ filter: `drop-shadow(0 0 6px ${catCfg.glow})` }}
                    />
                  )}

                  {/* Main circle */}
                  <motion.circle
                    cx={node.x} cy={node.y} r={node.r}
                    fill={active ? catCfg.bg : 'var(--surface)'}
                    stroke={col}
                    strokeWidth={active ? 2.5 : isConn ? 1.8 : node.type === 'center' ? 2.5 : 1.5}
                    strokeOpacity={active ? 1 : isConn ? 0.8 : 0.85}
                    animate={{ r: active ? node.r + 3 : node.r }}
                    transition={{ duration: 0.18 }}
                    style={{
                      filter: active
                        ? `drop-shadow(0 0 8px ${col}) drop-shadow(0 0 16px ${catCfg.glow})`
                        : isConn
                        ? `drop-shadow(0 0 5px ${catCfg.glow})`
                        : 'none',
                      transition: 'filter 0.2s ease',
                    }}
                  />

                  {/* Inner ring for center node */}
                  {node.type === 'center' && (
                    <circle cx={node.x} cy={node.y} r={node.r - 10}
                      fill="none" stroke={col} strokeWidth={0.8} strokeOpacity={0.35} />
                  )}

                  {/* Icon */}
                  <g 
                    transform={`translate(${node.x - (node.type === 'center' ? 18 : node.type === 'category' ? 12 : 10)}, ${node.y - (node.type === 'center' ? 18 : node.type === 'category' ? 12 : 10)})`}
                    style={{ pointerEvents: 'none', color: col }}
                  >
                    <node.icon size={node.type === 'center' ? 36 : node.type === 'category' ? 24 : 20} />
                  </g>

                  {/* Center title (inside circle) */}
                  {node.type === 'center' && (
                    <text x={node.x} y={node.y + 18} textAnchor="middle"
                      fontSize={10} fontFamily="monospace" fontWeight={700}
                      fill={AMBER} letterSpacing={0.8} style={{ pointerEvents: 'none' }}>
                      DATA ENGINEER
                    </text>
                  )}

                  {/* ── Labels OUTSIDE the circle ── */}
                  {node.type !== 'center' && (
                    <>
                      <text
                        x={node.lx} y={node.ly}
                        textAnchor={node.anchor}
                        fontSize={node.type === 'category' ? 11 : 10.5}
                        fontFamily="monospace"
                        fontWeight={active || isConn ? 700 : 500}
                        fill={active ? col : isConn ? col : 'var(--textPrimary)'}
                        style={{ transition: 'fill 0.2s ease', pointerEvents: 'none' }}
                      >
                        {node.label}
                      </text>
                      {/* Sublabel — only show on hover/select */}
                      {(active || isSel) && node.sub && (
                        <motion.text
                          x={node.lx} y={node.ly + 14}
                          textAnchor={node.anchor}
                          fontSize={8}
                          fontFamily="monospace"
                          fill={col} opacity={0.65}
                          initial={{ opacity: 0 }} animate={{ opacity: 0.65 }}
                          transition={{ duration: 0.15 }}
                          style={{ pointerEvents: 'none' }}
                        >
                          {node.sub}
                        </motion.text>
                      )}
                    </>
                  )}

                  {/* Category sublabel (always shown below) */}
                  {node.type === 'category' && !active && (
                    <text x={node.lx} y={node.ly + 13} textAnchor={node.anchor}
                      fontSize={7.5} fontFamily="monospace"
                      fill={col} opacity={0.45}
                      style={{ pointerEvents: 'none' }}>
                      {node.sub}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>

          {/* Hint */}
          <div className="absolute bottom-3 left-0 right-0 text-center text-[9px] font-mono pointer-events-none"
            style={{ color: 'var(--textTertiary)' }}>
            hover to trace connections · click to inspect
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="w-full xl:w-64 flex flex-col gap-4 shrink-0">

          <AnimatePresence mode="wait">
            {selectedNode ? (
              <DetailPanel key={selectedNode.id} node={selectedNode} onClose={() => setSelectedId(null)} />
            ) : (
              <motion.div key="hint"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="rounded-2xl p-5"
                style={{ background: 'var(--surface-subtle)', border: '1px solid var(--borderSubtle)' }}
              >
                <div className="text-center space-y-3 py-3">
                  <div className="text-3xl">🗺️</div>
                  <div className="font-mono text-sm font-semibold" style={{ color: 'var(--textPrimary)' }}>
                    Skill Ecosystem
                  </div>
                  <p className="text-[11px] font-mono leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                    Tools connected as a real production pipeline — not just logos.
                  </p>
                  <div className="text-[10px] font-mono space-y-2 text-left pt-1">
                    {[
                      { cat:'pipeline'  as Cat, t:'Airflow orchestrates dbt'  },
                      { cat:'pipeline'  as Cat, t:'dbt runs queries on Athena' },
                      { cat:'languages' as Cat, t:'Python writes Airflow DAGs' },
                      { cat:'cloud'     as Cat, t:'Athena reads data from S3'  },
                    ].map(item => (
                      <div key={item.t} className="flex items-center gap-2" style={{ color: 'var(--textSecondary)' }}>
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: CAT[item.cat].color }} />
                        {item.t}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="rounded-2xl p-4"
            style={{ background: 'var(--surface-subtle)', border: '1px solid var(--borderSubtle)' }}>
            <div className="text-[9px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--textTertiary)' }}>
              Categories
            </div>
            <div className="space-y-2.5">
              {(Object.entries(CAT) as [Cat, typeof CAT[Cat]][]).map(([cat, cfg]) => (
                <div key={cat} className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-sm shrink-0"
                    style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.glow}` }} />
                  <span className="text-[11px] font-mono capitalize" style={{ color: 'var(--textSecondary)' }}>
                    {cat === 'devops' ? 'DevOps & CI' : cat === 'pipeline' ? 'Pipeline' : cat === 'cloud' ? 'Cloud / AWS' : 'Languages'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: 'var(--borderSubtle)' }}>
              <div className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--textTertiary)' }}>Traces</div>
              <div className="flex items-center gap-2">
                <svg width="28" height="6">
                  <line x1="0" y1="3" x2="28" y2="3" stroke={TRACE_COLOR} strokeWidth="1.5" />
                </svg>
                <span className="text-[10px] font-mono" style={{ color: 'var(--textSecondary)' }}>category link</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}