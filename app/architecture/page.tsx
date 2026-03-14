"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Terminal, Code2, Database, Cog, FileJson } from 'lucide-react';

type PatternId = 'dbt-incremental' | 'airflow-dynamic' | 'athena-optimization';

interface PatternData {
  id: PatternId;
  title: string;
  icon: React.ReactNode;
  description: string;
  code: string;
  language: string;
}

const patterns: PatternData[] = [
  {
    id: 'dbt-incremental',
    title: 'dbt Incremental Models (Composite Key)',
    icon: <Database className="w-5 h-5" />,
    description: 'Efficiently processing large event streams by merging new data using a composite unique key strategy.',
    language: 'sql',
    code: `{{
  config(
    materialized='incremental',
    unique_key=['user_id', 'event_timestamp'],
    incremental_strategy='merge'
  )
}}

SELECT
  user_id,
  event_timestamp,
  event_name,
  payload,
  CURRENT_TIMESTAMP() as processed_at
FROM {{ ref('stg_raw_events') }}

{% if is_incremental() %}
  -- This filter will only be applied on an incremental run
  WHERE event_timestamp >= (SELECT MAX(event_timestamp) FROM {{ this }})
{% endif %}`
  },
  {
    id: 'airflow-dynamic',
    title: 'Dynamic Airflow DAG Generation',
    icon: <Cog className="w-5 h-5" />,
    description: 'Programmatically generating DAGs from configuration files to scale pipeline management without code duplication.',
    language: 'python',
    code: `import yaml
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

def create_dag(dag_id, schedule, default_args, tables):
    dag = DAG(dag_id, schedule_interval=schedule, default_args=default_args, catchup=False)
    
    with dag:
        for table in tables:
            PythonOperator(
                task_id=f"extract_{table}",
                python_callable=lambda t=table: print(f"Extracting {t}..."),
            )
            
    return dag

# Load config and generate DAGs dynamically
with open('/opt/airflow/dags/config.yaml', 'r') as file:
    config = yaml.safe_load(file)

for pipeline in config['pipelines']:
    dag_id = f"dynamic_ingestion_{pipeline['name']}"
    globals()[dag_id] = create_dag(
        dag_id=dag_id,
        schedule=pipeline['schedule'],
        default_args={'start_date': datetime(2023, 1, 1)},
        tables=pipeline['tables']
    )`
  },
  {
    id: 'athena-optimization',
    title: 'Athena Query Optimization',
    icon: <FileJson className="w-5 h-5" />,
    description: 'Cost-effective partition pruning and bucket elimination strategies for querying petabyte-scale data lakes via AWS Athena.',
    language: 'sql',
    code: `-- Optimize Athena queries by strictly enforcing partition filters
-- and leveraging columnar formats (Parquet/ORC).

SELECT 
    date_trunc('hour', event_time) AS hour,
    event_type,
    COUNT(*) as event_count,
    SUM(cast(json_extract_scalar(payload, '$.amount') as double)) as total_value
FROM "datalake_db"."user_behavior_events"
WHERE 
    -- Partition Pruning (Year, Month, Day)
    year = '2023' 
    AND month = '10'
    AND day >= '01'
    -- File-level pruning (Parquet predicate pushdown)
    AND event_type IN ('purchase', 'add_to_cart')
GROUP BY 1, 2
ORDER BY 1 DESC;`
  }
];

export default function ArchitectureLab() {
  const [activePattern, setActivePattern] = useState<PatternId>('dbt-incremental');
  
  const currentPattern = patterns.find(p => p.id === activePattern) || patterns[0];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20 min-h-[85vh] flex flex-col">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Architecture <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">Lab</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          Interactive code modules detailing scalable engineering patterns and optimizations.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 w-full">
        
        {/* Left Side: Pattern Selection List */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-textSecondary border-b border-white/10 pb-2 mb-2 flex items-center gap-2">
            <Cog className="w-4 h-4" /> Engineering Patterns
          </h3>
          
          <div className="flex flex-col gap-3">
            {patterns.map((pattern) => {
              const isActive = activePattern === pattern.id;
              return (
                <GlassCard 
                  key={pattern.id}
                  interactive
                  onClick={() => setActivePattern(pattern.id)}
                  className={`p-4 cursor-pointer transition-all duration-300 border-l-4 ${
                    isActive 
                      ? 'border-l-primaryGlow bg-primaryGlow/5 shadow-[inset_0_0_20px_rgba(20,241,149,0.05)]' 
                      : 'border-l-transparent hover:border-l-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${isActive ? 'bg-primaryGlow/20 text-primaryGlow' : 'bg-surface text-textSecondary'}`}>
                      {pattern.icon}
                    </div>
                    <div>
                      <h4 className={`font-bold font-heading text-sm md:text-base mb-1 ${isActive ? 'text-white' : 'text-white/80'}`}>
                        {pattern.title}
                      </h4>
                      <p className="text-xs text-textSecondary line-clamp-2">
                        {pattern.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Right Side: Mock IDE Code Block */}
        <div className="w-full lg:w-2/3 flex flex-col h-[500px] lg:h-[600px] mt-8 lg:mt-0">
          <GlassCard className="p-0 h-full flex flex-col overflow-hidden border-white/10 relative group">
            
            {/* IDE Header */}
            <div className="bg-[#1e1e1e] px-4 py-3 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                
                <div className="flex items-center gap-2 bg-[#2d2d2d] px-3 py-1 rounded-md border border-white/5">
                  <Code2 className="w-4 h-4 text-primaryGlow" />
                  <span className="text-xs font-mono text-white/80">{currentPattern.language === 'python' ? 'pipeline.py' : 'model.sql'}</span>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs font-mono text-textSecondary bg-white/5 px-2 py-1 rounded">UTF-8</span>
                <span className="text-xs font-mono text-textSecondary uppercase bg-white/5 px-2 py-1 rounded">{currentPattern.language}</span>
              </div>
            </div>

            {/* IDE Content Area */}
            <div className="flex-1 overflow-auto bg-[#1e1e1e] relative">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPattern.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 font-mono text-sm leading-relaxed"
                >
                  <pre className="text-white/90 whitespace-pre-wrap break-words">
                    <code>
                      {currentPattern.code.split('\n').map((line, i) => (
                        <div key={i} className="flex hover:bg-white/5 rounded px-2 -mx-2 transition-colors group/line">
                          <span className="w-8 shrink-0 text-white/20 select-none text-right pr-4 border-r border-white/5 mr-4 group-hover/line:text-white/40">{i + 1}</span>
                          <span className="flex-1 overflow-x-auto no-scrollbar" style={{ color: getSyntaxColor(line) }}>
                            {line || ' '}
                          </span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </motion.div>
              </AnimatePresence>
            </div>
            
          </GlassCard>
        </div>

      </div>
    </div>
  );
}

// Simple pseudo-syntax highlighting helper
function getSyntaxColor(line: string): string {
  const code = line.trim();
  if (code.startsWith('--') || code.startsWith('#')) return '#6A9955'; // Comments (Green)
  if (code.startsWith('import ') || code.startsWith('from ')) return '#C586C0'; // Imports (Purple)
  if (code.startsWith('def ') || code.includes('SELECT') || code.includes('FROM') || code.includes('WHERE') || code.includes('GROUP BY') || code.includes('ORDER BY')) return '#569CD6'; // Keywords (Blue)
  if (code.includes('{%') || code.includes('{{')) return '#D16969'; // Jinja/Templates (Red)
  if (code.includes("'") || code.includes('"')) return '#CE9178'; // Strings (Orange/Brown)
  return '#D4D4D4'; // Default text (Light Gray)
}
