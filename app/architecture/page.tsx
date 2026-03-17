"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Terminal, Code2, Database, Cog, Play, CheckCircle2 } from 'lucide-react';

type PatternId = 'dbt-incremental' | 'schema-standards' | 'column-normalization' | 'python-etl' | 'airflow-dag';

interface PatternData {
  id: PatternId;
  title: string;
  icon: React.ReactNode;
  description: string;
  code: string;
  language: string;
  mockOutput: string;
}

const patterns: PatternData[] = [
  {
    id: 'dbt-incremental',
    title: 'dbt Incremental Strategy',
    icon: <Database className="w-5 h-5" />,
    description: 'Composite key approach for unique_key to manage upserts efficiently.',
    language: 'sql',
    mockOutput: `[12:04:01] Running with dbt=1.7.0
[12:04:02] Found 24 models, 18 tests, 3 sources
[12:04:03] Concurrency: 4 threads (target='prod')
[12:04:03] 1 of 1 START sql incremental model mart.stg_events ......... [RUN]
[12:04:05]   Applying MERGE to mart.stg_events
[12:04:05]   Rows affected: 142,847 (inserted: 138,210 | updated: 4,637)
[12:04:06] 1 of 1 OK created sql incremental model mart.stg_events ... [MERGE in 2.84s]
[12:04:06] Finished running 1 incremental model in 3.21s.
[12:04:06] Completed successfully. 0 errors, 0 warnings.`,
    code: `{{
  config(
    materialized='incremental',
    unique_key=['user_id', 'event_timestamp'],
    incremental_strategy='merge'
  )
}}

SELECT * FROM {{ ref('stg_events') }}
{% if is_incremental() %}
  WHERE event_timestamp > (SELECT max(event_timestamp) FROM {{ this }})
{% endif %}`
  },
  {
    id: 'schema-standards',
    title: 'Schema Definition Standards',
    icon: <Database className="w-5 h-5" />,
    description: 'Strict adherence to data typing standards defining all string columns as unbounded varchar.',
    language: 'sql',
    mockOutput: `Query executed successfully.
Table created: staging.stg_user_events

Schema:
  event_id        varchar        NOT NULL
  user_id         varchar        NOT NULL
  event_type      varchar
  event_payload   varchar
  created_at      timestamp
  processed_at    timestamp

Partitions: year / month / day
Format: PARQUET (SNAPPY compression)
Location: s3://data-lake/staging/stg_user_events/`,
    code: `CREATE TABLE IF NOT EXISTS staging.stg_user_events (
    event_id varchar,
    user_id varchar,
    event_type varchar,
    event_payload varchar,
    created_at timestamp,
    processed_at timestamp
)
WITH (
    format = 'PARQUET',
    parquet_compression = 'SNAPPY',
    partitioned_by = ARRAY['year', 'month', 'day']
);`
  },
  {
    id: 'column-normalization',
    title: 'Column Normalization Macro',
    icon: <Cog className="w-5 h-5" />,
    description: 'Jinja/SQL macro that standardizes incoming raw data columns by replacing spaces with underscores.',
    language: 'sql',
    mockOutput: `Running macro: normalize_column_names(raw.events)

Columns detected: 6
  "User ID"          → user_id          ✓ renamed
  "Event Type"       → event_type       ✓ renamed
  "Created At"       → created_at       ✓ renamed
  "event_payload"    → event_payload    — unchanged
  "processed_at"     → processed_at     — unchanged
  "source_system"    → source_system    — unchanged

Generated SQL written to: models/staging/stg_events.sql
Macro completed in 0.12s`,
    code: `{% macro normalize_column_names(model) %}

  {% set columns = adapter.get_columns_in_relation(model) %}

  SELECT
  {% for column in columns %}
    {% if ' ' in column.name %}
      "{{ column.name }}" AS {{ column.name | replace(' ', '_') }}{% if not loop.last %}, {% endif %}
    {% else %}
      "{{ column.name }}"{% if not loop.last %}, {% endif %}
    {% endif %}
  {% endfor %}
  FROM {{ model }}

{% endmacro %}`
  },
  {
    id: 'python-etl',
    title: 'Python S3 Ingestion Pipeline',
    icon: <Code2 className="w-5 h-5" />,
    description: 'Boto3-powered incremental ingestion from S3 with schema validation and Athena partition registration.',
    language: 'python',
    mockOutput: `[INFO]  2024-03-14 12:00:01  Starting ingestion pipeline
[INFO]  2024-03-14 12:00:02  Scanning s3://raw-data/events/2024/03/14/
[INFO]  2024-03-14 12:00:03  Found 7 new files (last run: 2024-03-14 06:00:00)
[INFO]  2024-03-14 12:00:04  Validating schema on file: events_12h.parquet
[INFO]  2024-03-14 12:00:04  Schema OK. 14 columns matched.
[INFO]  2024-03-14 12:00:05  Copying 7 files → s3://data-lake/staging/events/year=2024/month=03/day=14/
[INFO]  2024-03-14 12:00:09  Running MSCK REPAIR TABLE staging.events
[INFO]  2024-03-14 12:00:10  Partitions registered: 1 new
[INFO]  2024-03-14 12:00:10  Pipeline complete. Records ingested: 284,112
[INFO]  2024-03-14 12:00:10  Duration: 9.2s`,
    code: `import boto3
import logging
from datetime import datetime, timedelta
from pyathena import connect

logger = logging.getLogger(__name__)
s3 = boto3.client('s3')
athena = connect(s3_staging_dir='s3://athena-results/', region_name='us-east-1')

def get_new_files(bucket: str, prefix: str, since: datetime) -> list[str]:
    paginator = s3.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=bucket, Prefix=prefix)
    return [
        obj['Key'] for page in pages
        for obj in page.get('Contents', [])
        if obj['LastModified'].replace(tzinfo=None) > since
    ]

def copy_to_lake(files: list[str], dest_bucket: str, partition: str):
    for key in files:
        dest_key = f"staging/events/{partition}/{key.split('/')[-1]}"
        s3.copy_object(
            CopySource={'Bucket': 'raw-data', 'Key': key},
            Bucket=dest_bucket,
            Key=dest_key
        )
        logger.info(f"Copied {key} → {dest_key}")

def repair_partitions(table: str):
    cursor = athena.cursor()
    cursor.execute(f"MSCK REPAIR TABLE {table}")
    logger.info(f"Partitions refreshed for {table}")

if __name__ == "__main__":
    since = datetime.utcnow() - timedelta(hours=6)
    partition = datetime.utcnow().strftime("year=%Y/month=%m/day=%d")
    new_files = get_new_files('raw-data', 'events/', since)
    if new_files:
        copy_to_lake(new_files, 'data-lake', partition)
        repair_partitions('staging.events')`
  },
  {
    id: 'airflow-dag',
    title: 'Dynamic Airflow DAG Factory',
    icon: <Cog className="w-5 h-5" />,
    description: 'Programmatically generates DAGs from a config file — one pattern drives all pipeline schedules.',
    language: 'python',
    mockOutput: `[airflow] Scanning dag_configs/*.yaml — 4 configs found
[airflow] Generated DAG: pipeline_job_events       (schedule: 0 */6 * * *)
[airflow] Generated DAG: pipeline_user_profiles    (schedule: 0 2 * * *)
[airflow] Generated DAG: pipeline_transactions     (schedule: */30 * * * *)
[airflow] Generated DAG: pipeline_ad_impressions   (schedule: 0 * * * *)

DagBag loaded 4 DAGs in 0.34s
Next run:
  pipeline_job_events     → 2024-03-14 18:00:00 UTC
  pipeline_transactions   → 2024-03-14 12:30:00 UTC`,
    code: `import yaml
from pathlib import Path
from datetime import datetime
from airflow import DAG
from airflow.operators.python import PythonOperator

def make_dag(config: dict) -> DAG:
    """Factory function — creates one DAG per config entry."""
    dag = DAG(
        dag_id=f"pipeline_{config['name']}",
        schedule_interval=config['schedule'],
        start_date=datetime(2024, 1, 1),
        catchup=False,
        tags=config.get('tags', []),
    )

    with dag:
        extract = PythonOperator(
            task_id='extract',
            python_callable=run_extract,
            op_kwargs={'source': config['source']}
        )
        transform = PythonOperator(
            task_id='transform',
            python_callable=run_dbt,
            op_kwargs={'models': config['dbt_models']}
        )
        load = PythonOperator(
            task_id='load',
            python_callable=repair_partitions,
            op_kwargs={'table': config['target_table']}
        )
        extract >> transform >> load

    return dag

# Auto-register all DAGs from yaml configs
for cfg_file in Path("dag_configs").glob("*.yaml"):
    cfg = yaml.safe_load(cfg_file.read_text())
    globals()[f"pipeline_{cfg['name']}"] = make_dag(cfg)`
  }
];

export default function ArchitectureLab() {
  const [activePattern, setActivePattern] = useState<PatternId>('dbt-incremental');
  const [runState,      setRunState]      = useState<'idle' | 'running' | 'done'>('idle');
  const [showOutput,    setShowOutput]    = useState(false);

  const currentPattern = patterns.find(p => p.id === activePattern) || patterns[0];

  const handleRun = () => {
    setShowOutput(false);
    setRunState('running');
    setTimeout(() => { setRunState('done'); setShowOutput(true); }, 1200);
  };

  const handlePatternChange = (id: PatternId) => {
    setActivePattern(id);
    setRunState('idle');
    setShowOutput(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20 min-h-[85vh] flex flex-col">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Architecture <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">Lab</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          Interactive code modules detailing scalable engineering patterns. Hit Run to see simulated output.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 w-full">

        {/* Left: pattern list */}
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
                  onClick={() => handlePatternChange(pattern.id)}
                  className={`p-4 cursor-pointer transition-all duration-300 border-l-4 ${
                    isActive
                      ? 'border-l-primaryGlow bg-primaryGlow/5'
                      : 'border-l-transparent hover:border-l-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${isActive ? 'bg-primaryGlow/20 text-primaryGlow' : 'text-textSecondary'}`}
                      style={{ backgroundColor: isActive ? undefined : 'var(--surface)' }}>
                      {pattern.icon}
                    </div>
                    <div>
                      <h4 className={`font-bold font-heading text-sm md:text-base mb-1 ${isActive ? 'text-textPrimary' : 'text-textPrimary/80'}`}>
                        {pattern.title}
                      </h4>
                      <p className="text-xs text-textSecondary line-clamp-2">{pattern.description}</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Right: IDE + output */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 mt-8 lg:mt-0">

          {/* IDE */}
          <GlassCard
            className="p-0 flex flex-col overflow-hidden"
            style={{ height: showOutput ? '340px' : '500px', transition: 'height 0.3s ease' }}
          >
            {/* Title bar */}
            <div className="px-4 py-3 border-b flex items-center justify-between shrink-0"
              style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--borderSubtle)' }}>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--primaryGlow)', opacity: 0.8 }} />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-md border"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--borderSubtle)' }}>
                  <Code2 className="w-4 h-4 text-primaryGlow" />
                  <span className="text-xs font-mono text-textPrimary/80">
                    {currentPattern.language === 'python' ? 'pipeline.py' : 'model.sql'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden md:block text-xs font-mono text-textSecondary uppercase px-2 py-1 rounded"
                  style={{ backgroundColor: 'var(--surface)' }}>{currentPattern.language}</span>
                <button
                  onClick={handleRun}
                  disabled={runState === 'running'}
                  className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md bg-primaryGlow/15 text-primaryGlow border border-primaryGlow/30 hover:bg-primaryGlow/25 transition-all disabled:opacity-50"
                >
                  {runState === 'running' ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="w-3 h-3 border border-primaryGlow border-t-transparent rounded-full" />
                  ) : runState === 'done' ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  {runState === 'running' ? 'Running...' : runState === 'done' ? 'Run again' : 'Dry Run'}
                </button>
              </div>
            </div>

            {/* Code area */}
            <div className="flex-1 overflow-auto relative" style={{ backgroundColor: 'var(--code-bg)' }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(var(--code-line-bg) 1px, transparent 1px)', backgroundSize: '100% 24px' }} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPattern.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{   opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 font-mono text-sm leading-relaxed"
                >
                  <pre className="text-textPrimary/90 whitespace-pre-wrap break-words">
                    <code>
                      {currentPattern.code.split('\n').map((line, i) => (
                        <div key={i} className="flex rounded px-2 -mx-2 transition-colors group/line"
                          style={{ ':hover': { backgroundColor: 'var(--code-line-hover)' } } as React.CSSProperties}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--code-line-hover)')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                        >
                          <span className="w-8 shrink-0 text-textTertiary select-none text-right pr-4 border-r mr-4"
                            style={{ borderColor: 'var(--borderSubtle)' }}>
                            {i + 1}
                          </span>
                          <span className="flex-1 overflow-x-auto no-scrollbar"
                            style={{ color: getSyntaxColor(line, currentPattern.language) }}>
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

          {/* Output terminal */}
          <AnimatePresence>
            {showOutput && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{   opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-0 overflow-hidden border-primaryGlow/20">
                  <div className="px-4 py-2.5 border-b flex items-center gap-2"
                    style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--borderSubtle)' }}>
                    <Terminal className="w-3.5 h-3.5 text-primaryGlow" />
                    <span className="text-xs font-mono text-textSecondary uppercase tracking-wider">Output</span>
                    <span className="ml-auto text-xs font-mono text-statusSuccess flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> exit 0
                    </span>
                  </div>
                  <div className="p-4 font-mono text-xs leading-relaxed whitespace-pre overflow-x-auto"
                    style={{ backgroundColor: 'var(--surface-subtle)', color: 'var(--statusSuccess)' }}>
                    {currentPattern.mockOutput}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function getSyntaxColor(line: string, lang: string): string {
  const code = line.trim();
  if (lang === 'python') {
    if (code.startsWith('#'))                                         return '#6A9955';
    if (code.startsWith('import ') || code.startsWith('from '))      return '#C586C0';
    if (/^(def |class |if |for |return |with |async |await )/.test(code)) return '#569CD6';
    if (code.includes('"""') || code.includes("'''") || (code.includes("'") && !code.startsWith('['))) return '#CE9178';
    if (/^\s*\w+\s*=/.test(code))                                    return '#9CDCFE';
    return 'var(--textPrimary)';
  }
  if (code.startsWith('--') || code.startsWith('#'))                 return '#6A9955';
  if (code.startsWith('import ') || code.startsWith('from '))        return '#C586C0';
  if (/SELECT|FROM|WHERE|GROUP BY|ORDER BY|CREATE|INSERT|WITH|JOIN|ON|AS|TABLE|IF/.test(code)) return '#569CD6';
  if (code.includes('{%') || code.includes('{{'))                    return '#D16969';
  if (code.includes("'") || code.includes('"'))                      return '#CE9178';
  return 'var(--textPrimary)';
}