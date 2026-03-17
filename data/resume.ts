// ─── Resume Pipeline v2 ────────────────────────────────────────────────────
// Redesigned with 5 clean stages instead of 7.
// Edges are radically simplified — max 2-3 connections per node.

export type ResumeLayer =
  | 'foundation'   // education — raw source
  | 'experience'   // internship + main role
  | 'skills'       // skill clusters
  | 'outputs'      // projects + certs
  | 'ready';       // final "production-ready" mart

export interface ResumeNode {
  id: string;
  layer: ResumeLayer;
  title: string;
  subtitle: string;
  meta?: string;
  tag?: string;          // small badge text
  tagColor?: string;     // badge color key
  bullets?: string[];
  icon: string;
}

export interface ResumeEdge {
  from: string;
  to: string;
}

// ── NODES ─────────────────────────────────────────────────────────────────
export const resumeNodes: ResumeNode[] = [

  // ── FOUNDATION ──────────────────────────────────────────────────
  {
    id: 'edu',
    layer: 'foundation',
    title: 'B.Tech CSE',
    subtitle: 'Lovely Professional University',
    meta: '2019 – 2023',
    tag: 'CGPA 8.02',
    tagColor: 'source',
    icon: '🎓',
    bullets: [
      'Computer Science & Engineering',
      'DSA, System Design, Databases',
      'Graduated CGPA 8.02',
      'Punjab, India',
    ],
  },

  // ── EXPERIENCE ──────────────────────────────────────────────────
  {
    id: 'intern',
    layer: 'experience',
    title: 'Intern',
    subtitle: 'Virtusa Consulting',
    meta: 'Jan – Apr 2023',
    tag: 'stg_experience',
    tagColor: 'experience',
    icon: '⚙️',
    bullets: [
      'Secure VPCs on GCP for 5+ microservices',
      'On-premise → cloud migration (zero data loss)',
      'CI/CD improvements → 20% faster delivery',
    ],
  },
  {
    id: 'assoc',
    layer: 'experience',
    title: 'Associate Engineer',
    subtitle: 'Data Engineer · Virtusa',
    meta: 'Jan 2024 – Present',
    tag: 'ACTIVE',
    tagColor: 'active',
    icon: '🚀',
    bullets: [
      'SQL Server → AWS Athena migration via dbt',
      'Reusable dbt macro → 40% less redundancy',
      'Python schema.yml tool → 50% faster docs',
      'Incremental models → 35% cost cut, 60% faster',
      '99.9% pipeline reliability via dynamic DAGs',
    ],
  },

  // ── SKILLS ──────────────────────────────────────────────────────
  {
    id: 'sk_dbt',
    layer: 'skills',
    title: 'dbt Core/Cloud',
    subtitle: 'Transform · 2+ yrs',
    tag: 'CORE',
    tagColor: 'skills',
    icon: '🔷',
    bullets: ['Incremental models', 'Macros & Jinja', 'Data modeling', 'Schema automation'],
  },
  {
    id: 'sk_airflow',
    layer: 'skills',
    title: 'Apache Airflow',
    subtitle: 'Orchestration · 1+ yr',
    tag: 'CORE',
    tagColor: 'skills',
    icon: '🌊',
    bullets: ['Dynamic DAG factory', 'Conditional execution', '99.9% reliability SLA'],
  },
  {
    id: 'sk_aws',
    layer: 'skills',
    title: 'AWS Stack',
    subtitle: 'Cloud infra · 3+ yrs',
    tag: 'CORE',
    tagColor: 'skills',
    icon: '☁️',
    bullets: ['Athena · S3 · Glue', 'Lambda · EC2 · IAM', 'DynamoDB · Redshift'],
  },
  {
    id: 'sk_python',
    layer: 'skills',
    title: 'Python',
    subtitle: 'Scripting · 2+ yrs',
    tag: 'CORE',
    tagColor: 'skills',
    icon: '🐍',
    bullets: ['Pandas · Boto3', 'File & schema automation', 'Flask APIs'],
  },
  {
    id: 'sk_sql',
    layer: 'skills',
    title: 'Advanced SQL',
    subtitle: 'Query engine · 1.5+ yrs',
    tag: 'CORE',
    tagColor: 'skills',
    icon: '🗄️',
    bullets: ['CTEs & Window functions', 'Stored Procedures', 'Query optimization'],
  },

  // ── OUTPUTS ─────────────────────────────────────────────────────
  {
    id: 'proj_val',
    layer: 'outputs',
    title: 'Unit Testing Accelerator',
    subtitle: 'Python · Flask · Athena',
    tag: 'SHIPPED',
    tagColor: 'outputs',
    icon: '✅',
    bullets: [
      '70% reduction in QA cycle time',
      'Automated schema + row-count checks',
      'Interactive Flask UI',
      '15+ hrs saved per sprint',
    ],
  },
  {
    id: 'proj_chat',
    layer: 'outputs',
    title: 'CloudChatFlow',
    subtitle: 'Lambda · DynamoDB · API Gateway',
    tag: 'SHIPPED',
    tagColor: 'outputs',
    icon: '💬',
    bullets: [
      'Sub-100ms latency, fully serverless',
      'Cognito auth + S3 static frontend',
      'AWS Lambda for compute',
    ],
  },
  {
    id: 'cert_aws',
    layer: 'outputs',
    title: 'AWS DVA-C02',
    subtitle: 'Developer Associate',
    tag: 'CERTIFIED',
    tagColor: 'cert',
    icon: '🏅',
    bullets: ['AWS Certified Developer Associate', 'Cloud architecture & deployment'],
  },
  {
    id: 'cert_gcp',
    layer: 'outputs',
    title: 'GCP ACE',
    subtitle: 'Associate Cloud Engineer',
    tag: 'CERTIFIED',
    tagColor: 'cert',
    icon: '🏅',
    bullets: ['Google Associate Cloud Engineer', 'GCP infra, VPC, Compute, Storage'],
  },
  {
    id: 'cert_oci',
    layer: 'outputs',
    title: 'OCI GenAI',
    subtitle: 'Generative AI Professional',
    tag: 'CERTIFIED',
    tagColor: 'cert',
    icon: '🏅',
    bullets: ['OCI 2024 Generative AI Professional', 'LLM fundamentals & deployment'],
  },

  // ── READY ────────────────────────────────────────────────────────
  {
    id: 'ready',
    layer: 'ready',
    title: 'Production-Ready',
    subtitle: 'Data Engineer',
    meta: 'v2025.1 · Open to roles',
    tag: 'MART',
    tagColor: 'ready',
    icon: '⚡',
    bullets: [
      'End-to-end pipeline ownership',
      'dbt + Airflow + AWS mastery',
      'Scalable, cost-optimised architectures',
      'Bangalore / Remote · Open to roles',
    ],
  },
];

// ── EDGES — clean topology, max fan-out of 3 per node ─────────────────────
export const resumeEdges: ResumeEdge[] = [
  // foundation → experience
  { from: 'edu',      to: 'intern'    },
  { from: 'edu',      to: 'assoc'     },

  // experience → skills
  { from: 'intern',   to: 'sk_aws'    },
  { from: 'assoc',    to: 'sk_dbt'    },
  { from: 'assoc',    to: 'sk_airflow'},
  { from: 'assoc',    to: 'sk_aws'    },
  { from: 'assoc',    to: 'sk_python' },
  { from: 'assoc',    to: 'sk_sql'    },

  // skills → outputs
  { from: 'sk_python', to: 'proj_val' },
  { from: 'sk_aws',    to: 'proj_val' },
  { from: 'sk_aws',    to: 'proj_chat'},
  { from: 'sk_python', to: 'proj_chat'},
  { from: 'sk_aws',    to: 'cert_aws' },
  { from: 'sk_aws',    to: 'cert_gcp' },
  { from: 'sk_aws',    to: 'cert_oci' },

  // outputs → ready
  { from: 'proj_val',  to: 'ready'    },
  { from: 'proj_chat', to: 'ready'    },
  { from: 'cert_aws',  to: 'ready'    },
  { from: 'cert_gcp',  to: 'ready'    },
  { from: 'cert_oci',  to: 'ready'    },
  { from: 'sk_dbt',    to: 'ready'    },
  { from: 'sk_airflow',to: 'ready'    },
];

// ── Layer config ──────────────────────────────────────────────────────────
export const LAYER_ORDER: ResumeLayer[] = ['foundation', 'experience', 'skills', 'outputs', 'ready'];

export const layerConfig: Record<ResumeLayer, {
  label: string; color: string; bg: string; border: string; glow: string; dimColor: string;
}> = {
  foundation: { label: 'SOURCE',     color: '#A89880', bg: 'rgba(168,152,128,0.10)', border: 'rgba(168,152,128,0.28)', glow: 'rgba(168,152,128,0.22)', dimColor: 'rgba(168,152,128,0.35)' },
  experience: { label: 'STAGING',    color: '#F59E0B', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.32)',  glow: 'rgba(245,158,11,0.28)',  dimColor: 'rgba(245,158,11,0.45)'  },
  skills:     { label: 'TRANSFORM',  color: '#EA580C', bg: 'rgba(234,88,12,0.10)',   border: 'rgba(234,88,12,0.32)',   glow: 'rgba(234,88,12,0.28)',   dimColor: 'rgba(234,88,12,0.45)'   },
  outputs:    { label: 'MODELS',     color: '#6EAF6E', bg: 'rgba(110,175,110,0.10)', border: 'rgba(110,175,110,0.32)', glow: 'rgba(110,175,110,0.25)', dimColor: 'rgba(110,175,110,0.40)' },
  ready:      { label: 'MART',       color: '#F59E0B', bg: 'rgba(245,158,11,0.14)',  border: 'rgba(245,158,11,0.50)',  glow: 'rgba(245,158,11,0.35)',  dimColor: 'rgba(245,158,11,0.55)'  },
};

// Tag color map — for the small badge on each node
export const tagColors: Record<string, { color: string; bg: string }> = {
  source:     { color: '#A89880', bg: 'rgba(168,152,128,0.15)' },
  experience: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)'  },
  active:     { color: '#6EAF6E', bg: 'rgba(110,175,110,0.15)' },
  skills:     { color: '#EA580C', bg: 'rgba(234,88,12,0.12)'   },
  outputs:    { color: '#6EAF6E', bg: 'rgba(110,175,110,0.12)' },
  cert:       { color: '#6B9AC4', bg: 'rgba(107,154,196,0.12)' },
  ready:      { color: '#F59E0B', bg: 'rgba(245,158,11,0.18)'  },
};