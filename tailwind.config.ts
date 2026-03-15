import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./design-system/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        primaryGlow: "var(--primaryGlow)",
        secondaryGlow: "var(--secondaryGlow)",
        accent: "var(--accent)",
        textPrimary: "var(--textPrimary)",
        textSecondary: "var(--textSecondary)",
        pipelineGlow: "var(--pipelineGlow)",
        processingGlow: "var(--processingGlow)",
        storageGlow: "var(--storageGlow)",
        textTertiary: "var(--textTertiary)",
        statusSuccess: "var(--statusSuccess)",
        statusError: "var(--statusError)",
        statusWarning: "var(--statusWarning)",
        statusInfo: "var(--statusInfo)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        "soft-glass": "var(--shadow-soft-glass)",
        "neon-glow": "var(--shadow-neon-glow)",
        elevation: "var(--shadow-elevation)",
      },
    },
  },
  plugins: [],
};
export default config;
