"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BootSequence } from '@/components/BootSequence';
import { Button } from '@/components/ui/Button';
import { PipelineNode } from '@/components/ui/PipelineNode';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';
import { Database, Server, Cloud, Activity, Download, Network, Cpu, Terminal, User, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [bootStrapComplete, setBootStrapComplete] = useState(false);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative w-full pt-4">
      <AnimatePresence>
        {!bootStrapComplete && (
          <BootSequence onComplete={() => setBootStrapComplete(true)} />
        )}
      </AnimatePresence>

      {bootStrapComplete && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-12"
        >
          {/* Central Architecture Display - Hidden on Mobile */}
          <div className="hidden md:flex w-full justify-center mb-6 py-8">
            <div className="flex items-center gap-1 md:gap-4 scale-[0.55] sm:scale-75 md:scale-100 origin-center transition-transform">
              <PipelineNode icon={<Database className="w-6 h-6" />} label="Source" glowColor="primary" status="active" />
              <DataFlowAnimation length="40px" color="primary" />
              <PipelineNode icon={<Server className="w-6 h-6" />} label="Processing" glowColor="primary" status="processing" />
              <DataFlowAnimation length="40px" color="secondary" />
              <PipelineNode icon={<Cloud className="w-6 h-6" />} label="Warehouse" glowColor="secondary" status="active" />
              <DataFlowAnimation length="40px" color="accent" />
              <PipelineNode icon={<Activity className="w-6 h-6" />} label="Analytics" glowColor="accent" status="processing" />
            </div>
          </div>

          {/* Hero Content */}
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-tight">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">Vishal</span>
              <br />
              Data Engineer
            </h1>
            <p className="text-lg md:text-xl text-textSecondary font-medium max-w-2xl mx-auto">
              Designing scalable data pipelines and modern data platforms. I turn complex data architecture into reliable, high-performance systems.
            </p>
          </div>

          {/* Mobile Quick Nav - Only visible on small screens */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto md:hidden mt-4">
            {[
              { name: 'Architecture', href: '/architecture', icon: <Network className="w-5 h-5 text-primaryGlow" /> },
              { name: 'Projects', href: '/projects', icon: <Database className="w-5 h-5 text-secondaryGlow" /> },
              { name: 'Skills', href: '/skills', icon: <Cpu className="w-5 h-5 text-accent" /> },
              { name: 'Experience', href: '/experience', icon: <Terminal className="w-5 h-5 text-primaryGlow" /> },
              { name: 'About', href: '/about', icon: <User className="w-5 h-5 text-secondaryGlow" /> },
              { name: 'Contact', href: '/contact', icon: <Mail className="w-5 h-5 text-accent" /> }
            ].map((link) => (
              <Link key={link.name} href={link.href}>
                <div className="bg-surface/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-white/5 transition-colors">
                  <div className="opacity-80">{link.icon}</div>
                  <span className="text-xs font-mono font-medium text-textSecondary">{link.name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <a href="/resume.pdf" download>
              <Button size="lg" variant="primary" className="shadow-[0_0_20px_rgba(20,241,149,0.3)] hover:shadow-[0_0_30px_rgba(20,241,149,0.5)] transition-shadow border border-primaryGlow/50 flex items-center gap-2">
                <Download className="w-5 h-5" /> Download Resume
              </Button>
            </a>
            <Link href="/projects" className="hidden md:block">
              <Button size="lg" variant="outline">Explore Projects</Button>
            </Link>
            <Link href="/architecture" className="hidden md:block">
              <Button size="lg" variant="outline">Architecture Lab</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
