// ─── Hero Page ─────────────────────────────────────────────────────────────
// Edit this file to update the homepage hero text and impact metrics.

export const hero = {
  // ── Heading ───────────────────────────────────────────────────────────────
  greeting:  "Hi, I'm",
  firstName: "Vishal",       // rendered in amber gradient
  role:      "Data Engineer",

  // ── Subtitle ──────────────────────────────────────────────────────────────
  subtitle: "Data Engineer who builds reliable pipelines, automates complex workflows, and designs data infrastructure that scales well and stays easy to maintain.",

  // ── Impact metrics (animated count-up cards) ─────────────────────────────
  // value: the number to count up to
  // suffix: appended after the number ("+" / "%" / "")
  // color: Tailwind text class using your palette tokens
  metrics: [
    { label: "pipelines shipped",    value: 4,    suffix: "",  color: "text-primaryGlow"  },
    { label: "dbt models owned",     value: 200,  suffix: "+", color: "text-secondaryGlow"},
    { label: "cost reduction",       value: 35,   suffix: "%", color: "text-accent"       },
    { label: "pipeline reliability", value: 99.9, suffix: "%", color: "text-primaryGlow"  },
  ],

  // ── CTA buttons ───────────────────────────────────────────────────────────
  ctas: {
    resume:       "Download Resume",
    exploreProjects:   "Explore Projects",
    architectureLab:   "Architecture Lab",
  },
};