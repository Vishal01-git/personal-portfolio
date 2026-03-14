"use client";

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';
import { Briefcase, Calendar, Code, Target, GraduationCap, BookOpen } from 'lucide-react';
import { experiences } from '@/data/experience';

export default function ExperiencePage() {
  // Split work vs education
  const workExperiences = experiences.filter(e => e.type !== 'education');
  const education = experiences.find(e => e.type === 'education');

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

      {/* Work Experience Timeline */}
      <div className="relative pl-8 md:pl-0 mt-12 w-full">
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[2px]">
          <DataFlowAnimation direction="vertical" length="100%" color="primary" duration={3} />
        </div>
        <div className="md:hidden absolute left-8 top-4 bottom-4 w-[2px] bg-white/5 rounded-full" />

        <div className="flex flex-col gap-16 md:gap-24 relative z-10 w-full mt-8">
          {workExperiences.map((exp, idx) => (
            <div key={exp.id} className={`flex flex-col md:flex-row w-full items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
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

              <div className="hidden md:flex w-[10%] justify-center relative z-20">
                <div className="w-12 h-12 rounded-2xl bg-surface border-2 border-primaryGlow/50 shadow-neon-glow flex items-center justify-center p-2.5">
                  <Code className="w-full h-full text-white/90" />
                </div>
              </div>

              <div className="hidden md:block w-[45%]" />
            </div>
          ))}
        </div>
      </div>

      {/* Education — visually separated, lighter treatment */}
      {education && (
        <div className="mt-20 pt-12 border-t border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-5 h-5 text-textSecondary" />
            <span className="text-sm font-mono uppercase tracking-widest text-textSecondary">Education</span>
          </div>

          <div className="flex items-start gap-5 p-6 rounded-2xl border border-white/5 bg-surface/20">
            <div className="w-11 h-11 rounded-xl bg-surface/60 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5 text-textSecondary" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                <h3 className="text-lg font-bold font-heading text-white/80">{education.role}</h3>
                <span className="text-xs font-mono text-textSecondary">{education.duration}</span>
              </div>
              <p className="text-sm text-textSecondary mb-3">{education.company}</p>
              <ul className="space-y-1.5">
                {education.projects.map((desc, i) => (
                  <li key={i} className="text-sm text-textSecondary/70 flex items-start gap-2">
                    <span className="text-textTertiary mt-0.5">–</span>
                    {desc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}