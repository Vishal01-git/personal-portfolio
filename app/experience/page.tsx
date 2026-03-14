"use client";

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';
import { Briefcase, Calendar, Code, Target } from 'lucide-react';

const experiences = [
  {
    id: 1,
    role: "Senior Data Engineer",
    company: "TechNexus Systems",
    duration: "2021 - Present",
    projects: [
      "Architected real-time event streaming platform saving 40% on compute.",
      "Led team of 4 engineers transitioning to a Lakehouse architecture."
    ]
  },
  {
    id: 2,
    role: "Data Engineer",
    company: "DataCloud Inc",
    duration: "2018 - 2021",
    projects: [
      "Built 50+ Airflow DAGs for automated reporting.",
      "Optimized Redshift queries reducing load times by 60%."
    ]
  },
  {
    id: 3,
    role: "Database Administrator",
    company: "Legacy Corp",
    duration: "2016 - 2018",
    projects: [
      "Managed 10TB+ PostgreSQL instances.",
      "Implemented automated backups and failover strategies."
    ]
  }
];

export default function ExperiencePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-10 pb-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">Timeline</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          My professional journey mapped as a sequential execution pipeline.
        </p>
      </div>

      <div className="relative pl-8 md:pl-0 mt-12 w-full">
        {/* Central Vertical Pipeline for Desktop */}
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[2px]">
            <DataFlowAnimation direction="vertical" length="100%" color="primary" duration={3} />
        </div>
        
        {/* Mobile vertical line */}
        <div className="md:hidden absolute left-8 top-4 bottom-4 w-[2px] bg-white/5 rounded-full" />

        <div className="flex flex-col gap-16 md:gap-24 relative z-10 w-full mt-8">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className={`flex flex-col md:flex-row w-full items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Content Card */}
              <div className={`w-full md:w-[45%] ${idx % 2 === 0 ? 'md:pl-10' : 'md:pr-10'} ml-10 md:ml-0 relative`}>
                <div className="md:hidden absolute -left-[54px] top-6 z-20">
                    <div className="w-5 h-5 rounded-full bg-surface border-[3px] border-primaryGlow shadow-neon-glow" />
                </div>
                
                <GlassCard className="p-6 relative overflow-hidden group hover:border-primaryGlow/50 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primaryGlow/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primaryGlow/10 transition-colors" />
                  
                  <div className="flex items-center gap-3 text-primaryGlow mb-3 text-sm font-mono tracking-wider">
                    <Calendar className="w-4 h-4" />
                    {exp.duration}
                  </div>
                  
                  <h3 className="text-2xl font-bold font-heading mb-1 text-white">{exp.role}</h3>
                  <h4 className="text-base text-textSecondary border-b border-white/10 pb-4 mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> {exp.company}
                  </h4>
                  
                  <ul className="space-y-3">
                    {exp.projects.map((desc, i) => (
                      <li key={i} className="text-[15px] text-textPrimary/80 flex items-start gap-2.5">
                        <Target className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <span className="leading-snug">{desc}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>

              {/* Center Node (Desktop) */}
              <div className="hidden md:flex w-[10%] justify-center relative z-20">
                <div className="w-12 h-12 rounded-2xl bg-surface border-2 border-primaryGlow/50 shadow-neon-glow flex items-center justify-center p-2.5">
                    <Code className="w-full h-full text-white/90" />
                </div>
              </div>

              {/* Empty Space for layout balancing */}
              <div className="hidden md:block w-[45%]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
