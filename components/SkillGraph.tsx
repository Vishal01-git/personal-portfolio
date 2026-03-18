"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import {
  radialNodes, skillEdges, catColors, NODE_R, CX, CY,
  type RadialNode, type SkillCategory,
} from '@/data/skillGraph';

// ── Polar → cartesian ──────────────────────────────────────────────────────
function polar(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function nodePos(n: RadialNode) { return polar(n.angleDeg, n.radius); }

// ── Adjacency for lineage ──────────────────────────────────────────────────
function buildAdj() {
  const m: Record<string, Set<string>> = {};
  radialNodes.forEach(n => { m[n.id] = new Set(); });
  skillEdges.forEach(e => { m[e.from]?.add(e.to); m[e.to]?.add(e.from); });
  return m;
}

function getConnected(id: string, adj: Record<string, Set<string>>) {
  const visited = new Set<string>([id]);
  const q = [id];
  while (q.length) {
    const cur = q.shift()!;
    adj[cur]?.forEach(n => { if (!visited.has(n)) { visited.add(n); q.push(n); } });
  }
  return visited;
}

// ── Label position — push label outside the circle ────────────────────────
function labelPos(n: RadialNode, extraOffset = 0) {
  if (n.type === 'center') return { x: CX, y: CY + NODE_R.center + 18, anchor: 'middle' };
  const r = NODE_R[n.type] + 18 + extraOffset;
  const p = polar(n.angleDeg, n.radius + r);
  const anchor =
    Math.abs(n.angleDeg - 180) < 20 || Math.abs(n.angleDeg) < 20 ? 'middle' :
    (n.angleDeg > 180 && n.angleDeg < 360) ? 'end' : 'start';
  return { ...p, anchor };
}

// ── Animated orbital ring for center node ─────────────────────────────────
function OrbitalRing({ cx, cy, r, opacity, duration, reverse }: {
  cx: number; cy: number; r: number; opacity: number; duration: number; reverse?: boolean;
}) {
  return (
    <motion.circle
      cx={cx} cy={cy} r={r}
      fill="none" stroke="#F59E0B" strokeWidth={0.8}
      strokeOpacity={opacity}
      strokeDasharray="6 12"
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    />
  );
}

// ── Proficiency arc around a skill node ────────────────────────────────────
function ProfArc({ pos, r, pct, color, visible }: {
  pos: { x: number; y: number }; r: number; pct: number; color: string; visible: boolean;
}) {
  if (!visible || pct <= 0) return null;
  const startAngle = -Math.PI / 2;
  const endAngle   = startAngle + 2 * Math.PI * pct;
  const x1 = pos.x + (r + 6) * Math.cos(startAngle);
  const y1 = pos.y + (r + 6) * Math.sin(startAngle);
  const x2 = pos.x + (r + 6) * Math.cos(endAngle);
  const y2 = pos.y + (r + 6) * Math.sin(endAngle);
  const large = pct > 0.5 ? 1 : 0;
  const d = `M${x1},${y1} A${r + 6},${r + 6} 0 ${large},1 ${x2},${y2}`;
  return (
    <motion.path d={d} fill="none" stroke={color} strokeWidth={2.5}
      strokeLinecap="round" strokeOpacity={0.65}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
    />
  );
}

// ── Single cross-skill edge ────────────────────────────────────────────────
function CrossEdge({
  edge, fromNode, toNode, isActive, isDimmed,
}: {
  edge: typeof skillEdges[0];
  fromNode: RadialNode; toNode: RadialNode;
  isActive: boolean; isDimmed: boolean;
}) {
  const fp  = nodePos(fromNode);
  const tp  = nodePos(toNode);
  // Pull control point toward center for a gentle inward arc
  const mx  = (fp.x + tp.x) / 2;
  const my  = (fp.y + tp.y) / 2;
  const pullX = mx + (CX - mx) * 0.4;
  const pullY = my + (CY - my) * 0.4;
  const d   = `M${fp.x},${fp.y} Q${pullX},${pullY} ${tp.x},${tp.y}`;
  const col = fromNode.color;

  return (
    <g>
      <motion.path
        d={d} fill="none"
        stroke={col}
        strokeWidth={isActive ? 1.5 : 0.7}
        strokeOpacity={isDimmed ? 0.04 : isActive ? 0.85 : 0.10}
        strokeDasharray={isActive ? '7 5' : '3 5'}
        animate={{
          strokeOpacity: isDimmed ? 0.04 : isActive ? 0.85 : 0.10,
          strokeWidth:   isActive ? 1.5 : 0.7,
        }}
        transition={{ duration: 0.22 }}
        style={{ filter: isActive ? `drop-shadow(0 0 3px ${col})` : 'none' }}
        className={isActive ? 'edge-animated' : ''}
      />
      {/* Flowing particle along active edge */}
      {isActive && (
        <circle r={3.5} fill={col} opacity={0.95}
          style={{ filter: `drop-shadow(0 0 5px ${col})` }}>
          <animateMotion dur="1.4s" repeatCount="indefinite" path={d} />
        </circle>
      )}
    </g>
  );
}

// ── SVG node circle + external label ──────────────────────────────────────
function SvgNode({
  node, isActive, isConnected, isDimmed, isSelected, appeared,
  onEnter, onLeave, onClick,
}: {
  node: RadialNode;
  isActive: boolean; isConnected: boolean; isDimmed: boolean;
  isSelected: boolean; appeared: boolean;
  onEnter: () => void; onLeave: () => void; onClick: () => void;
}) {
  const pos  = nodePos(node);
  const r    = NODE_R[node.type];
  const lp   = labelPos(node);
  const catCfg = node.category ? catColors[node.category] : null;
  const fillBg = isActive || isSelected
    ? (catCfg?.bg || 'rgba(245,158,11,0.15)')
    : 'var(--surface)';
  const strokeC = isActive || isSelected || isConnected ? node.color : 'var(--borderDefault)';

  const glowFilter = isActive || isSelected
    ? `drop-shadow(0 0 10px ${node.color}) drop-shadow(0 0 20px ${node.color}60)`
    : isConnected
    ? `drop-shadow(0 0 6px ${node.color}80)`
    : 'none';

  return (
    <g
      style={{
        cursor:  'pointer',
        opacity: isDimmed ? 0.1 : appeared ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Proficiency arc for skill nodes */}
      {node.type === 'skill' && node.proficiency && appeared && (
        <ProfArc
          pos={pos} r={r}
          pct={node.proficiency / 100}
          color={node.color}
          visible={isActive || isConnected || isSelected}
        />
      )}

      {/* Node circle */}
      <motion.circle
        cx={pos.x} cy={pos.y} r={r}
        fill={fillBg}
        stroke={strokeC}
        strokeWidth={isActive || isSelected ? 2 : isConnected ? 1.5 : 1}
        animate={{ r: isActive ? r + 4 : r }}
        transition={{ duration: 0.18 }}
        style={{ filter: glowFilter, transition: 'filter 0.22s ease' }}
      />

      {/* Outer pulse ring on hover */}
      {(isActive || isSelected) && (
        <motion.circle
          cx={pos.x} cy={pos.y} r={r + 12}
          fill="none" stroke={node.color}
          strokeWidth={0.8} strokeOpacity={0.3}
          initial={{ r: r + 4, opacity: 0 }}
          animate={{ r: r + 18, opacity: [0.4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* Icon */}
      <text
        x={pos.x}
        y={node.type === 'center' ? pos.y - 8 : pos.y + 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={node.type === 'center' ? 26 : node.type === 'category' ? 20 : 16}
        style={{ userSelect: 'none' }}
      >
        {node.icon}
      </text>

      {/* Center node has title inside */}
      {node.type === 'center' && (
        <text
          x={pos.x} y={pos.y + 20}
          textAnchor="middle"
          fontSize={10}
          fontFamily="monospace"
          fontWeight={600}
          fill="#F59E0B"
          letterSpacing={0.5}
        >
          {node.label}
        </text>
      )}

      {/* ── LABELS OUTSIDE THE CIRCLE ── */}
      {node.type !== 'center' && (
        <>
          {/* Main label */}
          <text
            x={lp.x} y={lp.y}
            textAnchor={lp.anchor as 'start' | 'middle' | 'end'}
            fontSize={node.type === 'category' ? 11 : 10}
            fontFamily="monospace"
            fontWeight={isActive || isSelected ? 700 : 500}
            fill={isActive || isSelected || isConnected ? node.color : 'var(--textPrimary)'}
            style={{ transition: 'fill 0.2s ease' }}
          >
            {node.label}
          </text>
          {/* Sublabel — only show on hover */}
          {(isActive || isSelected) && (
            <motion.text
              x={lp.x} y={lp.y + 13}
              textAnchor={lp.anchor as 'start' | 'middle' | 'end'}
              fontSize={8}
              fontFamily="monospace"
              fill={node.color}
              opacity={0.65}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              transition={{ duration: 0.2 }}
            >
              {node.sublabel}
            </motion.text>
          )}
        </>
      )}
    </g>
  );
}

// ── Detail panel ───────────────────────────────────────────────────────────
function DetailPanel({ node, onClose }: { node: RadialNode; onClose: () => void }) {
  const cfg = node.category
    ? catColors[node.category]
    : { primary: '#F59E0B', glow: 'rgba(245,158,11,0.35)', bg: 'rgba(245,158,11,0.12)' };

  const related = skillEdges
    .filter(e => e.from === node.id || e.to === node.id)
    .map(e => ({
      label: e.label,
      other: radialNodes.find(n => n.id === (e.from === node.id ? e.to : e.from))!,
    }))
    .filter(r => r.other);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{   opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl p-5"
      style={{
        background: 'var(--surface-elevated)',
        border:     `1px solid ${cfg.primary}50`,
        boxShadow:  `0 0 28px ${cfg.glow}, 0 8px 32px rgba(0,0,0,0.2)`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: cfg.bg, border: `1px solid ${cfg.primary}40` }}>
            {node.icon}
          </div>
          <div>
            <div className="font-mono font-bold text-sm" style={{ color: cfg.primary }}>
              {node.label}
            </div>
            <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--textSecondary)' }}>
              {node.sublabel}
            </div>
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
            <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: 'var(--textTertiary)' }}>
              Proficiency
            </span>
            <span className="text-[10px] font-mono" style={{ color: cfg.primary }}>
              {node.proficiency}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--borderSubtle)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${cfg.primary}, ${cfg.primary}80)` }}
              initial={{ width: 0 }}
              animate={{ width: `${node.proficiency}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
        </div>
      )}

      {node.description && (
        <p className="text-xs font-mono leading-relaxed mb-4" style={{ color: 'var(--textSecondary)' }}>
          {node.description}
        </p>
      )}

      {related.length > 0 && (
        <>
          <div className="h-px mb-3" style={{ background: 'var(--borderSubtle)' }} />
          <div className="text-[9px] font-mono uppercase tracking-widest mb-2.5" style={{ color: 'var(--textTertiary)' }}>
            Connections
          </div>
          <ul className="space-y-1.5">
            {related.map((r, i) => (
              <motion.li key={i}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 text-[11px] font-mono"
                style={{ color: 'var(--textSecondary)' }}
              >
                <ChevronRight className="w-3 h-3 shrink-0"
                  style={{ color: r.other.color }} />
                <span style={{ color: r.other.color }}>{r.other.label}</span>
                <span className="opacity-40">—</span>
                <span>{r.label}</span>
              </motion.li>
            ))}
          </ul>
        </>
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
    if (inView) {
      const t = setTimeout(() => setAppeared(true), 100);
      return () => clearTimeout(t);
    }
  }, [inView]);

  const adj       = useMemo(() => buildAdj(), []);
  const activeId  = hoverId || selectedId;
  const connected = useMemo(
    () => activeId ? getConnected(activeId, adj) : new Set<string>(),
    [activeId, adj]
  );

  const selectedNode = radialNodes.find(n => n.id === selectedId);

  return (
    <div ref={containerRef} className="w-full">
      <style>{`
        @keyframes edge-flow { to { stroke-dashoffset: -24; } }
        .edge-animated { animation: edge-flow 1s linear infinite; }
      `}</style>

      <div className="flex flex-col xl:flex-row gap-6 items-start">

        {/* ── SVG Graph ── */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background:  'var(--surface-subtle)',
            border:      '1px solid var(--borderSubtle)',
            aspectRatio: '1000 / 960',
          }}
        >
          {/* Ambient center glow */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center"
            style={{ paddingBottom: '4%' }}>
            <motion.div
              className="rounded-full"
              style={{
                width: '30%', height: '30%',
                background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <svg viewBox={`0 0 1000 960`} className="w-full h-full" style={{ display: 'block' }}>
            <defs>
              {/* Radial gradient for center node fill */}
              <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#F59E0B" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.06" />
              </radialGradient>
            </defs>

            {/* ── Orbital decoration rings around center ── */}
            <OrbitalRing cx={CX} cy={CY} r={NODE_R.center + 20} opacity={0.12} duration={18} />
            <OrbitalRing cx={CX} cy={CY} r={120} opacity={0.07} duration={30} reverse />
            <OrbitalRing cx={CX} cy={CY} r={200} opacity={0.04} duration={50} />

            {/* ── Cross-skill edges (only 11) ── */}
            {skillEdges.map((edge, i) => {
              const fn = radialNodes.find(n => n.id === edge.from);
              const tn = radialNodes.find(n => n.id === edge.to);
              if (!fn || !tn) return null;
              const isActive = activeId
                ? connected.has(edge.from) && connected.has(edge.to)
                : false;
              const isDimmed = !!activeId && !isActive;
              return (
                <CrossEdge
                  key={`${edge.from}-${edge.to}-${i}`}
                  edge={edge} fromNode={fn} toNode={tn}
                  isActive={isActive} isDimmed={isDimmed}
                />
              );
            })}

            {/* ── Nodes — staggered entrance by ring ── */}
            {(['center', 'category', 'skill'] as const).map(type =>
              radialNodes
                .filter(n => n.type === type)
                .map((node, ni) => (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: appeared ? 1 : 0,
                      scale:   appeared ? 1 : 0.5,
                    }}
                    transition={{
                      delay:    type === 'center' ? 0 : type === 'category' ? 0.25 + ni * 0.07 : 0.55 + ni * 0.05,
                      duration: 0.4,
                      ease:     'easeOut',
                    }}
                    style={{ transformOrigin: `${nodePos(node).x}px ${nodePos(node).y}px` }}
                  >
                    <SvgNode
                      node={node}
                      isActive={hoverId === node.id}
                      isConnected={activeId ? connected.has(node.id) && node.id !== activeId : false}
                      isDimmed={!!activeId && !connected.has(node.id)}
                      isSelected={selectedId === node.id}
                      appeared={appeared}
                      onEnter={() => setHoverId(node.id)}
                      onLeave={() => setHoverId(null)}
                      onClick={() => setSelectedId(p => p === node.id ? null : node.id)}
                    />
                  </motion.g>
                ))
            )}
          </svg>

          <div
            className="absolute bottom-2.5 left-0 right-0 text-center text-[9px] font-mono pointer-events-none"
            style={{ color: 'var(--textTertiary)' }}
          >
            hover to trace · click to inspect
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="w-full xl:w-64 flex flex-col gap-4 shrink-0">

          <AnimatePresence mode="wait">
            {selectedNode ? (
              <DetailPanel
                key={selectedNode.id}
                node={selectedNode}
                onClose={() => setSelectedId(null)}
              />
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="rounded-2xl p-5"
                style={{ background: 'var(--surface-subtle)', border: '1px solid var(--borderSubtle)' }}
              >
                <div className="text-center space-y-3 py-3">
                  <div className="text-3xl">🗺️</div>
                  <div className="font-mono text-sm font-semibold" style={{ color: 'var(--textPrimary)' }}>
                    Skill dependency graph
                  </div>
                  <p className="text-[11px] font-mono leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                    Tools connected by real production workflows — not just a list of logos.
                  </p>
                  <div className="text-[10px] font-mono space-y-2 text-left pt-1">
                    {[
                      { cat: 'pipeline'  as SkillCategory, t: 'Airflow orchestrates dbt'   },
                      { cat: 'pipeline'  as SkillCategory, t: 'dbt runs queries on Athena'  },
                      { cat: 'languages' as SkillCategory, t: 'Python writes Airflow DAGs'  },
                      { cat: 'cloud'     as SkillCategory, t: 'Athena reads data from S3'   },
                    ].map(item => (
                      <div key={item.t} className="flex items-center gap-2"
                        style={{ color: 'var(--textSecondary)' }}>
                        <div className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: catColors[item.cat].primary }} />
                        {item.t}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div
            className="rounded-2xl p-4"
            style={{ background: 'var(--surface-subtle)', border: '1px solid var(--borderSubtle)' }}
          >
            <div className="text-[9px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--textTertiary)' }}>
              Categories
            </div>
            <div className="space-y-2">
              {(Object.entries(catColors) as [SkillCategory, typeof catColors[SkillCategory]][]).map(([cat, cfg]) => (
                <div key={cat} className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: cfg.primary, boxShadow: `0 0 5px ${cfg.glow}` }} />
                  <span className="text-[11px] font-mono capitalize" style={{ color: 'var(--textSecondary)' }}>
                    {cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}