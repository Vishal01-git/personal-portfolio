// ─── Experience ────────────────────────────────────────────────────────────
// Add / edit work experience and education here.
// type: "work" entries appear on the timeline, "education" appears below it.

export interface Experience {
  id:       number;
  type:     'work' | 'education';
  role:     string;
  company:  string;
  duration: string;
  projects: string[];   // bullet points — use action verbs, include metrics
}

export const experiences: Experience[] = [
  {
    id: 1,
    type: 'work',
    role: "Associate Engineer (Data Engineer)",
    company: "Virtusa Consulting Services Pvt. Ltd.",
    duration: "Jan 2024 - Present",
    projects: [
      "Led the end-to-end migration of legacy data pipelines from SQL Server Stored Procedures to AWS Athena using dbt, delivering four production-grade data products.",
      "Engineered a reusable union relation dbt macro, reducing code redundancy by 40%.",
      "Developed a Python automation tool to generate dbt schema.yml files, cutting manual documentation time by 50% across 200+ models.",
      "Optimized pipeline performance by implementing incremental models, reducing AWS Athena compute costs by 35% and decreasing query runtime by 60%.",
      "Orchestrated Apache Airflow workflows with dynamic DAGs, achieving 99.9% pipeline reliability.",
    ],
  },
  {
    id: 2,
    type: 'work',
    role: "Intern",
    company: "Virtusa Consulting Services Pvt. Ltd.",
    duration: "Jan 2023 - April 2023",
    projects: [
      "Established secure Virtual Private Clouds (VPC) on Google Cloud Platform (GCP) for 5+ critical microservices.",
      "Assisted in the secure migration of on-premise data to cloud storage, optimizing storage tiering for cost efficiency.",
      "Partnered with the DevOps team to streamline CI/CD deployment processes, contributing to a 20% improvement in project delivery speed.",
    ],
  },
  {
    id: 3,
    type: 'education',
    role: "B.Tech in Computer Science and Engineering",
    company: "Lovely Professional University",
    duration: "2019 - 2023",
    projects: [
      "Graduated with a CGPA of 8.02.",
      "Built foundational knowledge in Data Structures, Algorithms, and System Design.",
    ],
  },
];