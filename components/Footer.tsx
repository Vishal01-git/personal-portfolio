import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { links } from '@/data/links';
import { meta } from '@/data/meta';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-surface/30 backdrop-blur-md mt-20 relative z-20">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primaryGlow animate-pulse shadow-neon-glow" />
          <span className="font-mono text-sm text-textSecondary">
            © {new Date().getFullYear()} {meta.name}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a href={links.github} target="_blank" rel="noreferrer" className="text-textSecondary hover:text-primaryGlow transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-textSecondary hover:text-primaryGlow transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href={`mailto:${links.email}`} className="text-textSecondary hover:text-primaryGlow transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}