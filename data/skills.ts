// ─── Skills ────────────────────────────────────────────────────────────────
// Edit skills, proficiency, and Core Fundamentals content here.

// ── Types ──────────────────────────────────────────────────────────────────
export type SkillColor = 'primary' | 'secondary' | 'accent';
export type SkillTier  = 'core' | 'familiar';
export type LogLevel   = 'ok' | 'run';

export interface Skill {
  id:          string;
  name:        string;
  category:    string;
  exp:         string;         // e.g. "4+ Years"
  proficiency: number;         // 0–100, used for the fill bar
  tier:        SkillTier;      // "core" | "familiar"
  color:       SkillColor;
  projects:    string[];       // key implementations shown in detail card
}

export interface LogEntry {
  level: LogLevel;             // "ok" | "run"
  text:  string;
  // offsetSecondsAgo: how many seconds before page load this "happened"
  offsetSecondsAgo: number;
}

export interface FundamentalProcess {
  title: string;
  sub:   string;               // e.g. "Python · C++"
  logs:  LogEntry[];
}

// ── Skills data ────────────────────────────────────────────────────────────
// tier: "core" = used daily, appears in top section
//       "familiar" = appears below the divider
// proficiency: honest number — shown as fill bar + percentage
export const skills: Skill[] = [
  {
    id: 'sql', name: 'Advanced SQL', category: 'Language',
    exp: '1.5+ Years', proficiency: 80, tier: 'core', color: 'primary',
    projects: ['CTEs', 'Window Functions', 'Stored Procedures'],
  },
  {
    id: 'sqlserver', name: 'SQL Server', category: 'Database',
    exp: '1.5+ Years', proficiency: 80, tier: 'core', color: 'primary',
    projects: ['Stored Procedures', 'Legacy Migrations'],
  },
  {
    id: 'python', name: 'Python', category: 'Language',
    exp: '2+ Years', proficiency: 75, tier: 'core', color: 'secondary',
    projects: ['Pandas', 'Boto3', 'File Automation'],
  },
  {
    id: 'aws', name: 'AWS Athena', category: 'Cloud Query',
    exp: '3+ Years', proficiency: 85, tier: 'core', color: 'primary',
    projects: ['Athena', 'Glue','RedShift'],
  },
  {
    id: 'airflow', name: 'Apache Airflow', category: 'Orchestration',
    exp: '1+ Years', proficiency: 70, tier: 'core', color: 'secondary',
    projects: ['Dynamic DAGs', 'ETL/ELT Pipelines'],
  },
  {
    id: 'dbt', name: 'dbt (Core/Cloud)', category: 'Transform',
    exp: '2+ Years', proficiency: 80, tier: 'core', color: 'secondary',
    projects: ['Data Modeling', 'Incremental Loading', 'Macros'],
  },
  {
    id: 'aws_eco', name: 'AWS Ecosystem', category: 'Cloud',
    exp: '3+ Years', proficiency: 75, tier: 'core', color: 'primary',
    projects: ['S3', 'Glue', 'Lambda', 'Redshift', 'DynamoDB'],
  },
  {
    id: 'docker', name: 'Docker', category: 'Infrastructure',
    exp: '1.5+ Years', proficiency: 70, tier: 'familiar', color: 'secondary',
    projects: ['Containerization', 'Microservices'],
  },
  {
    id: 'github_actions', name: 'GitHub Actions', category: 'CI/CD',
    exp: '1+ Years', proficiency: 60, tier: 'familiar', color: 'primary',
    projects: ['Automated Testing', 'Deployment Pipelines'],
  },
];

// ── Core Fundamentals ──────────────────────────────────────────────────────
// careerStart: your first day in a data engineering role — drives the uptime clock
// processes: each card in the CoreFundamentals component
//   logs: offsetSecondsAgo = how many seconds before page load this log "ran"
//         set to 0 for the most recent entry, larger values for older ones

export const fundamentals = {
  careerStart: new Date('2024-01-05T09:00:00'),

  description: "Proficient in Data Structures & Algorithms with a solid understanding of System Design principles, enabling analysis of application internals and identification of performance bottlenecks and improvement areas.",

  processes: [
    {
      title: "DSA / Algorithms",
      sub:   "Java",
      logs: [
        { level: 'ok'  as LogLevel, text: 'Arrays,String,LinkedList,Sliding Window', offsetSecondsAgo: 68 },
        { level: 'run' as LogLevel, text: 'running test cases...',    offsetSecondsAgo: 28 },
        { level: 'ok'  as LogLevel, text: 'All passed',                  offsetSecondsAgo: 0  },
      ],
    },
    {
      title: "System Design",
      sub:   "Distributed · Fault-tolerant",
      logs: [
        { level: 'ok'  as LogLevel, text: 'Designed: rate limiter',     offsetSecondsAgo: 1566 },
        { level: 'run' as LogLevel, text: 'Review: consistent hashing', offsetSecondsAgo: 576  },
        { level: 'ok'  as LogLevel, text: 'Deployed to notes',          offsetSecondsAgo: 126  },
      ],
    },
  ] satisfies FundamentalProcess[],
};