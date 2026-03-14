"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { PipelineNode } from '@/components/ui/PipelineNode';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';
import { Database, Server, Cloud, Zap, Layers, RefreshCw, HardDrive } from 'lucide-react';

export default function ArchitectureLab() {
  const [activeTab, setActiveTab] = useState<'batch' | 'streaming' | 'lakehouse'>('batch');

  const architectures = {
    batch: {
      title: "Batch Processing Pipeline",
      description: "A scheduled ELT architecture extracting from operational databases, staging in S3, and leveraging Snowflake and DBT for heavy transformations.",
      diagram: (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-4 scale-90 md:scale-100 my-10 overflow-x-auto no-scrollbar w-full py-6">
          <PipelineNode icon={<Database className="w-6 h-6"/>} label="Source DB" glowColor="none" />
          <DataFlowAnimation length="40px" color="primary" className="hidden md:block" />
          <DataFlowAnimation direction="vertical" length="20px" color="primary" className="md:hidden" />
          <div className="relative">
            <PipelineNode icon={<RefreshCw className="w-6 h-6"/>} label="Airflow" glowColor="none" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-textSecondary border border-white/10 px-2 rounded-full whitespace-nowrap">Schedule</div>
          </div>
          <DataFlowAnimation length="40px" color="primary" className="hidden md:block" />
          <DataFlowAnimation direction="vertical" length="20px" color="primary" className="md:hidden" />
          <PipelineNode icon={<Server className="w-6 h-6"/>} label="Spark" glowColor="primary" status="processing" />
          <DataFlowAnimation length="40px" color="secondary" className="hidden md:block" />
          <DataFlowAnimation direction="vertical" length="20px" color="secondary" className="md:hidden" />
          <PipelineNode icon={<Cloud className="w-6 h-6"/>} label="S3 Lake" glowColor="secondary" />
          <DataFlowAnimation length="40px" color="accent" className="hidden md:block" />
          <DataFlowAnimation direction="vertical" length="20px" color="accent" className="md:hidden" />
          <PipelineNode icon={<Layers className="w-6 h-6"/>} label="DBT" glowColor="accent" status="active" />
          <DataFlowAnimation length="40px" color="accent" className="hidden md:block" />
          <DataFlowAnimation direction="vertical" length="20px" color="accent" className="md:hidden" />
          <PipelineNode icon={<HardDrive className="w-6 h-6"/>} label="Snowflake" glowColor="accent" />
        </div>
      )
    },
    streaming: {
      title: "Real-time Streaming Pipeline",
      description: "Low-latency event processing using Kafka and Spark Streaming, landing in a Delta Lake for both real-time operational dashboards and historical ML training.",
      diagram: (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-4 scale-90 md:scale-100 my-10 overflow-x-auto no-scrollbar w-full py-6">
          <PipelineNode icon={<Zap className="w-6 h-6"/>} label="Event APs" glowColor="none" />
          <DataFlowAnimation length="40px" color="primary" className="hidden md:block" />
          <DataFlowAnimation direction="vertical" length="20px" color="primary" className="md:hidden" />
          <PipelineNode icon={<Server className="w-6 h-6"/>} label="Kafka" glowColor="primary" status="active" />
          <DataFlowAnimation length="40px" color="secondary" className="hidden md:block" />
          <DataFlowAnimation direction="vertical" length="20px" color="secondary" className="md:hidden" />
          <PipelineNode icon={<Server className="w-6 h-6"/>} label="Spark Stream" glowColor="secondary" status="processing" />
          <DataFlowAnimation length="40px" color="accent" className="hidden md:block" />
          <DataFlowAnimation direction="vertical" length="20px" color="accent" className="md:hidden" />
          <PipelineNode icon={<Cloud className="w-6 h-6"/>} label="Delta Lake" glowColor="accent" />
          <DataFlowAnimation length="40px" color="none" className="hidden md:block" />
          <DataFlowAnimation direction="vertical" length="20px" color="none" className="md:hidden" />
          <PipelineNode icon={<Database className="w-6 h-6"/>} label="Dashboards" glowColor="primary" />
        </div>
      )
    },
    lakehouse: {
      title: "Medallion Lakehouse Architecture",
      description: "A structured data lake implementation using the bronze/silver/gold (raw, staging, mart) paradigm to provide atomic consistency and high-performance querying.",
      diagram: (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 scale-90 md:scale-100 my-10 overflow-x-auto no-scrollbar w-full py-6">
          <PipelineNode icon={<Cloud className="w-8 h-8 text-orange-700"/>} label="Bronze (Raw)" glowColor="none" />
          <DataFlowAnimation length="60px" color="primary" className="hidden md:block" />
          <DataFlowAnimation direction="vertical" length="30px" color="primary" className="md:hidden" />
          <div className="relative">
            <PipelineNode icon={<Cloud className="w-8 h-8 text-gray-400"/>} label="Silver (Staging)" glowColor="primary" status="processing" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-textSecondary border border-white/10 px-2 rounded-full whitespace-nowrap">Cleanse & Filter</div>
          </div>
          <DataFlowAnimation length="60px" color="accent" className="hidden md:block" />
          <DataFlowAnimation direction="vertical" length="30px" color="accent" className="md:hidden" />
          <div className="relative">
            <PipelineNode icon={<Cloud className="w-8 h-8 text-yellow-500"/>} label="Gold (Mart)" glowColor="accent" status="active" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-textSecondary border border-white/10 px-2 rounded-full whitespace-nowrap">Aggregations</div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-20 min-h-[80vh]">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Architecture <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">Lab</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          Interactive blueprints mapping data from source systems to analytical endpoints.
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="p-1.5 rounded-xl bg-surface/60 border border-white/10 flex flex-wrap justify-center gap-2 backdrop-blur-md shadow-soft-glass">
          {(Object.keys(architectures) as Array<keyof typeof architectures>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 md:px-6 py-2 rounded-lg text-sm md:text-base font-medium transition-all ${
                activeTab === key 
                  ? 'bg-primaryGlow/20 text-primaryGlow shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                  : 'text-textSecondary hover:text-white hover:bg-white/5'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <GlassCard className="min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden p-0 border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(230,237,243,0.02),transparent_70%)]" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full flex flex-col items-center z-10 p-6 md:p-12 w-full h-full justify-between"
          >
            <div className="text-center w-full max-w-3xl mb-4 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">{architectures[activeTab].title}</h2>
                <p className="text-sm md:text-base text-textSecondary leading-relaxed">{architectures[activeTab].description}</p>
            </div>
            
            <div className="w-full overflow-x-auto py-8 no-scrollbar bg-black/30 rounded-2xl border border-white/5 shadow-inner">
                {architectures[activeTab].diagram}
            </div>
            
          </motion.div>
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}
