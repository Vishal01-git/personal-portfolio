"use client";

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PipelineNode } from '@/components/ui/PipelineNode';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';
import { Github, ExternalLink, Globe, Database, Server, Zap, Cloud, Settings, Terminal, Activity, FileText, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

const projects = [
  {
    id: 1,
    title: 'Job Market Arbitrage Data Platform',
    description: 'An end-to-end data pipeline that extracts job market data to identify arbitrage opportunities.',
    tech: ['Terraform', 'GitHub Actions', 'Python', 'Docker', 'Airflow', 'dbt', 'AWS Athena', 'Streamlit'],
    architecture: (
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 scale-90 md:scale-100 my-8 w-full overflow-x-auto no-scrollbar py-4">
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
    github: '#',
    demo: '#'
  },
  {
    id: 2,
    title: 'Automated Data Validation Accelerator',
    description: 'A custom web application built to accelerate data migration testing by automating schema, count, and row-level data checks between legacy databases and cloud data lakes.',
    tech: ['Python', 'Streamlit', 'Pandas', 'PyAthena', 'PyODBC'],
    architecture: (
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 scale-90 md:scale-100 my-8 w-full overflow-x-auto no-scrollbar py-4">
        <PipelineNode icon={<Database className="w-6 h-6" />} label="SQL Server & Athena" glowColor="none" />
        <DataFlowAnimation length="40px" color="primary" className="hidden md:block" />
        <DataFlowAnimation direction="vertical" length="20px" color="primary" className="md:hidden" />
        <PipelineNode icon={<Activity className="w-6 h-6" />} label="Python Validator Engine" glowColor="primary" status="processing" />
        <DataFlowAnimation length="40px" color="secondary" className="hidden md:block" />
        <DataFlowAnimation direction="vertical" length="20px" color="secondary" className="md:hidden" />
        <PipelineNode icon={<FileText className="w-6 h-6" />} label="HTML Report Generator" glowColor="secondary" />
        <DataFlowAnimation length="40px" color="accent" className="hidden md:block" />
        <DataFlowAnimation direction="vertical" length="20px" color="accent" className="md:hidden" />
        <PipelineNode icon={<LayoutDashboard className="w-6 h-6" />} label="Streamlit UI" glowColor="accent" status="active" />
      </div>
    ),
    github: '#',
  }
];

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">Deployments</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          A showcase of data engineering projects, highlighting scalable architectures, robust pipelines, and optimized analytic platforms.
        </p>
      </div>

      <div className="flex flex-col gap-12 md:gap-16 w-full">
        {projects.map(project => (
          <GlassCard key={project.id} className="overflow-hidden flex flex-col p-0 w-full">
            {/* Architecture Visualization Section */}
            <div className="w-full bg-surface/40 p-4 md:p-10 border-b border-white/5 relative flex items-center justify-center min-h-[200px]">
              <div className="absolute top-4 left-4 text-[10px] md:text-xs font-mono text-textSecondary uppercase tracking-widest opacity-50">Architecture Topology</div>
              {project.architecture}
            </div>
            
            {/* Project Details */}
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
