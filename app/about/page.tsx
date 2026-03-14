import React from 'react';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-10 pb-20 min-h-[80vh]">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          System <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">Profile</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          Overview of the engineer behind the data pipelines.
        </p>
      </div>

      <GlassCard className="p-8 md:p-12 border-white/10 shadow-elevation relative overflow-hidden">
        {/* Ember glow blob — top right */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primaryGlow/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
          {/* Profile image — shadow uses CSS variable, not hardcoded cyan */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 mx-auto md:mx-0 group">
            <div className="absolute inset-0 bg-primaryGlow/20 rounded-full blur-xl group-hover:bg-primaryGlow/40 transition-colors" />
            <Image
              src="/profile_image.jpg"
              alt="Vishal Prajapati"
              fill
              className="object-cover rounded-2xl border border-primaryGlow/30 shadow-neon-glow"
            />
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2 text-white">Vishal Prajapati</h2>
              <div className="text-primaryGlow font-mono text-sm tracking-wider uppercase">Data Engineer</div>
            </div>

            <div className="space-y-4 text-textSecondary leading-relaxed text-[15px]">
              <p>
                A high-performance processing unit specializing in the architecture, deployment, and optimization of distributed data systems. I build fault-tolerant pipelines that transform chaotic raw data into structured analytic assets.
              </p>
              <p>
                My approach treats data infrastructure as a software engineering product — emphasizing CI/CD, isolated staging environments, and comprehensive data quality testing.
              </p>
            </div>

            <div className="pt-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-textSecondary mb-4 text-center md:text-left">Certifications</h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <GlassCard className="px-4 py-2 border-white/10 text-xs md:text-sm font-mono font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primaryGlow" /> AWS Certified Developer Associate
                </GlassCard>
                <GlassCard className="px-4 py-2 border-white/10 text-xs md:text-sm font-mono font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondaryGlow" /> Google Associate Cloud Engineer
                </GlassCard>
                <GlassCard className="px-4 py-2 border-white/10 text-xs md:text-sm font-mono font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" /> OCI 2024 Generative AI Professional
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="mt-16 text-center text-textSecondary font-mono text-sm">
        <DataFlowAnimation direction="horizontal" length="100px" color="primary" className="mx-auto mb-4" />
        STATUS: ACCEPTING NEW DIRECTIVES
      </div>
    </div>
  );
}