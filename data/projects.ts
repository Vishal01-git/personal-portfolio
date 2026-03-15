// ─── Projects ──────────────────────────────────────────────────────────────
// Add or edit projects here. The page renders everything automatically.
// github / demo: use "#" if not yet public, or remove the key entirely to hide the button.

export type LineageLayer = 'source' | 'staging' | 'intermediate' | 'mart' | 'output';

export interface LineageNode {
  id:       string;
  label:    string;
  sublabel?: string;
  layer:    LineageLayer;
}

export interface LineageEdge {
  from: string;
  to:   string;
}

export interface Project {
  id:          number;
  title:       string;
  description: string;
  tech:        string[];
  github?:     string;   // omit to hide Source button
  demo?:       string;   // omit to hide Live Demo button

  // Pipeline topology — ordered list of node labels for the horizontal flow diagram
  // Each entry: { label, glowColor: "primary"|"secondary"|"accent"|"none" }
  topology: { label: string; glowColor: 'primary' | 'secondary' | 'accent' | 'none' }[];

  // Data lineage DAG
  lineage: {
    nodes: LineageNode[];
    edges: LineageEdge[];
  };
}

export const projects: Project[] = [
  {
    id: 1,
    title:       'Job Market Arbitrage Data Platform',
    description: 'An end-to-end data pipeline that extracts job market data to identify arbitrage opportunities — skills in demand vs. skills in supply by region.',
    tech:        ['Terraform', 'GitHub Actions', 'Python', 'Docker', 'Airflow', 'dbt', 'AWS Athena', 'Streamlit'],
    github:      '#',
    demo:        '#',

    topology: [
      { label: 'Terraform & CI/CD',  glowColor: 'none'      },
      { label: 'Python/Docker',      glowColor: 'primary'   },
      { label: 'Airflow',            glowColor: 'secondary' },
      { label: 'dbt + Athena',       glowColor: 'accent'    },
      { label: 'Streamlit',          glowColor: 'primary'   },
    ],

    lineage: {
      nodes: [
        { id: 'jobs_api',     label: 'Jobs API',         sublabel: 'LinkedIn / Indeed',  layer: 'source'       },
        { id: 'skills_csv',   label: 'Skills CSV',       sublabel: 'Static seed data',   layer: 'source'       },
        { id: 'stg_jobs',     label: 'stg_jobs',         sublabel: 'Staging',            layer: 'staging'      },
        { id: 'stg_skills',   label: 'stg_skills',       sublabel: 'Staging',            layer: 'staging'      },
        { id: 'int_postings', label: 'int_job_postings', sublabel: 'Deduplicated',       layer: 'intermediate' },
        { id: 'int_demand',   label: 'int_skill_demand', sublabel: 'Aggregated',         layer: 'intermediate' },
        { id: 'mrt_arb',      label: 'mrt_arbitrage',   sublabel: 'Mart',               layer: 'mart'         },
        { id: 'streamlit',    label: 'Streamlit App',    sublabel: 'BI / Dashboard',     layer: 'output'       },
      ],
      edges: [
        { from: 'jobs_api',     to: 'stg_jobs'     },
        { from: 'skills_csv',   to: 'stg_skills'   },
        { from: 'stg_jobs',     to: 'int_postings' },
        { from: 'stg_skills',   to: 'int_demand'   },
        { from: 'int_postings', to: 'mrt_arb'      },
        { from: 'int_demand',   to: 'mrt_arb'      },
        { from: 'mrt_arb',      to: 'streamlit'    },
      ],
    },
  },

  {
    id: 2,
    title:       'Automated Data Validation Accelerator',
    description: 'A custom web application that accelerates data migration testing by automating schema, count, and row-level data checks between legacy SQL Server databases and cloud data lakes.',
    tech:        ['Python', 'Streamlit', 'Pandas', 'PyAthena', 'PyODBC'],
    github:      '#',
    // demo not set — Live Demo button will not render

    topology: [
      { label: 'SQL Server & Athena',   glowColor: 'none'      },
      { label: 'Python Validator',      glowColor: 'primary'   },
      { label: 'Report Generator',      glowColor: 'secondary' },
      { label: 'Streamlit UI',          glowColor: 'accent'    },
    ],

    lineage: {
      nodes: [
        { id: 'sqlserver',   label: 'SQL Server',  sublabel: 'Legacy source',      layer: 'source'       },
        { id: 'athena',      label: 'AWS Athena',  sublabel: 'Cloud target',       layer: 'source'       },
        { id: 'stg_legacy',  label: 'stg_legacy',  sublabel: 'Schema extracted',   layer: 'staging'      },
        { id: 'stg_cloud',   label: 'stg_cloud',   sublabel: 'Schema extracted',   layer: 'staging'      },
        { id: 'int_checks',  label: 'int_checks',  sublabel: 'Row/count/schema',   layer: 'intermediate' },
        { id: 'mrt_results', label: 'mrt_results', sublabel: 'Validation results', layer: 'mart'         },
        { id: 'html_report', label: 'HTML Report', sublabel: 'Export',             layer: 'output'       },
        { id: 'streamlit2',  label: 'Streamlit UI',sublabel: 'Live dashboard',     layer: 'output'       },
      ],
      edges: [
        { from: 'sqlserver',   to: 'stg_legacy'  },
        { from: 'athena',      to: 'stg_cloud'   },
        { from: 'stg_legacy',  to: 'int_checks'  },
        { from: 'stg_cloud',   to: 'int_checks'  },
        { from: 'int_checks',  to: 'mrt_results' },
        { from: 'mrt_results', to: 'html_report' },
        { from: 'mrt_results', to: 'streamlit2'  },
      ],
    },
  },
];