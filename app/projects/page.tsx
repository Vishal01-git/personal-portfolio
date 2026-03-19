"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PipelineNode } from '@/components/ui/PipelineNode';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';
import {
  Github, ExternalLink, Database, Server, Zap, Settings,
  Terminal, Activity, FileText, LayoutDashboard, GitBranch, ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { projects, type LineageLayer } from '@/data/projects';

// ── Topology icon map ─────────────────────────────────────────────────────
const TOPOLOGY_ICONS: Record<string, React.ReactNode> = {
  'Terraform & CI/CD':   <Settings className="w-6 h-6" />,
  'Python/Docker':       <Terminal className="w-6 h-6" />,
  'Airflow':             <Zap className="w-6 h-6" />,
  'dbt + Athena':        <Database className="w-6 h-6" />,
  'Streamlit':           <LayoutDashboard className="w-6 h-6" />,
  'SQL Server & Athena': <Database className="w-6 h-6" />,
  'Python Validator':    <Activity className="w-6 h-6" />,
  'Report Generator':    <FileText className="w-6 h-6" />,
  'Streamlit UI':        <LayoutDashboard className="w-6 h-6" />,
};

// ── FIX: map 'none' → 'primary' so every node gets a glow color ───────────
// Nodes with glowColor:'none' were rendering flat with no border glow.
// We only use 'none' as a fallback input; the actual rendered color cycles
// through primary/secondary/accent so every node always glows.
const GLOW_CYCLE: ('primary' | 'secondary' | 'accent')[] = ['primary', 'secondary', 'accent'];

function resolvedGlow(
  raw: 'primary' | 'secondary' | 'accent' | 'none',
  index: number
): 'primary' | 'secondary' | 'accent' {
  if (raw !== 'none') return raw;
  return GLOW_CYCLE[index % GLOW_CYCLE.length];
}

// ── Lineage layer config ───────────────────────────────────────────────────
const LAYER_META: Record<LineageLayer, {
  label: string; color: string; bg: string; border: string; dot: string;
  // light-mode variants for readable text
  colorLight: string; bgLight: string; borderLight: string;
}> = {
  source: {
    label: 'Source',
    color: '#A89880', bg: 'rgba(168,152,128,0.08)', border: 'rgba(168,152,128,0.25)', dot: '#A89880',
    colorLight: '#7A5C38', bgLight: 'rgba(140,100,60,0.12)', borderLight: 'rgba(140,100,60,0.35)',
  },
  staging: {
    label: 'Staging',
    color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.30)', dot: '#F59E0B',
    colorLight: '#B45309', bgLight: 'rgba(217,119,6,0.12)', borderLight: 'rgba(217,119,6,0.40)',
  },
  intermediate: {
    label: 'Intermediate',
    color: '#EA580C', bg: 'rgba(234,88,12,0.08)', border: 'rgba(234,88,12,0.30)', dot: '#EA580C',
    colorLight: '#9A3412', bgLight: 'rgba(194,65,12,0.12)', borderLight: 'rgba(194,65,12,0.40)',
  },
  mart: {
    label: 'Mart',
    color: '#FDE68A', bg: 'rgba(253,226,138,0.08)', border: 'rgba(253,226,138,0.30)', dot: '#FDE68A',
    colorLight: '#92400E', bgLight: 'rgba(146,64,14,0.10)', borderLight: 'rgba(146,64,14,0.35)',
  },
  output: {
    label: 'Output',
    color: '#6EAF6E', bg: 'rgba(110,175,110,0.10)', border: 'rgba(110,175,110,0.30)', dot: '#6EAF6E',
    colorLight: '#166534', bgLight: 'rgba(22,101,52,0.10)', borderLight: 'rgba(22,101,52,0.35)',
  },
};

const LAYERS: LineageLayer[] = ['source', 'staging', 'intermediate', 'mart', 'output'];

// ── Helper: pick dark vs light values based on data-theme ─────────────────
function useLayerColors(layer: LineageLayer) {
  // We read data-theme at render time via a CSS class trick — simplest approach
  // is to provide both and let CSS handle it via inline style vars.
  // Instead, we just return both and apply conditionally via a small hook.
  const [isLight, setIsLight] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  const meta = LAYER_META[layer];
  return {
    color:  isLight ? meta.colorLight  : meta.color,
    bg:     isLight ? meta.bgLight     : meta.bg,
    border: isLight ? meta.borderLight : meta.border,
    dot:    isLight ? meta.colorLight  : meta.dot,
  };
}

// ── Topology ──────────────────────────────────────────────────────────────
function TopologyView({ topology }: { topology: typeof projects[0]['topology'] }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 scale-90 md:scale-100 my-6 w-full overflow-x-auto no-scrollbar py-4">
      {topology.map((node, i) => {
        const glow = resolvedGlow(node.glowColor, i);
        return (
          <React.Fragment key={node.label}>
            <PipelineNode
              icon={TOPOLOGY_ICONS[node.label] ?? <Database className="w-6 h-6" />}
              label={node.label}
              glowColor={glow}
            />
            {i < topology.length - 1 && (
              <>
                <DataFlowAnimation
                  length="40px"
                  color={resolvedGlow(topology[i + 1].glowColor, i + 1)}
                  className="hidden md:block"
                />
                <DataFlowAnimation
                  direction="vertical"
                  length="20px"
                  color={resolvedGlow(topology[i + 1].glowColor, i + 1)}
                  className="md:hidden"
                />
              </>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Lineage node card — theme-aware ───────────────────────────────────────
function LineageNodeCard({
  node, isHovered, isConnected, isDimmed, onEnter, onLeave,
}: {
  node: { id: string; label: string; sublabel?: string; layer: LineageLayer };
  isHovered: boolean; isConnected: boolean; isDimmed: boolean;
  onEnter: () => void; onLeave: () => void;
}) {
  const colors = useLayerColors(node.layer);
  return (
    <motion.div
      onMouseEnter={onEnter} onMouseLeave={onLeave} onTouchStart={onEnter}
      animate={{ opacity: isDimmed ? 0.3 : 1, scale: isHovered ? 1.04 : 1 }}
      transition={{ duration: 0.15 }}
      className="rounded-lg px-3 py-2.5 cursor-pointer text-center flex-1 min-w-0"
      style={{
        background:  isHovered ? colors.bg : 'rgba(128,80,20,0.05)',
        border:      `1px solid ${isHovered || isConnected ? colors.border : 'rgba(128,80,20,0.12)'}`,
        boxShadow:   isHovered ? `0 0 12px ${colors.dot}40` : 'none',
      }}
    >
      {/* FIX: use colors.color when hovered, textPrimary CSS var otherwise — always readable */}
      <div
        className="text-[11px] font-mono font-medium leading-tight truncate"
        style={{ color: isHovered ? colors.color : 'var(--textPrimary)' }}
      >
        {node.label}
      </div>
      {node.sublabel && (
        <div className="text-[9px] font-mono mt-0.5 truncate" style={{ color: 'var(--textSecondary)' }}>
          {node.sublabel}
        </div>
      )}
    </motion.div>
  );
}

// ── Desktop lineage ───────────────────────────────────────────────────────
function LineageDAGDesktop({ graph }: { graph: typeof projects[0]['lineage'] }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const nodesByLayer = LAYERS.reduce((acc, layer) => {
    acc[layer] = graph.nodes.filter(n => n.layer === layer);
    return acc;
  }, {} as Record<LineageLayer, typeof graph.nodes>);

  const connectedNodeIds  = new Set<string>();
  const connectedEdgeKeys = new Set<string>();
  if (hoveredNode) {
    connectedNodeIds.add(hoveredNode);
    graph.edges.forEach(e => {
      if (e.from === hoveredNode || e.to === hoveredNode) {
        connectedNodeIds.add(e.from);
        connectedNodeIds.add(e.to);
        connectedEdgeKeys.add(`${e.from}→${e.to}`);
      }
    });
  }

  return (
    <div className="w-full select-none">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mb-4 px-1">
        {LAYERS.map(layer => {
          const meta = LAYER_META[layer];
          return (
            <div key={layer} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: meta.dot }} />
              {/* FIX: textSecondary instead of hardcoded low-opacity */}
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--textSecondary)' }}>
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${LAYERS.length}, 1fr)` }}>
        {LAYERS.map((layer, colIdx) => {
          const meta = LAYER_META[layer];
          return (
            <LayerColumn
              key={layer}
              layer={layer}
              meta={meta}
              colIdx={colIdx}
              nodes={nodesByLayer[layer]}
              hoveredNode={hoveredNode}
              connectedNodeIds={connectedNodeIds}
              connectedEdgeKeys={connectedEdgeKeys}
              onHover={setHoveredNode}
              edges={graph.edges}
            />
          );
        })}
      </div>
      <p className="text-[10px] font-mono mt-4 text-center" style={{ color: 'var(--textTertiary)' }}>
        hover a node to trace lineage
      </p>
    </div>
  );
}

// Extracted to use the layer colors hook per-layer
function LayerColumn({
  layer, meta, colIdx, nodes, hoveredNode, connectedNodeIds, connectedEdgeKeys, onHover, edges,
}: {
  layer: LineageLayer;
  meta: typeof LAYER_META[LineageLayer];
  colIdx: number;
  nodes: typeof projects[0]['lineage']['nodes'];
  hoveredNode: string | null;
  connectedNodeIds: Set<string>;
  connectedEdgeKeys: Set<string>;
  onHover: (id: string | null) => void;
  edges: typeof projects[0]['lineage']['edges'];
}) {
  const colors = useLayerColors(layer);
  return (
    <div className="flex flex-col gap-2 relative">
      {/* Layer header — FIX: uses theme-aware colors */}
      <div
        className="text-center py-1 rounded-md text-[9px] font-mono uppercase tracking-widest mb-1"
        style={{ color: colors.color, background: colors.bg, border: `1px solid ${colors.border}` }}
      >
        {meta.label}
      </div>
      {nodes.map(node => {
        const isHov  = hoveredNode === node.id;
        const isConn = hoveredNode ? connectedNodeIds.has(node.id) : false;
        const isDim  = !!hoveredNode && !connectedNodeIds.has(node.id);
        const outEdges = edges.filter(e => e.from === node.id);
        const highlighted = outEdges.some(e => connectedEdgeKeys.has(`${e.from}→${e.to}`));
        return (
          <div key={node.id} className="relative">
            <LineageNodeCard
              node={node} isHovered={isHov} isConnected={isConn} isDimmed={isDim}
              onEnter={() => onHover(node.id)} onLeave={() => onHover(null)}
            />
            {colIdx < LAYERS.length - 1 && outEdges.length > 0 && (
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full"
                style={{ width: '8px', zIndex: 10 }}
              >
                <div
                  className="w-full h-px"
                  style={{
                    background:  highlighted ? colors.color : 'var(--borderDefault)',
                    boxShadow:   highlighted ? `0 0 4px ${colors.dot}` : 'none',
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Mobile lineage ────────────────────────────────────────────────────────
function LineageDAGMobile({ graph }: { graph: typeof projects[0]['lineage'] }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const nodesByLayer = LAYERS.reduce((acc, layer) => {
    acc[layer] = graph.nodes.filter(n => n.layer === layer);
    return acc;
  }, {} as Record<LineageLayer, typeof graph.nodes>);

  const connectedNodeIds  = new Set<string>();
  const connectedEdgeKeys = new Set<string>();
  if (hoveredNode) {
    connectedNodeIds.add(hoveredNode);
    graph.edges.forEach(e => {
      if (e.from === hoveredNode || e.to === hoveredNode) {
        connectedNodeIds.add(e.from);
        connectedNodeIds.add(e.to);
        connectedEdgeKeys.add(`${e.from}→${e.to}`);
      }
    });
  }

  const activeLayers = LAYERS.filter(l => nodesByLayer[l].length > 0);

  return (
    <div className="w-full select-none">
      {activeLayers.map((layer, layerIdx) => {
        const isLast     = layerIdx === activeLayers.length - 1;
        const hasOutEdge = nodesByLayer[layer].some(n => graph.edges.some(e => e.from === n.id));
        const connHigh   = hoveredNode
          ? nodesByLayer[layer].some(n => graph.edges.some(e => e.from === n.id && connectedEdgeKeys.has(`${e.from}→${e.to}`)))
          : false;
        return (
          <MobileLayerRow
            key={layer}
            layer={layer}
            nodes={nodesByLayer[layer]}
            isLast={isLast}
            hasOutEdge={hasOutEdge}
            connHighlighted={connHigh}
            hoveredNode={hoveredNode}
            connectedNodeIds={connectedNodeIds}
            onHover={setHoveredNode}
          />
        );
      })}
      <p className="text-[10px] font-mono mt-3 text-center" style={{ color: 'var(--textTertiary)' }}>
        tap a node to trace lineage
      </p>
    </div>
  );
}

function MobileLayerRow({
  layer, nodes, isLast, hasOutEdge, connHighlighted, hoveredNode, connectedNodeIds, onHover,
}: {
  layer: LineageLayer;
  nodes: typeof projects[0]['lineage']['nodes'];
  isLast: boolean; hasOutEdge: boolean; connHighlighted: boolean;
  hoveredNode: string | null; connectedNodeIds: Set<string>;
  onHover: (id: string | null) => void;
}) {
  const colors = useLayerColors(layer);
  const meta   = LAYER_META[layer];
  return (
    <div>
      <div className="flex items-stretch gap-2">
        <div
          className="flex items-center justify-center rounded-md px-2 text-[8px] font-mono uppercase tracking-widest shrink-0"
          style={{
            color: colors.color, background: colors.bg, border: `1px solid ${colors.border}`,
            writingMode: 'vertical-lr', minWidth: '28px',
          }}
        >
          {meta.label}
        </div>
        <div className="flex flex-row flex-wrap gap-2 flex-1 py-1">
          {nodes.map(node => (
            <LineageNodeCard
              key={node.id} node={node}
              isHovered={hoveredNode === node.id}
              isConnected={hoveredNode ? connectedNodeIds.has(node.id) : false}
              isDimmed={!!hoveredNode && !connectedNodeIds.has(node.id)}
              onEnter={() => onHover(node.id)} onLeave={() => onHover(null)}
            />
          ))}
        </div>
      </div>
      {!isLast && hasOutEdge && (
        <div className="flex justify-center my-1 ml-9">
          <div className="flex flex-col items-center">
            <div className="w-px h-4" style={{ background: connHighlighted ? colors.color : 'var(--borderDefault)' }} />
            <ChevronDown className="w-3 h-3" style={{ color: connHighlighted ? colors.color : 'var(--borderDefault)' }} />
          </div>
        </div>
      )}
    </div>
  );
}

function LineageDAG({ graph }: { graph: typeof projects[0]['lineage'] }) {
  return (
    <>
      <div className="hidden lg:block w-full"><LineageDAGDesktop graph={graph} /></div>
      <div className="block lg:hidden w-full"><LineageDAGMobile graph={graph} /></div>
    </>
  );
}

type ViewMode = 'topology' | 'lineage';

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div
      className="flex items-center gap-1 rounded-lg p-1"
      style={{ background: 'var(--surface-elevated)', border: '1px solid var(--borderSubtle)' }}
    >
      {(['topology', 'lineage'] as ViewMode[]).map(m => (
        <button
          key={m} onClick={() => onChange(m)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-200 ${
            m === mode
              ? 'bg-primaryGlow/15 text-primaryGlow border border-primaryGlow/25'
              : 'hover:text-textPrimary'
          }`}
          style={{ color: m === mode ? undefined : 'var(--textSecondary)' }}
        >
          {m === 'topology' ? <Server className="w-3 h-3" /> : <GitBranch className="w-3 h-3" />}
          {m === 'topology' ? 'Pipeline' : 'Lineage'}
        </button>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [views, setViews] = useState<Record<number, ViewMode>>(
    Object.fromEntries(projects.map(p => [p.id, 'topology' as ViewMode]))
  );
  const setView = (id: number, mode: ViewMode) => setViews(prev => ({ ...prev, [id]: mode }));

  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Featured{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">
            Projects
          </span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          End-to-end data engineering builds highlighting my approach to architecture, performance optimization, and automation.
        </p>
      </div>

      <div className="flex flex-col gap-12 md:gap-16 w-full">
        {projects.map(project => (
          <GlassCard key={project.id} className="overflow-hidden flex flex-col p-0 w-full">
            <div className="w-full border-b" style={{ background: 'var(--surface)', borderColor: 'var(--borderSubtle)' }}>
              <div className="flex items-center justify-between px-4 md:px-8 pt-4 pb-2">
                <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest opacity-60"
                  style={{ color: 'var(--textSecondary)' }}>
                  {views[project.id] === 'topology' ? 'Pipeline Topology' : 'Data Lineage DAG'}
                </span>
                <ViewToggle mode={views[project.id]} onChange={m => setView(project.id, m)} />
              </div>
              <div className="px-4 md:px-8 pb-6 min-h-[180px]">
                <AnimatePresence mode="wait">
                  {views[project.id] === 'topology' ? (
                    <motion.div key="topology"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
                      className="w-full flex items-center justify-center"
                    >
                      <TopologyView topology={project.topology} />
                    </motion.div>
                  ) : (
                    <motion.div key="lineage"
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                      className="w-full pt-2"
                    >
                      <LineageDAG graph={project.lineage} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 w-full">
              <div className="flex-1 space-y-4">
                <h2 className="text-xl md:text-2xl font-bold font-heading">{project.title}</h2>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tech.map(t => <Badge key={t} variant="outline">{t}</Badge>)}
                </div>
              </div>
              <div className="md:w-48 flex flex-row md:flex-col gap-4 justify-end md:justify-start">
                {project.github && (
                  <Link href={project.github} target="_blank" className="w-full">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <Github className="w-4 h-4" /> Source
                    </Button>
                  </Link>
                )}
                {project.demo && (
                  <Link href={project.demo} target="_blank" className="w-full">
                    <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}