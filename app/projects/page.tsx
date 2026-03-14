"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PipelineNode } from '@/components/ui/PipelineNode';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';
import {
  Github, ExternalLink, Database, Server, Zap,
  Settings, Terminal, Activity, FileText, LayoutDashboard,
  GitBranch, ChevronDown, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

// ─── Types ─────────────────────────────────────────────────────────────────
type LineageLayer = 'source' | 'staging' | 'intermediate' | 'mart' | 'output';

interface LineageNode {
  id: string;
  label: string;
  sublabel?: string;
  layer: LineageLayer;
}

interface LineageEdge {
  from: string;
  to: string;
}

interface LineageGraph {
  nodes: LineageNode[];
  edges: LineageEdge[];
}

// ─── Layer visual config ───────────────────────────────────────────────────
const LAYER_META: Record<LineageLayer, {
  label: string; color: string; bg: string; border: string; dot: string;
}> = {
  source:       { label: 'Source',       color: '#A89880', bg: 'rgba(168,152,128,0.08)', border: 'rgba(168,152,128,0.25)', dot: '#A89880' },
  staging:      { label: 'Staging',      color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.30)',  dot: '#F59E0B' },
  intermediate: { label: 'Intermediate', color: '#EA580C', bg: 'rgba(234,88,12,0.08)',   border: 'rgba(234,88,12,0.30)',   dot: '#EA580C' },
  mart:         { label: 'Mart',         color: '#FDE68A', bg: 'rgba(253,226,138,0.08)', border: 'rgba(253,226,138,0.30)', dot: '#FDE68A' },
  output:       { label: 'Output',       color: '#6EAF6E', bg: 'rgba(110,175,110,0.10)', border: 'rgba(110,175,110,0.30)', dot: '#6EAF6E' },
};

const LAYERS: LineageLayer[] = ['source', 'staging', 'intermediate', 'mart', 'output'];

// ─── Single node card ──────────────────────────────────────────────────────
function LineageNodeCard({
  node,
  isHovered,
  isConnected,
  isDimmed,
  onEnter,
  onLeave,
}: {
  node: LineageNode;
  isHovered: boolean;
  isConnected: boolean;
  isDimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const meta = LAYER_META[node.layer];
  return (
    <motion.div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={onEnter}
      animate={{ opacity: isDimmed ? 0.3 : 1, scale: isHovered ? 1.04 : 1 }}
      transition={{ duration: 0.15 }}
      className="rounded-lg px-3 py-2.5 cursor-pointer text-center transition-colors flex-1 min-w-0"
      style={{
        background: isHovered ? meta.bg : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isHovered || isConnected ? meta.border : 'rgba(255,255,255,0.06)'}`,
        boxShadow: isHovered ? `0 0 12px ${meta.dot}30` : 'none',
      }}
    >
      <div
        className="text-[11px] font-mono font-medium leading-tight truncate"
        style={{ color: isHovered ? meta.color : '#F5F0E8CC' }}
      >
        {node.label}
      </div>
      {node.sublabel && (
        <div className="text-[9px] font-mono text-textSecondary/60 mt-0.5 truncate">
          {node.sublabel}
        </div>
      )}
    </motion.div>
  );
}

// ─── DESKTOP DAG (horizontal 5-column grid) ───────────────────────────────
function LineageDAGDesktop({ graph }: { graph: LineageGraph }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodesByLayer = LAYERS.reduce((acc, layer) => {
    acc[layer] = graph.nodes.filter(n => n.layer === layer);
    return acc;
  }, {} as Record<LineageLayer, LineageNode[]>);

  const connectedNodeIds = new Set<string>();
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
              <span className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">{meta.label}</span>
            </div>
          );
        })}
      </div>

      {/* 5-column grid */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${LAYERS.length}, 1fr)` }}>
        {LAYERS.map((layer, colIdx) => {
          const meta = LAYER_META[layer];
          const layerNodes = nodesByLayer[layer];
          return (
            <div key={layer} className="flex flex-col gap-2 relative">
              {/* Column header */}
              <div
                className="text-center py-1 rounded-md text-[9px] font-mono uppercase tracking-widest mb-1"
                style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
              >
                {meta.label}
              </div>

              {/* Nodes */}
              {layerNodes.map(node => {
                const isHov = hoveredNode === node.id;
                const isConn = hoveredNode ? connectedNodeIds.has(node.id) : false;
                const isDim = !!hoveredNode && !connectedNodeIds.has(node.id);

                return (
                  <div key={node.id} className="relative">
                    <LineageNodeCard
                      node={node}
                      isHovered={isHov}
                      isConnected={isConn}
                      isDimmed={isDim}
                      onEnter={() => setHoveredNode(node.id)}
                      onLeave={() => setHoveredNode(null)}
                    />
                    {/* Right-edge connector arrow to next column */}
                    {colIdx < LAYERS.length - 1 && (() => {
                      const outEdges = graph.edges.filter(e => e.from === node.id);
                      if (outEdges.length === 0) return null;
                      const highlighted = outEdges.some(e => connectedEdgeKeys.has(`${e.from}→${e.to}`));
                      return (
                        <div
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full"
                          style={{ width: '8px', zIndex: 10 }}
                        >
                          <div
                            className="w-full h-px"
                            style={{
                              background: highlighted ? meta.color : 'rgba(255,255,255,0.15)',
                              boxShadow: highlighted ? `0 0 4px ${meta.dot}` : 'none',
                            }}
                          />
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] font-mono text-textTertiary mt-4 text-center">
        hover a node to trace lineage
      </p>
    </div>
  );
}

// ─── MOBILE DAG (vertical layer-by-layer flow) ────────────────────────────
function LineageDAGMobile({ graph }: { graph: LineageGraph }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodesByLayer = LAYERS.reduce((acc, layer) => {
    acc[layer] = graph.nodes.filter(n => n.layer === layer);
    return acc;
  }, {} as Record<LineageLayer, LineageNode[]>);

  const connectedNodeIds = new Set<string>();
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

  // Only render layers that have nodes
  const activeLayers = LAYERS.filter(l => nodesByLayer[l].length > 0);

  return (
    <div className="w-full select-none">
      {activeLayers.map((layer, layerIdx) => {
        const meta = LAYER_META[layer];
        const layerNodes = nodesByLayer[layer];
        const isLastLayer = layerIdx === activeLayers.length - 1;

        // Does any node in this layer have an outgoing edge?
        const layerHasOutEdge = layerNodes.some(n =>
          graph.edges.some(e => e.from === n.id)
        );

        // Is this connector highlighted? (any edge from this layer's nodes is active)
        const connectorHighlighted = hoveredNode
          ? layerNodes.some(n => connectedEdgeKeys.has(`${n.id}→${hoveredNode}`) ||
              graph.edges.some(e => e.from === n.id && connectedEdgeKeys.has(`${e.from}→${e.to}`)))
          : false;

        return (
          <div key={layer}>
            {/* Layer row */}
            <div className="flex items-stretch gap-2">
              {/* Layer label pill — left side */}
              <div
                className="flex items-center justify-center rounded-md px-2 text-[8px] font-mono uppercase tracking-widest shrink-0"
                style={{
                  color: meta.color,
                  background: meta.bg,
                  border: `1px solid ${meta.border}`,
                  writingMode: 'vertical-lr',
                  minWidth: '28px',
                }}
              >
                {meta.label}
              </div>

              {/* Nodes — horizontal flex, wrap if needed */}
              <div className="flex flex-row flex-wrap gap-2 flex-1 py-1">
                {layerNodes.map(node => {
                  const isHov = hoveredNode === node.id;
                  const isConn = hoveredNode ? connectedNodeIds.has(node.id) : false;
                  const isDim = !!hoveredNode && !connectedNodeIds.has(node.id);
                  return (
                    <LineageNodeCard
                      key={node.id}
                      node={node}
                      isHovered={isHov}
                      isConnected={isConn}
                      isDimmed={isDim}
                      onEnter={() => setHoveredNode(node.id)}
                      onLeave={() => setHoveredNode(null)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Downward arrow connector between layers */}
            {!isLastLayer && layerHasOutEdge && (
              <div className="flex justify-center my-1 ml-9">
                <div className="flex flex-col items-center gap-0">
                  <div
                    className="w-px h-4"
                    style={{
                      background: connectorHighlighted ? meta.color : 'rgba(255,255,255,0.15)',
                      boxShadow: connectorHighlighted ? `0 0 4px ${meta.dot}` : 'none',
                    }}
                  />
                  <ChevronDown
                    className="w-3 h-3"
                    style={{ color: connectorHighlighted ? meta.color : 'rgba(255,255,255,0.15)' }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <p className="text-[10px] font-mono text-textTertiary mt-3 text-center">
        tap a node to trace lineage
      </p>
    </div>
  );
}

// ─── Responsive wrapper — picks desktop or mobile ──────────────────────────
function LineageDAG({ graph }: { graph: LineageGraph }) {
  return (
    <>
      {/* Desktop: ≥ lg */}
      <div className="hidden lg:block w-full">
        <LineageDAGDesktop graph={graph} />
      </div>
      {/* Mobile / tablet: < lg */}
      <div className="block lg:hidden w-full">
        <LineageDAGMobile graph={graph} />
      </div>
    </>
  );
}

// ─── View toggle ───────────────────────────────────────────────────────────
type ViewMode = 'topology' | 'lineage';

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div className="flex items-center gap-1 bg-black/30 border border-white/8 rounded-lg p-1">
      {(['topology', 'lineage'] as ViewMode[]).map(m => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-200 ${
            mode === m
              ? 'bg-primaryGlow/15 text-primaryGlow border border-primaryGlow/25'
              : 'text-textSecondary hover:text-white'
          }`}
        >
          {m === 'topology' ? <Server className="w-3 h-3" /> : <GitBranch className="w-3 h-3" />}
          {m === 'topology' ? 'Pipeline' : 'Lineage'}
        </button>
      ))}
    </div>
  );
}

// ─── Project data ──────────────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    title: 'Job Market Arbitrage Data Platform',
    description: 'An end-to-end data pipeline that extracts job market data to identify arbitrage opportunities — skills in demand vs. skills in supply by region.',
    tech: ['Terraform', 'GitHub Actions', 'Python', 'Docker', 'Airflow', 'dbt', 'AWS Athena', 'Streamlit'],
    github: '#',
    demo: '#',
    topology: (
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 scale-90 md:scale-100 my-6 w-full overflow-x-auto no-scrollbar py-4">
        <PipelineNode icon={<Settings className="w-6 h-6" />} label="Terraform & CI/CD" glowColor="none" />
        <DataFlowAnimation length="40px" color="primary" className="hidden md:block" />
        <DataFlowAnimation direction="vertical" length="20px" color="primary" className="md:hidden" />
        <PipelineNode icon={<Terminal className="w-6 h-6" />} label="Python/Docker" glowColor="primary" />
        <DataFlowAnimation length="40px" color="secondary" className="hidden md:block" />
        <DataFlowAnimation direction="vertical" length="20px" color="secondary" className="md:hidden" />
        <PipelineNode icon={<Zap className="w-6 h-6" />} label="Airflow" glowColor="secondary" status="processing" />
        <DataFlowAnimation length="40px" color="accent" className="hidden md:block" />
        <DataFlowAnimation direction="vertical" length="20px" color="accent" className="md:hidden" />
        <PipelineNode icon={<Database className="w-6 h-6" />} label="dbt + Athena" glowColor="accent" />
        <DataFlowAnimation length="40px" color="primary" className="hidden md:block" />
        <DataFlowAnimation direction="vertical" length="20px" color="primary" className="md:hidden" />
        <PipelineNode icon={<LayoutDashboard className="w-6 h-6" />} label="Streamlit" glowColor="primary" status="active" />
      </div>
    ),
    lineage: {
      nodes: [
        { id: 'jobs_api',     label: 'Jobs API',         sublabel: 'LinkedIn / Indeed',   layer: 'source'       as LineageLayer },
        { id: 'skills_csv',   label: 'Skills CSV',       sublabel: 'Static seed data',    layer: 'source'       as LineageLayer },
        { id: 'stg_jobs',     label: 'stg_jobs',         sublabel: 'Staging',             layer: 'staging'      as LineageLayer },
        { id: 'stg_skills',   label: 'stg_skills',       sublabel: 'Staging',             layer: 'staging'      as LineageLayer },
        { id: 'int_postings', label: 'int_job_postings', sublabel: 'Deduplicated',        layer: 'intermediate' as LineageLayer },
        { id: 'int_demand',   label: 'int_skill_demand', sublabel: 'Aggregated',          layer: 'intermediate' as LineageLayer },
        { id: 'mrt_arb',      label: 'mrt_arbitrage',   sublabel: 'Mart',                layer: 'mart'         as LineageLayer },
        { id: 'streamlit',    label: 'Streamlit App',    sublabel: 'BI / Dashboard',      layer: 'output'       as LineageLayer },
      ],
      edges: [
        { from: 'jobs_api',     to: 'stg_jobs' },
        { from: 'skills_csv',   to: 'stg_skills' },
        { from: 'stg_jobs',     to: 'int_postings' },
        { from: 'stg_skills',   to: 'int_demand' },
        { from: 'int_postings', to: 'mrt_arb' },
        { from: 'int_demand',   to: 'mrt_arb' },
        { from: 'mrt_arb',      to: 'streamlit' },
      ],
    } as LineageGraph,
  },
  {
    id: 2,
    title: 'Automated Data Validation Accelerator',
    description: 'A custom web application that accelerates data migration testing by automating schema, count, and row-level data checks between legacy SQL Server databases and cloud data lakes.',
    tech: ['Python', 'Streamlit', 'Pandas', 'PyAthena', 'PyODBC'],
    github: '#',
    topology: (
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 scale-90 md:scale-100 my-6 w-full overflow-x-auto no-scrollbar py-4">
        <PipelineNode icon={<Database className="w-6 h-6" />} label="SQL Server & Athena" glowColor="none" />
        <DataFlowAnimation length="40px" color="primary" className="hidden md:block" />
        <DataFlowAnimation direction="vertical" length="20px" color="primary" className="md:hidden" />
        <PipelineNode icon={<Activity className="w-6 h-6" />} label="Python Validator" glowColor="primary" status="processing" />
        <DataFlowAnimation length="40px" color="secondary" className="hidden md:block" />
        <DataFlowAnimation direction="vertical" length="20px" color="secondary" className="md:hidden" />
        <PipelineNode icon={<FileText className="w-6 h-6" />} label="Report Generator" glowColor="secondary" />
        <DataFlowAnimation length="40px" color="accent" className="hidden md:block" />
        <DataFlowAnimation direction="vertical" length="20px" color="accent" className="md:hidden" />
        <PipelineNode icon={<LayoutDashboard className="w-6 h-6" />} label="Streamlit UI" glowColor="accent" status="active" />
      </div>
    ),
    lineage: {
      nodes: [
        { id: 'sqlserver',   label: 'SQL Server',  sublabel: 'Legacy source',       layer: 'source'       as LineageLayer },
        { id: 'athena',      label: 'AWS Athena',  sublabel: 'Cloud target',        layer: 'source'       as LineageLayer },
        { id: 'stg_legacy',  label: 'stg_legacy',  sublabel: 'Schema extracted',    layer: 'staging'      as LineageLayer },
        { id: 'stg_cloud',   label: 'stg_cloud',   sublabel: 'Schema extracted',    layer: 'staging'      as LineageLayer },
        { id: 'int_checks',  label: 'int_checks',  sublabel: 'Row/count/schema',    layer: 'intermediate' as LineageLayer },
        { id: 'mrt_results', label: 'mrt_results', sublabel: 'Validation results',  layer: 'mart'         as LineageLayer },
        { id: 'html_report', label: 'HTML Report', sublabel: 'Export',              layer: 'output'       as LineageLayer },
        { id: 'streamlit2',  label: 'Streamlit UI',sublabel: 'Live dashboard',      layer: 'output'       as LineageLayer },
      ],
      edges: [
        { from: 'sqlserver',   to: 'stg_legacy' },
        { from: 'athena',      to: 'stg_cloud' },
        { from: 'stg_legacy',  to: 'int_checks' },
        { from: 'stg_cloud',   to: 'int_checks' },
        { from: 'int_checks',  to: 'mrt_results' },
        { from: 'mrt_results', to: 'html_report' },
        { from: 'mrt_results', to: 'streamlit2' },
      ],
    } as LineageGraph,
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [views, setViews] = useState<Record<number, ViewMode>>(
    Object.fromEntries(projects.map(p => [p.id, 'topology' as ViewMode]))
  );

  const setView = (id: number, mode: ViewMode) =>
    setViews(prev => ({ ...prev, [id]: mode }));

  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Production{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">
            Deployments
          </span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          Scalable architectures with full data lineage — from raw source to BI output.
        </p>
      </div>

      <div className="flex flex-col gap-12 md:gap-16 w-full">
        {projects.map(project => (
          <GlassCard key={project.id} className="overflow-hidden flex flex-col p-0 w-full">

            {/* Visualization section */}
            <div className="w-full bg-surface/40 border-b border-white/5">
              {/* Header */}
              <div className="flex items-center justify-between px-4 md:px-8 pt-4 pb-2">
                <span className="text-[10px] md:text-xs font-mono text-textSecondary uppercase tracking-widest opacity-60">
                  {views[project.id] === 'topology' ? 'Pipeline Topology' : 'Data Lineage DAG'}
                </span>
                <ViewToggle
                  mode={views[project.id]}
                  onChange={m => setView(project.id, m)}
                />
              </div>

              {/* Content */}
              <div className="px-4 md:px-8 pb-6 min-h-[180px]">
                <AnimatePresence mode="wait">
                  {views[project.id] === 'topology' ? (
                    <motion.div
                      key="topology"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex items-center justify-center"
                    >
                      {project.topology}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="lineage"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="w-full pt-2"
                    >
                      <LineageDAG graph={project.lineage} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Project details */}
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
                {(project as any).demo && (
                  <Link href={(project as any).demo} target="_blank" className="w-full">
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