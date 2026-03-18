// ─── Skill Graph v3 — Refined Radial ──────────────────────────────────────
// Same radial concept as v1 but:
// - Labels rendered OUTSIDE circles (readable at any size)
// - Only 8 meaningful cross-skill edges (no hub clutter)
// - Larger node radii so icons breathe

export type SkillCategory = 'pipeline' | 'cloud' | 'languages' | 'devops';

export interface RadialNode {
  id: string;
  label: string;
  sublabel: string;
  type: 'center' | 'category' | 'skill';
  category?: SkillCategory;
  angleDeg: number;   // 0 = top, clockwise
  radius: number;     // SVG units from center (500, 500)
  icon: string;
  proficiency?: number;
  description?: string;
  color: string;
}

export interface SkillEdge {
  from: string;
  to: string;
  label: string;
}

// ── Colors ─────────────────────────────────────────────────────────────────
export const catColors: Record<SkillCategory, { primary: string; glow: string; bg: string }> = {
  pipeline:  { primary: '#F59E0B', glow: 'rgba(245,158,11,0.45)', bg: 'rgba(245,158,11,0.12)' },
  cloud:     { primary: '#6B9AC4', glow: 'rgba(107,154,196,0.45)', bg: 'rgba(107,154,196,0.12)' },
  languages: { primary: '#EA580C', glow: 'rgba(234,88,12,0.45)',  bg: 'rgba(234,88,12,0.12)'  },
  devops:    { primary: '#6EAF6E', glow: 'rgba(110,175,110,0.45)', bg: 'rgba(110,175,110,0.12)' },
};

// ── Node radii ─────────────────────────────────────────────────────────────
export const NODE_R = {
  center:   58,
  category: 40,
  skill:    32,
};

// ── Canvas center ──────────────────────────────────────────────────────────
export const CX = 500;
export const CY = 480;

// ── Nodes ──────────────────────────────────────────────────────────────────
// Category ring at radius 175, skill ring at radius 355
// 4 categories at 45°/135°/225°/315° — clean diagonal cross
// Skills grouped around their category (±30° spread)

const CAT_R  = 175;
const SKILL_R = 355;

export const radialNodes: RadialNode[] = [
  // ── CENTER ──────────────────────────────────────────────────────────────
  {
    id: 'center', label: 'Data Engineer', sublabel: 'Vishal Prajapati',
    type: 'center', angleDeg: 0, radius: 0,
    icon: '⚡', color: '#F59E0B',
    description: 'Full-stack data engineering across pipeline design, cloud infra, and modern tooling.',
  },

  // ── CATEGORIES (inner ring, 4 nodes) ─────────────────────────────────
  {
    id: 'cat_pipeline', label: 'Pipeline', sublabel: 'Transform & Orchestrate',
    type: 'category', category: 'pipeline', angleDeg: 45, radius: CAT_R,
    icon: '🔄', color: catColors.pipeline.primary,
    description: 'dbt + Airflow + SQL Server migration stack.',
  },
  {
    id: 'cat_cloud', label: 'Cloud', sublabel: 'AWS Ecosystem',
    type: 'category', category: 'cloud', angleDeg: 135, radius: CAT_R,
    icon: '☁️', color: catColors.cloud.primary,
    description: 'Athena, S3, Glue, Lambda, Redshift on AWS.',
  },
  {
    id: 'cat_languages', label: 'Languages', sublabel: 'Code & Query',
    type: 'category', category: 'languages', angleDeg: 225, radius: CAT_R,
    icon: '💻', color: catColors.languages.primary,
    description: 'Python automation, Advanced SQL, Jinja macros.',
  },
  {
    id: 'cat_devops', label: 'DevOps', sublabel: 'CI/CD & Infra',
    type: 'category', category: 'devops', angleDeg: 315, radius: CAT_R,
    icon: '⚙️', color: catColors.devops.primary,
    description: 'Docker, GitHub Actions, Git workflows.',
  },

  // ── PIPELINE SKILLS (clustered around 45°) ────────────────────────────
  {
    id: 'dbt', label: 'dbt', sublabel: '2+ yrs · Core/Cloud',
    type: 'skill', category: 'pipeline', angleDeg: 10, radius: SKILL_R,
    icon: '🔷', proficiency: 80, color: catColors.pipeline.primary,
    description: 'Incremental models, macros, Jinja, schema.yml automation.',
  },
  {
    id: 'airflow', label: 'Airflow', sublabel: '1+ yr · Orchestration',
    type: 'skill', category: 'pipeline', angleDeg: 45, radius: SKILL_R,
    icon: '🌊', proficiency: 70, color: catColors.pipeline.primary,
    description: 'Dynamic DAG factory, conditional execution, 99.9% SLA.',
  },
  {
    id: 'sql_server', label: 'SQL Server', sublabel: '1.5+ yrs · Legacy DB',
    type: 'skill', category: 'pipeline', angleDeg: 80, radius: SKILL_R,
    icon: '🗃️', proficiency: 80, color: catColors.pipeline.primary,
    description: 'Stored procedures, legacy migrations — migrated to Athena.',
  },

  // ── CLOUD SKILLS (clustered around 135°) ─────────────────────────────
  {
    id: 'athena', label: 'Athena', sublabel: '3+ yrs · Serverless SQL',
    type: 'skill', category: 'cloud', angleDeg: 100, radius: SKILL_R,
    icon: '🔍', proficiency: 85, color: catColors.cloud.primary,
    description: 'Serverless analytics, 35% cost reduction, partition optimization.',
  },
  {
    id: 's3', label: 'S3', sublabel: '3+ yrs · Data lake',
    type: 'skill', category: 'cloud', angleDeg: 135, radius: SKILL_R,
    icon: '🪣', proficiency: 82, color: catColors.cloud.primary,
    description: 'Data lake, parquet/snappy, lifecycle policies, partitioning.',
  },
  {
    id: 'glue', label: 'AWS Glue', sublabel: '2+ yrs · Catalog',
    type: 'skill', category: 'cloud', angleDeg: 170, radius: SKILL_R,
    icon: '🔗', proficiency: 72, color: catColors.cloud.primary,
    description: 'Data catalog, schema discovery, Athena integration.',
  },

  // ── LANGUAGE SKILLS (clustered around 225°) ───────────────────────────
  {
    id: 'python', label: 'Python', sublabel: '2+ yrs · Scripting',
    type: 'skill', category: 'languages', angleDeg: 195, radius: SKILL_R,
    icon: '🐍', proficiency: 75, color: catColors.languages.primary,
    description: 'Pandas, Boto3, file automation, Flask APIs, dbt schema gen.',
  },
  {
    id: 'sql', label: 'SQL', sublabel: '1.5+ yrs · Advanced',
    type: 'skill', category: 'languages', angleDeg: 230, radius: SKILL_R,
    icon: '📊', proficiency: 80, color: catColors.languages.primary,
    description: 'CTEs, window functions, stored procedures, query optimization.',
  },
  {
    id: 'jinja', label: 'Jinja', sublabel: 'Templating · dbt macros',
    type: 'skill', category: 'languages', angleDeg: 262, radius: SKILL_R,
    icon: '📝', proficiency: 70, color: catColors.languages.primary,
    description: 'dbt macro language, dynamic SQL generation, schema injection.',
  },

  // ── DEVOPS SKILLS (clustered around 315°) ────────────────────────────
  {
    id: 'docker', label: 'Docker', sublabel: '1.5+ yrs · Containers',
    type: 'skill', category: 'devops', angleDeg: 283, radius: SKILL_R,
    icon: '🐳', proficiency: 70, color: catColors.devops.primary,
    description: 'Containerization, microservices, Airflow deployment.',
  },
  {
    id: 'github_actions', label: 'GH Actions', sublabel: '1+ yr · CI/CD',
    type: 'skill', category: 'devops', angleDeg: 318, radius: SKILL_R,
    icon: '🔁', proficiency: 60, color: catColors.devops.primary,
    description: 'Automated testing, dbt CI runs, deployment pipelines.',
  },
  {
    id: 'git', label: 'Git', sublabel: 'Version control',
    type: 'skill', category: 'devops', angleDeg: 352, radius: SKILL_R,
    icon: '🌿', proficiency: 82, color: catColors.devops.primary,
    description: 'Branching strategy, PR workflows, code review.',
  },
];

// ── Cross-skill edges — only the 8 most meaningful workflow connections ────
// These are the only edges drawn. No center→cat or cat→skill.
// At rest: nearly invisible. On hover: that node's connections light up.
export const skillEdges: SkillEdge[] = [
  { from: 'airflow',    to: 'dbt',        label: 'orchestrates'         },
  { from: 'dbt',        to: 'athena',     label: 'runs queries on'      },
  { from: 'athena',     to: 's3',         label: 'reads data from'      },
  { from: 'python',     to: 'airflow',    label: 'writes DAGs in'       },
  { from: 'python',     to: 'dbt',        label: 'generates schema.yml' },
  { from: 'sql',        to: 'dbt',        label: 'language of models'   },
  { from: 'jinja',      to: 'dbt',        label: 'macro language'       },
  { from: 'docker',     to: 'airflow',    label: 'containerizes'        },
  { from: 'sql_server', to: 'athena',     label: 'migrated to'          },
  { from: 'glue',       to: 'athena',     label: 'schema registry'      },
  { from: 'github_actions', to: 'dbt',    label: 'CI runs'              },
];