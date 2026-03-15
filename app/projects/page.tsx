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

// ── Topology icon map — keyed by label ────────────────────────────────────
// Add new entries here when you use a new label in data/projects.ts
const TOPOLOGY_ICONS: Record<string, React.ReactNode> = {
  'Terraform & CI/CD':  <Settings className="w-6 h-6" />,
  'Python/Docker':      <Terminal className="w-6 h-6" />,
  'Airflow':            <Zap className="w-6 h-6" />,
  'dbt + Athena':       <Database className="w-6 h-6" />,
  'Streamlit':          <LayoutDashboard className="w-6 h-6" />,
  'SQL Server & Athena':<Database className="w-6 h-6" />,
  'Python Validator':   <Activity className="w-6 h-6" />,
  'Report Generator':   <FileText className="w-6 h-6" />,
  'Streamlit UI':       <LayoutDashboard className="w-6 h-6" />,
};

// ─── Lineage layer config ──────────────────────────────────────────────────
const LAYER_META: Record<LineageLayer, { label: string; color: string; bg: string; border: string; dot: string }> = {
  source:       { label: 'Source',       color: '#A89880', bg: 'rgba(168,152,128,0.08)', border: 'rgba(168,152,128,0.25)', dot: '#A89880' },
  staging:      { label: 'Staging',      color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.30)',  dot: '#F59E0B' },
  intermediate: { label: 'Intermediate', color: '#EA580C', bg: 'rgba(234,88,12,0.08)',   border: 'rgba(234,88,12,0.30)',   dot: '#EA580C' },
  mart:         { label: 'Mart',         color: '#FDE68A', bg: 'rgba(253,226,138,0.08)', border: 'rgba(253,226,138,0.30)', dot: '#FDE68A' },
  output:       { label: 'Output',       color: '#6EAF6E', bg: 'rgba(110,175,110,0.10)', border: 'rgba(110,175,110,0.30)', dot: '#6EAF6E' },
};

const LAYERS: LineageLayer[] = ['source', 'staging', 'intermediate', 'mart', 'output'];

// ─── Topology (generated from data) ───────────────────────────────────────
function TopologyView({ topology }: { topology: typeof projects[0]['topology'] }) {
  const colors: ('primary' | 'secondary' | 'accent' | 'none')[] = topology.map(n => n.glowColor);
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 scale-90 md:scale-100 my-6 w-full overflow-x-auto no-scrollbar py-4">
      {topology.map((node, i) => (
        <React.Fragment key={node.label}>
          <PipelineNode
            icon={TOPOLOGY_ICONS[node.label] ?? <Database className="w-6 h-6" />}
            label={node.label}
            glowColor={colors[i]}
          />
          {i < topology.length - 1 && (
            <>
              <DataFlowAnimation length="40px" color={colors[i + 1] === 'none' ? 'primary' : colors[i + 1]} className="hidden md:block" />
              <DataFlowAnimation direction="vertical" length="20px" color={colors[i + 1] === 'none' ? 'primary' : colors[i + 1]} className="md:hidden" />
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Lineage node card ─────────────────────────────────────────────────────
function LineageNodeCard({ node, isHovered, isConnected, isDimmed, onEnter, onLeave }: { node: { id: string; label: string; sublabel?: string; layer: LineageLayer }; isHovered: boolean; isConnected: boolean; isDimmed: boolean; onEnter: () => void; onLeave: () => void }) {
  const meta = LAYER_META[node.layer];
  return (
    <motion.div onMouseEnter={onEnter} onMouseLeave={onLeave} onTouchStart={onEnter}
      animate={{ opacity: isDimmed ? 0.3 : 1, scale: isHovered ? 1.04 : 1 }} transition={{ duration: 0.15 }}
      className="rounded-lg px-3 py-2.5 cursor-pointer text-center flex-1 min-w-0"
      style={{ background: isHovered ? meta.bg : 'rgba(255,255,255,0.03)', border: `1px solid ${isHovered || isConnected ? meta.border : 'rgba(255,255,255,0.06)'}`, boxShadow: isHovered ? `0 0 12px ${meta.dot}30` : 'none' }}
    >
      <div className="text-[11px] font-mono font-medium leading-tight truncate" style={{ color: isHovered ? meta.color : '#F5F0E8CC' }}>{node.label}</div>
      {node.sublabel && <div className="text-[9px] font-mono text-textSecondary/60 mt-0.5 truncate">{node.sublabel}</div>}
    </motion.div>
  );
}

// ─── Desktop lineage ───────────────────────────────────────────────────────
function LineageDAGDesktop({ graph }: { graph: typeof projects[0]['lineage'] }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const nodesByLayer = LAYERS.reduce((acc, layer) => { acc[layer] = graph.nodes.filter(n => n.layer === layer); return acc; }, {} as Record<LineageLayer, typeof graph.nodes>);
  const connectedNodeIds = new Set<string>();
  const connectedEdgeKeys = new Set<string>();
  if (hoveredNode) {
    connectedNodeIds.add(hoveredNode);
    graph.edges.forEach(e => { if (e.from === hoveredNode || e.to === hoveredNode) { connectedNodeIds.add(e.from); connectedNodeIds.add(e.to); connectedEdgeKeys.add(`${e.from}→${e.to}`); } });
  }
  return (
    <div className="w-full select-none">
      <div className="flex flex-wrap items-center gap-3 mb-4 px-1">
        {LAYERS.map(layer => { const meta = LAYER_META[layer]; return (
          <div key={layer} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: meta.dot }} />
            <span className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">{meta.label}</span>
          </div>
        ); })}
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${LAYERS.length}, 1fr)` }}>
        {LAYERS.map((layer, colIdx) => {
          const meta = LAYER_META[layer];
          return (
            <div key={layer} className="flex flex-col gap-2 relative">
              <div className="text-center py-1 rounded-md text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}>{meta.label}</div>
              {nodesByLayer[layer].map(node => {
                const isHov  = hoveredNode === node.id;
                const isConn = hoveredNode ? connectedNodeIds.has(node.id) : false;
                const isDim  = !!hoveredNode && !connectedNodeIds.has(node.id);
                return (
                  <div key={node.id} className="relative">
                    <LineageNodeCard node={node} isHovered={isHov} isConnected={isConn} isDimmed={isDim} onEnter={() => setHoveredNode(node.id)} onLeave={() => setHoveredNode(null)} />
                    {colIdx < LAYERS.length - 1 && (() => {
                      const outEdges = graph.edges.filter(e => e.from === node.id);
                      if (!outEdges.length) return null;
                      const highlighted = outEdges.some(e => connectedEdgeKeys.has(`${e.from}→${e.to}`));
                      return <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full" style={{ width: '8px', zIndex: 10 }}><div className="w-full h-px" style={{ background: highlighted ? meta.color : 'rgba(255,255,255,0.15)', boxShadow: highlighted ? `0 0 4px ${meta.dot}` : 'none' }} /></div>;
                    })()}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <p className="text-[10px] font-mono text-textTertiary mt-4 text-center">hover a node to trace lineage</p>
    </div>
  );
}

// ─── Mobile lineage ────────────────────────────────────────────────────────
function LineageDAGMobile({ graph }: { graph: typeof projects[0]['lineage'] }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const nodesByLayer = LAYERS.reduce((acc, layer) => { acc[layer] = graph.nodes.filter(n => n.layer === layer); return acc; }, {} as Record<LineageLayer, typeof graph.nodes>);
  const connectedNodeIds = new Set<string>();
  const connectedEdgeKeys = new Set<string>();
  if (hoveredNode) {
    connectedNodeIds.add(hoveredNode);
    graph.edges.forEach(e => { if (e.from === hoveredNode || e.to === hoveredNode) { connectedNodeIds.add(e.from); connectedNodeIds.add(e.to); connectedEdgeKeys.add(`${e.from}→${e.to}`); } });
  }
  const activeLayers = LAYERS.filter(l => nodesByLayer[l].length > 0);
  return (
    <div className="w-full select-none">
      {activeLayers.map((layer, layerIdx) => {
        const meta = LAYER_META[layer];
        const isLast = layerIdx === activeLayers.length - 1;
        const hasOutEdge = nodesByLayer[layer].some(n => graph.edges.some(e => e.from === n.id));
        const connHighlighted = hoveredNode ? nodesByLayer[layer].some(n => graph.edges.some(e => e.from === n.id && connectedEdgeKeys.has(`${e.from}→${e.to}`))) : false;
        return (
          <div key={layer}>
            <div className="flex items-stretch gap-2">
              <div className="flex items-center justify-center rounded-md px-2 text-[8px] font-mono uppercase tracking-widest shrink-0" style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}`, writingMode: 'vertical-lr', minWidth: '28px' }}>{meta.label}</div>
              <div className="flex flex-row flex-wrap gap-2 flex-1 py-1">
                {nodesByLayer[layer].map(node => (
                  <LineageNodeCard key={node.id} node={node} isHovered={hoveredNode === node.id} isConnected={hoveredNode ? connectedNodeIds.has(node.id) : false} isDimmed={!!hoveredNode && !connectedNodeIds.has(node.id)} onEnter={() => setHoveredNode(node.id)} onLeave={() => setHoveredNode(null)} />
                ))}
              </div>
            </div>
            {!isLast && hasOutEdge && (
              <div className="flex justify-center my-1 ml-9">
                <div className="flex flex-col items-center gap-0">
                  <div className="w-px h-4" style={{ background: connHighlighted ? meta.color : 'rgba(255,255,255,0.15)' }} />
                  <ChevronDown className="w-3 h-3" style={{ color: connHighlighted ? meta.color : 'rgba(255,255,255,0.15)' }} />
                </div>
              </div>
            )}
          </div>
        );
      })}
      <p className="text-[10px] font-mono text-textTertiary mt-3 text-center">tap a node to trace lineage</p>
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
    <div className="flex items-center gap-1 bg-black/30 border border-white/8 rounded-lg p-1">
      {(['topology', 'lineage'] as ViewMode[]).map(m => (
        <button key={m} onClick={() => onChange(m)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-200 ${m === mode ? 'bg-primaryGlow/15 text-primaryGlow border border-primaryGlow/25' : 'text-textSecondary hover:text-white'}`}
        >
          {m === 'topology' ? <Server className="w-3 h-3" /> : <GitBranch className="w-3 h-3" />}
          {m === 'topology' ? 'Pipeline' : 'Lineage'}
        </button>
      ))}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [views, setViews] = useState<Record<number, ViewMode>>(
    Object.fromEntries(projects.map(p => [p.id, 'topology' as ViewMode]))
  );
  const setView = (id: number, mode: ViewMode) => setViews(prev => ({ ...prev, [id]: mode }));

  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">Deployments</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          Scalable architectures with full data lineage — from raw source to BI output.
        </p>
      </div>

      <div className="flex flex-col gap-12 md:gap-16 w-full">
        {projects.map(project => (
          <GlassCard key={project.id} className="overflow-hidden flex flex-col p-0 w-full">
            <div className="w-full bg-surface/40 border-b border-white/5">
              <div className="flex items-center justify-between px-4 md:px-8 pt-4 pb-2">
                <span className="text-[10px] md:text-xs font-mono text-textSecondary uppercase tracking-widest opacity-60">
                  {views[project.id] === 'topology' ? 'Pipeline Topology' : 'Data Lineage DAG'}
                </span>
                <ViewToggle mode={views[project.id]} onChange={m => setView(project.id, m)} />
              </div>
              <div className="px-4 md:px-8 pb-6 min-h-[180px]">
                <AnimatePresence mode="wait">
                  {views[project.id] === 'topology' ? (
                    <motion.div key="topology" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="w-full flex items-center justify-center">
                      <TopologyView topology={project.topology} />
                    </motion.div>
                  ) : (
                    <motion.div key="lineage" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="w-full pt-2">
                      <LineageDAG graph={project.lineage} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 w-full">
              <div className="flex-1 space-y-4">
                <h2 className="text-xl md:text-2xl font-bold font-heading">{project.title}</h2>
                <p className="text-sm md:text-base text-textSecondary leading-relaxed">{project.description}</p>
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