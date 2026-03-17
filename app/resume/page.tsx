"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Zap, ChevronRight, GitBranch, LayoutList } from 'lucide-react';
import {
  resumeNodes, resumeEdges, layerConfig, tagColors,
  LAYER_ORDER, type ResumeLayer, type ResumeNode,
} from '@/data/resume';
import { links } from '@/data/links';

// ─── Helpers ──────────────────────────────────────────────────────────────
const nodesByLayer = LAYER_ORDER.reduce((acc, l) => {
  acc[l] = resumeNodes.filter(n => n.layer === l);
  return acc;
}, {} as Record<ResumeLayer, ResumeNode[]>);

function buildAdj() {
  const down: Record<string, string[]> = {};
  const up:   Record<string, string[]> = {};
  resumeNodes.forEach(n => { down[n.id] = []; up[n.id] = []; });
  resumeEdges.forEach(e => { down[e.from].push(e.to); up[e.to].push(e.from); });
  return { down, up };
}

function getLineage(id: string, adj: ReturnType<typeof buildAdj>): Set<string> {
  const visited = new Set<string>();
  const q = [id];
  while (q.length) {
    const cur = q.shift()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    [...(adj.down[cur] || []), ...(adj.up[cur] || [])].forEach(n => q.push(n));
  }
  return visited;
}

interface Rect { x: number; y: number; w: number; h: number; }

// ─── Animated SVG Edges ───────────────────────────────────────────────────
function Edges({
  rects,
  active,
  lineage,
}: {
  rects: Record<string, Rect>;
  active: string | null;
  lineage: Set<string>;
}) {
  if (!Object.keys(rects).length) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%', overflow: 'visible', zIndex: 1 }}
    >
      <defs>
        {/* Animated dash for active edges */}
        <style>{`
          @keyframes dash-flow {
            to { stroke-dashoffset: -20; }
          }
          .edge-active {
            animation: dash-flow 0.6s linear infinite;
          }
        `}</style>
        {LAYER_ORDER.map(layer => {
          const c = layerConfig[layer];
          return (
            <linearGradient key={layer} id={`eg-${layer}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={c.color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={c.color} stopOpacity="0.15" />
            </linearGradient>
          );
        })}
      </defs>

      {resumeEdges.map((edge, i) => {
        const fr = rects[edge.from];
        const tr = rects[edge.to];
        if (!fr || !tr) return null;

        const x1 = fr.x + fr.w;
        const y1 = fr.y + fr.h / 2;
        const x2 = tr.x;
        const y2 = tr.y + tr.h / 2;
        // Horizontal bezier control points — clean S-curve
        const dx  = Math.abs(x2 - x1) * 0.55;
        const cx1 = x1 + dx;
        const cx2 = x2 - dx;

        const fromNode    = resumeNodes.find(n => n.id === edge.from)!;
        const isLit       = active ? lineage.has(edge.from) && lineage.has(edge.to) : false;
        const isDim       = active ? !(lineage.has(edge.from) && lineage.has(edge.to)) : false;
        const cfg         = layerConfig[fromNode.layer];

        return (
          <path
            key={`${edge.from}→${edge.to}-${i}`}
            d={`M${x1},${y1} C${cx1},${y1} ${cx2},${y2} ${x2},${y2}`}
            fill="none"
            stroke={isLit ? cfg.color : `url(#eg-${fromNode.layer})`}
            strokeWidth={isLit ? 1.5 : 1}
            strokeOpacity={isDim ? 0.03 : isLit ? 1 : 0.12}
            strokeDasharray={isLit ? '6 4' : 'none'}
            className={isLit ? 'edge-active' : ''}
            style={{
              filter:     isLit ? `drop-shadow(0 0 4px ${cfg.color})` : 'none',
              transition: 'stroke-opacity 0.25s ease, stroke-width 0.25s ease',
            }}
          />
        );
      })}
    </svg>
  );
}

// ─── Node card ────────────────────────────────────────────────────────────
function NodeCard({
  node, isActive, inLineage, isDimmed, isSelected,
  onEnter, onLeave, onClick, setRef,
}: {
  node: ResumeNode;
  isActive: boolean; inLineage: boolean; isDimmed: boolean; isSelected: boolean;
  onEnter: () => void; onLeave: () => void; onClick: () => void;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  const cfg = layerConfig[node.layer];
  const tag = node.tag ? tagColors[node.tagColor || 'skills'] : null;

  return (
    <motion.div
      ref={setRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      animate={{
        opacity: isDimmed ? 0.15 : 1,
        y:       isActive ? -2 : 0,
      }}
      transition={{ duration: 0.18 }}
      className="relative cursor-pointer rounded-2xl p-4 select-none"
      style={{
        background:  isActive || isSelected
          ? cfg.bg
          : 'var(--glass-bg)',
        border: `1px solid ${
          isActive || isSelected ? cfg.border
          : inLineage             ? cfg.dimColor
          : 'var(--borderSubtle)'
        }`,
        boxShadow: isActive || isSelected
          ? `0 0 20px ${cfg.glow}, 0 4px 16px rgba(0,0,0,0.15)`
          : inLineage
          ? `0 0 8px ${cfg.glow}`
          : 'none',
        backdropFilter: 'blur(12px)',
        zIndex: isActive || isSelected ? 10 : 1,
      }}
    >
      {/* Corner dot */}
      <div
        className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full"
        style={{
          background: cfg.color,
          boxShadow:  isActive || inLineage ? `0 0 8px ${cfg.glow}` : 'none',
          opacity:    isActive || inLineage ? 1 : 0.5,
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg leading-none shrink-0">{node.icon}</span>
          <div className="min-w-0">
            <div
              className="text-sm font-mono font-semibold leading-tight"
              style={{ color: isActive || inLineage ? cfg.color : 'var(--textPrimary)' }}
            >
              {node.title}
            </div>
            <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--textSecondary)' }}>
              {node.subtitle}
            </div>
          </div>
        </div>
        {tag && node.tag && (
          <span
            className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
            style={{ color: tag.color, background: tag.bg }}
          >
            {node.tag}
          </span>
        )}
      </div>

      {/* Meta */}
      {node.meta && (
        <div className="text-[9px] font-mono mt-1" style={{ color: cfg.color, opacity: 0.75 }}>
          {node.meta}
        </div>
      )}

      {/* Selected underline */}
      {isSelected && (
        <div
          className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
          style={{ background: cfg.color }}
        />
      )}
    </motion.div>
  );
}

// ─── Detail drawer ────────────────────────────────────────────────────────
function DetailDrawer({ node, onClose }: { node: ResumeNode; onClose: () => void }) {
  const cfg = layerConfig[node.layer];
  const tag = node.tag ? tagColors[node.tagColor || 'skills'] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{   opacity: 0, y: 8,  scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="rounded-2xl p-5"
      style={{
        background:  'var(--surface-elevated)',
        border:      `1px solid ${cfg.border}`,
        boxShadow:   `0 0 32px ${cfg.glow}, 0 12px 40px rgba(0,0,0,0.25)`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            {node.icon}
          </div>
          <div>
            <div className="font-mono font-bold text-base" style={{ color: cfg.color }}>
              {node.title}
            </div>
            <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--textSecondary)' }}>
              {node.subtitle}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-opacity hover:opacity-60"
          style={{ color: 'var(--textSecondary)' }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Badges row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span
          className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          {layerConfig[node.layer].label}
        </span>
        {tag && node.tag && (
          <span
            className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ color: tag.color, background: tag.bg }}
          >
            {node.tag}
          </span>
        )}
        {node.meta && (
          <span className="text-[9px] font-mono ml-auto" style={{ color: 'var(--textTertiary)' }}>
            {node.meta}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="h-px mb-4" style={{ background: 'var(--borderSubtle)' }} />

      {/* Bullets */}
      {node.bullets && (
        <ul className="space-y-2.5">
          {node.bullets.map((b, i) => (
            <motion.li
              key={b}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              className="flex items-start gap-2.5 text-xs font-mono"
              style={{ color: 'var(--textSecondary)' }}
            >
              <ChevronRight
                className="w-3 h-3 shrink-0 mt-0.5"
                style={{ color: cfg.color }}
              />
              {b}
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

// ─── Mobile Timeline (vertical, shown on small screens) ───────────────────
function MobileTimeline({
  onSelectNode,
  selectedId,
  runPhase,
  showDAG,
}: {
  onSelectNode: (n: ResumeNode) => void;
  selectedId: string | null;
  runPhase: number;
  showDAG: boolean;
}) {
  // DAG view — compact horizontal scrollable pipeline overview
  if (showDAG) {
    return (
      <div className="overflow-x-auto pb-4 -mx-2 px-2">
        <div className="flex items-start gap-3 min-w-max">
          {LAYER_ORDER.map((layer, li) => {
            const cfg       = layerConfig[layer];
            const nodes     = nodesByLayer[layer];
            const isRunning = runPhase === li;
            const isDone    = runPhase > li && runPhase <= LAYER_ORDER.length;
            return (
              <div key={layer} className="flex flex-col gap-2 w-[130px]">
                {/* Layer header */}
                <div
                  className="text-center py-1 rounded-lg text-[8px] font-mono uppercase tracking-widest relative overflow-hidden"
                  style={{
                    color:      isRunning ? '#000' : cfg.color,
                    background: isRunning ? cfg.color : cfg.bg,
                    border:     `1px solid ${isRunning || isDone ? cfg.color : cfg.border}`,
                    boxShadow:  isRunning ? `0 0 14px ${cfg.glow}` : isDone ? `0 0 6px ${cfg.glow}` : 'none',
                    transition: 'all 0.35s ease',
                  }}
                >
                  {isRunning && (
                    <motion.div
                      className="absolute inset-0 opacity-40"
                      style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 0.7, ease: 'easeInOut', repeat: Infinity }}
                    />
                  )}
                  {isDone ? '✓ ' : ''}{cfg.label}
                </div>
                {/* Mini node cards */}
                {nodes.map(node => (
                  <motion.div
                    key={node.id}
                    onClick={() => onSelectNode(node)}
                    animate={{
                      opacity: isRunning ? 1 : (runPhase > li && runPhase !== -1) ? 0.7 : runPhase !== -1 && runPhase < li ? 0.25 : 1,
                      scale:   isRunning ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="relative cursor-pointer rounded-xl p-2.5"
                    style={{
                      background:  selectedId === node.id ? cfg.bg : 'var(--glass-bg)',
                      border:      `1px solid ${selectedId === node.id ? cfg.border : 'var(--borderSubtle)'}`,
                      boxShadow:   selectedId === node.id ? `0 0 10px ${cfg.glow}` : isRunning ? `0 0 6px ${cfg.glow}` : 'none',
                    }}
                  >
                    <div
                      className="absolute -top-1 -left-1 w-2 h-2 rounded-full"
                      style={{ background: cfg.color, opacity: isRunning || isDone ? 1 : 0.5 }}
                    />
                    <div className="text-sm mb-1">{node.icon}</div>
                    <div className="text-[10px] font-mono font-semibold leading-tight" style={{ color: isRunning ? cfg.color : 'var(--textPrimary)' }}>
                      {node.title}
                    </div>
                    <div className="text-[8px] font-mono mt-0.5" style={{ color: 'var(--textSecondary)' }}>
                      {node.meta || node.subtitle}
                    </div>
                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>
        <p className="text-[9px] font-mono mt-3 text-center" style={{ color: 'var(--textTertiary)' }}>
          ← scroll to see full pipeline · tap any node to inspect →
        </p>
      </div>
    );
  }

  // Timeline view (default)
  return (
    <div className="flex flex-col gap-1 py-2">
      {LAYER_ORDER.map((layer, layerIdx) => {
        const cfg       = layerConfig[layer];
        const nodes     = nodesByLayer[layer];
        const isRunning = runPhase === layerIdx;
        const isDone    = runPhase > layerIdx && runPhase <= LAYER_ORDER.length;
        return (
          <div key={layer}>
            {/* Layer label — animates during dbt run */}
            <motion.div
              className="text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-lg mb-2 inline-block relative overflow-hidden"
              animate={{
                color:      isRunning ? '#000' : cfg.color,
                scale:      isRunning ? 1.04 : 1,
              }}
              style={{
                background: isRunning ? cfg.color : cfg.bg,
                border:     `1px solid ${isRunning || isDone ? cfg.color : cfg.border}`,
                boxShadow:  isRunning ? `0 0 16px ${cfg.glow}` : isDone ? `0 0 6px ${cfg.glow}` : 'none',
                transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
              }}
            >
              {isRunning && (
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 0.7, ease: 'easeInOut', repeat: Infinity }}
                />
              )}
              {isDone ? '✓ ' : ''}{cfg.label}
            </motion.div>

            <div
              className="flex flex-col gap-2 ml-2 pl-4 border-l-2 mb-6"
              style={{
                borderColor: isRunning ? cfg.color : isDone ? cfg.dimColor : cfg.border,
                transition: 'border-color 0.35s ease',
              }}
            >
              {nodes.map((node, nodeIdx) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{
                    opacity: runPhase !== -1 && runPhase < layerIdx ? 0.25 : 1,
                    x: 0,
                    scale: isRunning ? 1.01 : 1,
                  }}
                  transition={{ delay: layerIdx * 0.12 + nodeIdx * 0.06, duration: 0.3 }}
                  onClick={() => onSelectNode(node)}
                  className="relative cursor-pointer rounded-xl p-3.5"
                  style={{
                    background:  selectedId === node.id ? cfg.bg : 'var(--glass-bg)',
                    border:      `1px solid ${selectedId === node.id ? cfg.border : isRunning ? cfg.border : 'var(--borderSubtle)'}`,
                    boxShadow:   selectedId === node.id ? `0 0 12px ${cfg.glow}` : isRunning ? `0 0 8px ${cfg.glow}` : 'none',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
                    style={{
                      background:  isRunning ? cfg.color : selectedId === node.id ? cfg.color : cfg.color,
                      borderColor: 'var(--background)',
                      boxShadow:   isRunning || selectedId === node.id ? `0 0 8px ${cfg.glow}` : 'none',
                      opacity:     runPhase !== -1 && runPhase < layerIdx ? 0.3 : 1,
                    }}
                  />
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{node.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-mono font-semibold"
                        style={{ color: isRunning ? cfg.color : 'var(--textPrimary)' }}
                      >
                        {node.title}
                      </div>
                      <div className="text-[10px] font-mono" style={{ color: 'var(--textSecondary)' }}>
                        {node.subtitle}
                      </div>
                    </div>
                    {node.tag && (
                      <span
                        className="text-[8px] font-mono px-1.5 py-0.5 rounded-full shrink-0"
                        style={{
                          color:      tagColors[node.tagColor || 'skills'].color,
                          background: tagColors[node.tagColor || 'skills'].bg,
                        }}
                      >
                        {node.tag}
                      </span>
                    )}
                  </div>
                  {node.meta && (
                    <div className="text-[9px] font-mono mt-1 ml-8" style={{ color: cfg.color, opacity: 0.7 }}>
                      {node.meta}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Run Log ──────────────────────────────────────────────────────────────
function RunLog({ visible }: { visible: boolean }) {
  const lines = LAYER_ORDER.flatMap((layer, li) =>
    nodesByLayer[layer].map((n, ni) => ({
      delay: (li * 4 + ni) * 90,
      idx:   li * 10 + ni + 1,
      id:    n.id,
      title: n.title,
      color: layerConfig[layer].color,
      ms:    (Math.random() * 1.8 + 0.2).toFixed(2),
    }))
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0,  height: 'auto' }}
          exit={{   opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 rounded-2xl overflow-hidden"
          style={{ background: '#080602', border: '1px solid var(--borderSubtle)' }}
        >
          <div
            className="px-5 py-3 border-b flex items-center gap-2"
            style={{ borderColor: 'var(--borderSubtle)' }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-primaryGlow">
              $ dbt run --select career_dag
            </span>
          </div>
          <div className="p-4 font-mono text-[11px] space-y-1 max-h-52 overflow-y-auto">
            <div className="text-textTertiary mb-2">
              Running with dbt=1.7.0 · {resumeNodes.length} models selected
            </div>
            {lines.map(line => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: line.delay / 1000 }}
                className="flex items-center gap-2 flex-wrap"
              >
                <span className="text-textTertiary w-10 text-right shrink-0">
                  [{String(line.idx).padStart(2, '0')}/{resumeNodes.length}]
                </span>
                <span className="text-primaryGlow shrink-0">START</span>
                <span className="text-textSecondary shrink-0">sql table model</span>
                <span style={{ color: line.color }}>{line.id}</span>
                <motion.span
                  className="ml-auto text-statusSuccess shrink-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (line.delay + 200) / 1000 }}
                >
                  [OK in {line.ms}s]
                </motion.span>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (lines.length * 90 + 400) / 1000 }}
              className="pt-3 mt-2 border-t"
              style={{ borderColor: 'var(--borderSubtle)', color: 'var(--statusSuccess)' }}
            >
              ✓ Completed. {resumeNodes.length} models · 0 errors · 0 warnings
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function ResumePage() {
  const [hoverId,    setHoverId]    = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rects,      setRects]      = useState<Record<string, Rect>>({});
  const [runAnim,    setRunAnim]    = useState(false);
  // runPhase: which layer index is currently "executing" (-1 = idle, 5 = done)
  const [runPhase,   setRunPhase]   = useState(-1);
  const [showDAG,    setShowDAG]    = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const drawerRef    = useRef<HTMLDivElement>(null);
  const nodeElRefs   = useRef<Record<string, HTMLDivElement | null>>({});
  const adj          = useMemo(() => buildAdj(), []);

  const activeId = hoverId || selectedId;
  const lineage  = useMemo(
    () => activeId ? getLineage(activeId, adj) : new Set<string>(),
    [activeId, adj]
  );

  const measure = useCallback(() => {
    const cont = containerRef.current;
    if (!cont) return;
    const cr = cont.getBoundingClientRect();
    const next: Record<string, Rect> = {};
    Object.entries(nodeElRefs.current).forEach(([id, el]) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      next[id] = { x: r.left - cr.left, y: r.top - cr.top, w: r.width, h: r.height };
    });
    setRects(next);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [measure]);

  // ── Auto-scroll to detail drawer whenever a node is selected ──────────
  useEffect(() => {
    if (!selectedId || !drawerRef.current) return;
    // Small delay so the drawer has time to mount and animate in
    const t = setTimeout(() => {
      drawerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
    return () => clearTimeout(t);
  }, [selectedId]);

  // ── dbt run simulation ────────────────────────────────────────────────
  // Sequentially lights up each layer column with a 600ms dwell per layer
  const handleDbtRun = useCallback(() => {
    if (runAnim) return;
    setRunAnim(true);
    setRunPhase(0);
    const DWELL = 620; // ms per layer
    LAYER_ORDER.forEach((_, i) => {
      setTimeout(() => setRunPhase(i), i * DWELL);
    });
    const total = LAYER_ORDER.length * DWELL + 800;
    setTimeout(() => {
      setRunPhase(LAYER_ORDER.length); // "done" phase
      setTimeout(() => {
        setRunAnim(false);
        setRunPhase(-1);
      }, 1200);
    }, total - 800);
  }, [runAnim]);

  const selectedNode = resumeNodes.find(n => n.id === selectedId);

  // Column entrance stagger
  const colDelay = (li: number) => li * 0.1;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20">

      {/* ── Header ── */}
      <div className="text-center mb-10 space-y-4">
        <div
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full"
          style={{
            color:      'var(--primaryGlow)',
            background: 'rgba(217,119,6,0.08)',
            border:     '1px solid rgba(217,119,6,0.22)',
          }}
        >
          <GitBranch className="w-3 h-3" />
          career_dag.yml · {resumeNodes.length} models · {resumeEdges.length} edges
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Resume as a{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">
            Data Pipeline
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-sm md:text-base" style={{ color: 'var(--textSecondary)' }}>
          Every career node is a dbt model. Hover to trace lineage — click any node to inspect it.
        </p>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3">
          {LAYER_ORDER.map(layer => {
            const c = layerConfig[layer];
            return (
              <div key={layer} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--textSecondary)' }}>
                  {c.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile toggle — Timeline ↔ DAG view */}
          <button
            onClick={() => setShowDAG(p => !p)}
            className="flex md:hidden items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-lg transition-all"
            style={{
              color:      showDAG ? 'var(--primaryGlow)' : 'var(--textSecondary)',
              background: showDAG ? 'rgba(217,119,6,0.10)' : 'var(--surface)',
              border:     `1px solid ${showDAG ? 'rgba(217,119,6,0.35)' : 'var(--borderDefault)'}`,
            }}
          >
            <LayoutList className="w-3.5 h-3.5" />
            {showDAG ? 'Timeline' : 'DAG view'}
          </button>

          <button
            onClick={handleDbtRun}
            disabled={runAnim}
            className="flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-lg transition-all disabled:opacity-50"
            style={{
              color:      'var(--primaryGlow)',
              background: 'rgba(217,119,6,0.10)',
              border:     '1px solid rgba(217,119,6,0.30)',
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            {runAnim ? 'Running...' : 'dbt run'}
          </button>

          <a
            href={links.resume}
            download
            className="flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-lg transition-all"
            style={{
              color:      'var(--textSecondary)',
              background: 'var(--surface)',
              border:     '1px solid var(--borderDefault)',
            }}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </a>
        </div>
      </div>

      {/* ── DAG Canvas (desktop) ── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface-subtle)',
          border:     '1px solid var(--borderSubtle)',
        }}
      >
        {/* Terminal title bar */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: 'var(--borderSubtle)', background: 'var(--surface-elevated)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest ml-1" style={{ color: 'var(--textTertiary)' }}>
              vishal_prajapati.yml · career_dag
            </span>
          </div>
          <AnimatePresence>
            {activeId && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{   opacity: 0 }}
                className="text-[10px] font-mono"
                style={{ color: 'var(--primaryGlow)' }}
              >
                lineage: {lineage.size} nodes connected
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile — timeline or DAG view */}
        <div className="block md:hidden p-5">
          <MobileTimeline
            onSelectNode={node => setSelectedId(prev => prev === node.id ? null : node.id)}
            selectedId={selectedId}
            runPhase={runPhase}
            showDAG={showDAG}
          />
        </div>

        {/* Desktop DAG */}
        <div className="hidden md:block p-6 lg:p-8">
          <div ref={containerRef} className="relative">

            {/* SVG edges — behind nodes */}
            <Edges rects={rects} active={activeId} lineage={lineage} />

            {/* 5-column grid */}
            <div
              className="grid relative"
              style={{
                gridTemplateColumns: `repeat(${LAYER_ORDER.length}, 1fr)`,
                gap: '24px',
                zIndex: 2,
              }}
            >
              {LAYER_ORDER.map((layer, li) => {
                const cfg   = layerConfig[layer];
                const nodes = nodesByLayer[layer];
                // isRunning: this column is currently being "executed"
                const isRunning = runPhase === li;
                // isDone: this column already finished executing
                const isDone    = runPhase > li && runPhase <= LAYER_ORDER.length;

                return (
                  <div key={layer} className="flex flex-col gap-3">
                    {/* Column header */}
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: colDelay(li), duration: 0.35 }}
                      className="text-center py-1.5 rounded-xl text-[9px] font-mono uppercase tracking-widest mb-1 relative overflow-hidden"
                      style={{
                        color:      isRunning ? '#000' : isDone ? cfg.color : cfg.color,
                        background: isRunning ? cfg.color : cfg.bg,
                        border:     `1px solid ${isRunning || isDone ? cfg.color : cfg.border}`,
                        boxShadow:  isRunning
                          ? `0 0 20px ${cfg.glow}, 0 0 40px ${cfg.glow}`
                          : isDone
                          ? `0 0 8px ${cfg.glow}`
                          : 'none',
                        transition: 'all 0.35s ease',
                      }}
                    >
                      {/* Sweeping shimmer during active run */}
                      {isRunning && (
                        <motion.div
                          className="absolute inset-0 opacity-40"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                          }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 0.7, ease: 'easeInOut', repeat: Infinity }}
                        />
                      )}
                      {isDone ? '✓ ' : ''}{cfg.label}
                    </motion.div>

                    {/* Nodes */}
                    {nodes.map((node, ni) => {
                      // During run: dim nodes not yet reached, pulse nodes in current layer
                      const nodeRunDimmed = runAnim && runPhase < li && runPhase !== -1;
                      const nodeRunActive = runAnim && runPhase === li;
                      return (
                        <motion.div
                          key={node.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{
                            opacity: nodeRunDimmed ? 0.25 : 1,
                            y: 0,
                            scale: nodeRunActive ? 1.02 : 1,
                          }}
                          transition={{ delay: colDelay(li) + ni * 0.07 + 0.1, duration: 0.35 }}
                        >
                          <NodeCard
                            node={node}
                            isActive={hoverId === node.id}
                            inLineage={activeId ? lineage.has(node.id) : false}
                            isDimmed={!!activeId && !lineage.has(node.id)}
                            isSelected={selectedId === node.id}
                            onEnter={() => { setHoverId(node.id); measure(); }}
                            onLeave={() => setHoverId(null)}
                            onClick={() => setSelectedId(p => p === node.id ? null : node.id)}
                            setRef={el => {
                              nodeElRefs.current[node.id] = el;
                              if (el) measure();
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between mt-6 pt-4 border-t"
            style={{ borderColor: 'var(--borderSubtle)' }}
          >
            <span className="text-[10px] font-mono" style={{ color: 'var(--textTertiary)' }}>
              hover to trace · click to inspect
            </span>
            <span className="text-[10px] font-mono" style={{ color: 'var(--textTertiary)' }}>
              {resumeNodes.length} models · {resumeEdges.length} edges · 0 errors
            </span>
          </div>
        </div>
      </div>

      {/* ── Detail drawer (below canvas) ── */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            ref={drawerRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22 }}
            className="mt-4 max-w-sm"
          >
            <DetailDrawer
              node={selectedNode}
              onClose={() => setSelectedId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── dbt run log ── */}
      <RunLog visible={runAnim} />
    </div>
  );
}