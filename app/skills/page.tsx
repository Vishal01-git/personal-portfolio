"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PipelineNode } from '@/components/ui/PipelineNode';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Terminal, Database, Cloud, Cog, Server, Layers, Code, HardDrive } from 'lucide-react';

const skillsData = [
  { id: 'python', name: 'Python', icon: <Code className="w-6 h-6" />, category: 'Language', exp: '4+ Years', projects: ['Real-time ETL', 'ML Pipeline'], color: 'primary' },
  { id: 'sql', name: 'SQL', icon: <Database className="w-6 h-6" />, category: 'Language', exp: '5+ Years', projects: ['Data Warehousing', 'Analytics Views'], color: 'primary' },
  { id: 'spark', name: 'Apache Spark', icon: <Server className="w-6 h-6" />, category: 'Processing', exp: '3+ Years', projects: ['Log Processing', 'Recommendation Engine'], color: 'secondary' },
  { id: 'dbt', name: 'DBT', icon: <Layers className="w-6 h-6" />, category: 'Transform', exp: '2+ Years', projects: ['Analytics Engineering', 'Data Quality'], color: 'secondary' },
  { id: 'airflow', name: 'Airflow', icon: <Cog className="w-6 h-6" />, category: 'Orchestration', exp: '3+ Years', projects: ['Batch Pipelines', 'Dependency Management'], color: 'accent' },
  { id: 'snowflake', name: 'Snowflake', icon: <HardDrive className="w-6 h-6" />, category: 'Warehouse', exp: '2+ Years', projects: ['Cloud DWH', 'Data Sharing'], color: 'accent' },
  { id: 'aws', name: 'AWS', icon: <Cloud className="w-6 h-6" />, category: 'Cloud', exp: '4+ Years', projects: ['S3 Datalake', 'EMR Clusters', 'Lambda API'], color: 'primary' },
];

export default function SkillsPage() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
      <div className="text-center mb-16 space-y-4 pt-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">Infrastructure</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          My skill modules structured as a continuous data integration and processing pipeline.
        </p>
      </div>

      <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 mt-8">
        
        {/* Languages / Sources */}
        <div className="flex flex-row md:flex-col justify-center gap-8 md:gap-12 relative z-10 w-full md:w-auto">
          {skillsData.slice(0, 2).map(skill => (
            <div 
              key={skill.id} 
              className="cursor-pointer group flex-1 md:flex-initial flex justify-center" 
              onMouseEnter={() => setActiveSkill(skill.id)}
              onMouseLeave={() => setActiveSkill(null)}
            >
              <PipelineNode 
                icon={skill.icon} 
                label={skill.name} 
                glowColor={skill.color as any} 
                status={activeSkill === skill.id ? "active" : "idle"}
              />
            </div>
          ))}
        </div>

        {/* Data Flow 1 */}
        <div className="hidden md:flex flex-col justify-center items-center relative w-full px-4">
          <DataFlowAnimation length="100%" color="primary" />
        </div>

        {/* Processing & Transform */}
        <div className="flex flex-row md:flex-col justify-center gap-8 md:gap-12 relative z-10 w-full md:w-auto">
          {skillsData.slice(2, 4).map(skill => (
            <div 
              key={skill.id} 
              className="cursor-pointer group flex-1 md:flex-initial flex justify-center" 
              onMouseEnter={() => setActiveSkill(skill.id)}
              onMouseLeave={() => setActiveSkill(null)}
            >
              <PipelineNode 
                icon={skill.icon} 
                label={skill.name} 
                glowColor={skill.color as any} 
                status={activeSkill === skill.id ? "processing" : "idle"}
              />
            </div>
          ))}
        </div>

        {/* Data Flow 2 */}
        <div className="hidden md:flex flex-col justify-center items-center relative w-full px-4">
          <DataFlowAnimation length="100%" color="secondary" />
        </div>

        {/* Orchestration & Cloud & Warehouse */}
        <div className="flex flex-row md:flex-col justify-center gap-8 md:gap-12 relative z-10 w-full md:w-auto items-center">
          {skillsData.slice(4, 7).map(skill => (
            <div 
              key={skill.id} 
              className="cursor-pointer group md:flex-initial flex justify-center" 
              onMouseEnter={() => setActiveSkill(skill.id)}
              onMouseLeave={() => setActiveSkill(null)}
            >
              <PipelineNode 
                icon={skill.icon} 
                label={skill.name} 
                glowColor={skill.color as any} 
                status={activeSkill === skill.id ? "active" : "idle"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Vertical Data Flows for Mobile (visual only) */}
      <div className="md:hidden flex flex-col items-center gap-8 w-full -mt-4 mb-4 opacity-50">
           <DataFlowAnimation direction="vertical" length="40px" color="primary" />
      </div>

      {/* Skill Detail Panel */}
      <div className="w-full max-w-2xl mt-12 md:mt-20 h-[220px] md:h-48">
        <AnimatePresence mode="wait">
          {activeSkill ? (
            <motion.div
              key={activeSkill}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard glowColor={skillsData.find(s => s.id === activeSkill)?.color as any} className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left h-full">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold font-heading mb-2">{skillsData.find(s => s.id === activeSkill)?.name}</h3>
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                    <Badge variant="outline">{skillsData.find(s => s.id === activeSkill)?.category}</Badge>
                    <span className="text-sm font-mono text-primaryGlow">{skillsData.find(s => s.id === activeSkill)?.exp}</span>
                  </div>
                </div>
                <div className="flex-1 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 w-full">
                  <h4 className="text-xs uppercase tracking-wider text-textSecondary mb-3">Key Implementations</h4>
                  <ul className="space-y-2">
                    {skillsData.find(s => s.id === activeSkill)?.projects.map(p => (
                      <li key={p} className="text-sm flex items-center justify-center md:justify-start gap-2">
                        <Terminal className="w-3 h-3 text-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center p-6 border border-white/5 rounded-2xl bg-surface/20 border-dashed"
            >
              <p className="text-textSecondary font-mono text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 animate-pulse" />
                Hover over a node to inspect module details
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
