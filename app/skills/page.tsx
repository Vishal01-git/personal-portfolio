"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PipelineNode } from '@/components/ui/PipelineNode';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Terminal, Database, Cloud, Cog, Server, Layers, Code, HardDrive, Box, Network, Github, LayoutDashboard, Cpu, BookOpen } from 'lucide-react';

const skillsData = [
  { id: 'python', name: 'Python', icon: <Code className="w-6 h-6" />, category: 'Language', exp: '4+ Years', projects: ['Pandas', 'Boto3', 'File Automation'], color: 'primary' },
  { id: 'sql', name: 'Advanced SQL', icon: <Database className="w-6 h-6" />, category: 'Language', exp: '5+ Years', projects: ['CTEs', 'Window Functions', 'Stored Procedures'], color: 'secondary' },
  { id: 'aws', name: 'AWS Athena', icon: <Cloud className="w-6 h-6" />, category: 'Cloud Query Engine', exp: '3+ Years', projects: ['Serverless Analytics', 'Data Lake Queries'], color: 'primary' },
  { id: 'dbt', name: 'dbt (Core/Cloud)', icon: <Layers className="w-6 h-6" />, category: 'Transform', exp: '2+ Years', projects: ['Data Modeling', 'Incremental Loading', 'Macros'], color: 'secondary' },
  { id: 'airflow', name: 'Apache Airflow', icon: <Cog className="w-6 h-6" />, category: 'Orchestration', exp: '3+ Years', projects: ['Dynamic DAGs', 'ETL/ELT Pipelines'], color: 'accent' },
  { id: 'sqlserver', name: 'SQL Server', icon: <Database className="w-6 h-6" />, category: 'Database', exp: '5+ Years', projects: ['Stored Procedures', 'Legacy Migrations'], color: 'primary' },
  { id: 'aws_eco', name: 'AWS Ecosystem', icon: <Cloud className="w-6 h-6" />, category: 'Cloud', exp: '3+ Years', projects: ['S3', 'Glue', 'Lambda', 'Redshift', 'DynamoDB'], color: 'secondary' },
  { id: 'docker', name: 'Docker', icon: <Box className="w-6 h-6" />, category: 'Infrastructure', exp: '3+ Years', projects: ['Containerization', 'Microservices'], color: 'accent' },
  { id: 'github_actions', name: 'GitHub Actions', icon: <Github className="w-6 h-6" />, category: 'CI/CD', exp: '3+ Years', projects: ['Automated Testing', 'Deployment Pipelines'], color: 'primary' },
];

export default function SkillsPage() {
  const [activeSkill, setActiveSkill] = useState<string>(skillsData[0].id);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  const handleSkillClick = (id: string) => {
    setActiveSkill(id);
    if (detailPanelRef.current) {
      setTimeout(() => {
        detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 flex flex-col items-center pb-20">
      <div className="text-center mb-16 space-y-4 pt-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">Infrastructure</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          My skill modules structured as a continuous data integration and processing pipeline.
        </p>
      </div>

      <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 mt-8">
        
        {/* Row 1 */}
        <div className="flex flex-row md:flex-col justify-center gap-8 md:gap-12 relative z-10 w-full md:w-auto">
          {skillsData.slice(0, 3).map(skill => (
            <div 
              key={skill.id} 
              className="cursor-pointer group flex-1 md:flex-initial flex justify-center" 
              onClick={() => handleSkillClick(skill.id)}
            >
              <PipelineNode 
                icon={skill.icon} 
                label={skill.name} 
                glowColor={skill.color as any} 
                status={activeSkill === skill.id ? "active" : "idle"}
                isActive={activeSkill === skill.id}
              />
            </div>
          ))}
        </div>

        {/* Data Flow 1 */}
        <div className="hidden md:flex flex-col justify-center items-center relative w-full px-4">
          <DataFlowAnimation length="100%" color="primary" />
        </div>

        {/* Row 2 */}
        <div className="flex flex-row md:flex-col justify-center gap-8 md:gap-12 relative z-10 w-full md:w-auto">
          {skillsData.slice(3, 6).map(skill => (
            <div 
              key={skill.id} 
              className="cursor-pointer group flex-1 md:flex-initial flex justify-center" 
              onClick={() => handleSkillClick(skill.id)}
            >
              <PipelineNode 
                icon={skill.icon} 
                label={skill.name} 
                glowColor={skill.color as any} 
                status={activeSkill === skill.id ? "processing" : "idle"}
                isActive={activeSkill === skill.id}
              />
            </div>
          ))}
        </div>

        {/* Data Flow 2 */}
        <div className="hidden md:flex flex-col justify-center items-center relative w-full px-4">
          <DataFlowAnimation length="100%" color="secondary" />
        </div>

        {/* Row 3 */}
        <div className="flex flex-row md:flex-col justify-center gap-8 md:gap-12 relative z-10 w-full md:w-auto items-center">
          {skillsData.slice(6, 9).map(skill => (
            <div 
              key={skill.id} 
              className="cursor-pointer group md:flex-initial flex justify-center" 
              onClick={() => handleSkillClick(skill.id)}
            >
              <PipelineNode 
                icon={skill.icon} 
                label={skill.name} 
                glowColor={skill.color as any} 
                status={activeSkill === skill.id ? "active" : "idle"}
                isActive={activeSkill === skill.id}
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
      <div ref={detailPanelRef} className="w-full max-w-2xl mt-12 md:mt-20 h-auto md:h-48 mb-16 scroll-mt-24">
        <AnimatePresence mode="wait">
          {activeSkill && (
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
          )}
        </AnimatePresence>
      </div>

      {/* Core Fundamentals Section */}
      <div className="max-w-4xl w-full mt-8 md:mt-16 relative">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-1 h-3 bg-gradient-to-b from-primaryGlow to-transparent" />
          <div className="w-px h-6 bg-white/20" />
        </div>
        
        <GlassCard className="p-8 md:p-12 relative overflow-hidden" glowColor="accent">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Cpu className="w-48 h-48 rotate-12" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold font-heading mb-4 flex items-center justify-center md:justify-start gap-3">
                <BookOpen className="w-8 h-8 text-accent" />
                Core Fundamentals
              </h2>
              <p className="text-textSecondary leading-relaxed">
                Aiming for engineering excellence at top-tier firms, I dedicate daily deliberate practice to mastering the foundational pillars of computer science. True scalability begins at the algorithmic level.
              </p>
            </div>
            
            <div className="flex-1 w-full space-y-4">
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-start gap-4 hover:border-accent/30 transition-colors">
                <div className="bg-accent/10 p-2 rounded-lg mt-1">
                  <Code className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Data Structures & Algorithms</h4>
                  <p className="text-sm text-textSecondary">Continuous problem solving, complexity analysis, and optimization using Python and C++.</p>
                </div>
              </div>
              
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-start gap-4 hover:border-primaryGlow/30 transition-colors">
                <div className="bg-primaryGlow/10 p-2 rounded-lg mt-1">
                  <Network className="w-5 h-5 text-primaryGlow" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">System Design</h4>
                  <p className="text-sm text-textSecondary">Architecting high-availability, fault-tolerant distributed systems and robust data pipelines under heavy load.</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
