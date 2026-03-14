import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Terminal, Code, Database, Server } from 'lucide-react';
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-primaryGlow/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
          <div className="w-40 h-40 shrink-0 relative group">
            <div className="absolute inset-0 bg-primaryGlow/20 rounded-full blur-xl group-hover:bg-primaryGlow/40 transition-colors" />
            <div className="w-full h-full rounded-2xl bg-surface border border-primaryGlow/50 shadow-neon-glow flex items-center justify-center p-4 transform rotate-3 group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <Terminal className="w-20 h-20 text-white/80" />
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2 text-white">Vishal</h2>
              <div className="text-primaryGlow font-mono text-sm tracking-wider uppercase">Senior Data Engineer</div>
            </div>

            <div className="space-y-4 text-textSecondary leading-relaxed text-[15px]">
              <p>
                A high-performance processing unit specializing in the architecture, deployment, and optimization of distributed data systems. I build fault-tolerant pipelines that transform chaotic raw data into structured analytic assets.
              </p>
              <p>
                My approach treats data infrastructure as a software engineering product—emphasizing CI/CD, isolated staging environments, and comprehensive data quality testing.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <div className="text-xs text-textSecondary font-mono uppercase">Primary Logic</div>
                <div className="font-bold flex items-center justify-center md:justify-start gap-2"><Code className="w-4 h-4 text-primaryGlow" /> Python</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-textSecondary font-mono uppercase">Data Storage</div>
                <div className="font-bold flex items-center justify-center md:justify-start gap-2"><Database className="w-4 h-4 text-accent" /> Snowflake</div>
              </div>
              <div className="space-y-1 col-span-2 md:col-span-1">
                <div className="text-xs text-textSecondary font-mono uppercase">Compute layer</div>
                <div className="font-bold flex items-center justify-center md:justify-start gap-2"><Server className="w-4 h-4 text-secondaryGlow" /> Spark</div>
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
