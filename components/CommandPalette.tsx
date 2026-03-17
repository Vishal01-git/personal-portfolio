"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Database, Cpu, Terminal, User, Mail, Search, Clock, ArrowRight, Hash, X, GitBranch } from 'lucide-react';
import { links } from '@/data/links';

const RECENT_KEY = 'cmd_palette_recent';
const MAX_RECENT = 4;

const COMMANDS = [
  { id: 'home',         label: 'Home',              sublabel: 'Hero & pipeline overview',   href: '/',               icon: <Hash className="w-4 h-4" />,       category: 'Pages' },
  { id: 'architecture', label: 'Architecture Lab',  sublabel: 'Code patterns & dry runs',  href: '/architecture',   icon: <Network className="w-4 h-4" />,    category: 'Pages' },
  { id: 'projects',     label: 'Projects',          sublabel: 'Production deployments',    href: '/projects',       icon: <Database className="w-4 h-4" />,   category: 'Pages' },
  { id: 'skills',       label: 'Skills',            sublabel: 'Technical infrastructure',  href: '/skills',         icon: <Cpu className="w-4 h-4" />,         category: 'Pages' },
  { id: 'experience',   label: 'Experience',        sublabel: 'Career timeline',           href: '/experience',     icon: <Terminal className="w-4 h-4" />,   category: 'Pages' },
  { id: 'resume',       label: 'Resume Pipeline',   sublabel: 'Career as a dbt DAG',       href: '/resume',         icon: <GitBranch className="w-4 h-4" />,  category: 'Pages' },
  { id: 'about',        label: 'About',             sublabel: 'System profile',            href: '/about',          icon: <User className="w-4 h-4" />,        category: 'Pages' },
  { id: 'contact',      label: 'Contact',           sublabel: 'Initialize connection',     href: '/contact',        icon: <Mail className="w-4 h-4" />,        category: 'Pages' },
  { id: 'github',       label: 'GitHub',            sublabel: links.githubHandle,          href: links.github,      icon: <ArrowRight className="w-4 h-4" />,  category: 'Links' },
  { id: 'linkedin',     label: 'LinkedIn',          sublabel: links.linkedinHandle,        href: links.linkedin,    icon: <ArrowRight className="w-4 h-4" />,  category: 'Links' },
  { id: 'resume_pdf',   label: 'Download Resume',   sublabel: 'PDF · latest version',      href: links.resume,      icon: <ArrowRight className="w-4 h-4" />,  category: 'Links' },
];

function fuzzyMatch(query: string, target: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}

function pushRecent(id: string) {
  try {
    const prev = getRecent().filter(r => r !== id);
    localStorage.setItem(RECENT_KEY, JSON.stringify([id, ...prev].slice(0, MAX_RECENT)));
  } catch {}
}

export function CommandPalette() {
  const [open,     setOpen]     = useState(false);
  const [query,    setQuery]    = useState('');
  const [selected, setSelected] = useState(0);
  const [recent,   setRecent]   = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  useEffect(() => { if (open) setRecent(getRecent()); }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); setOpen(p => !p); setQuery(''); setSelected(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  const results    = COMMANDS.filter(c => fuzzyMatch(query, c.label) || fuzzyMatch(query, c.sublabel));
  const recentCmds = !query ? recent.map(id => COMMANDS.find(c => c.id === id)).filter(Boolean) as typeof COMMANDS : [];
  const otherCmds  = !query ? COMMANDS.filter(c => !recent.includes(c.id)) : results;
  const allVisible = [...recentCmds, ...otherCmds];

  useEffect(() => { setSelected(s => Math.min(s, Math.max(0, allVisible.length - 1))); }, [allVisible.length]);

  const navigate = useCallback((cmd: typeof COMMANDS[0]) => {
    pushRecent(cmd.id);
    setOpen(false); setQuery('');
    if (cmd.href.startsWith('http') || cmd.href.startsWith('/resume.pdf')) {
      window.open(cmd.href, '_blank');
    } else {
      router.push(cmd.href);
    }
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, allVisible.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && allVisible[selected]) navigate(allVisible[selected]);
  };

  const grouped = query
    ? Object.entries(results.reduce((acc, cmd) => { acc[cmd.category] = [...(acc[cmd.category] || []), cmd]; return acc; }, {} as Record<string, typeof COMMANDS>))
    : null;

  let globalIdx = 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <motion.div initial={{ opacity: 0, scale: 0.96, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }} transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-[201] w-full max-w-xl px-4"
          >
            <div className="bg-surface border border-white/10 rounded-2xl shadow-elevation overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
                <Search className="w-4 h-4 text-textSecondary shrink-0" />
                <input ref={inputRef} value={query}
                  onChange={e => { setQuery(e.target.value); setSelected(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages, links..."
                  className="flex-1 bg-transparent text-textPrimary placeholder:text-textSecondary font-mono text-sm outline-none"
                />
                {query && <button onClick={() => setQuery('')} className="text-textSecondary hover:text-textPrimary transition-colors"><X className="w-3.5 h-3.5" /></button>}
                <kbd className="hidden sm:flex items-center text-[10px] font-mono text-textTertiary bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">esc</kbd>
              </div>

              <div className="max-h-[340px] overflow-y-auto py-2">
                {allVisible.length === 0 && (
                  <div className="px-4 py-8 text-center text-textSecondary font-mono text-sm">No results for "{query}"</div>
                )}
                {query && grouped && grouped.map(([category, cmds]) => (
                  <div key={category}>
                    <div className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-textTertiary">{category}</div>
                    {cmds.map(cmd => { const idx = globalIdx++; return <CommandRow key={cmd.id} cmd={cmd} isSelected={idx === selected} onHover={() => setSelected(idx)} onClick={() => navigate(cmd)} />; })}
                  </div>
                ))}
                {!query && (
                  <>
                    {recentCmds.length > 0 && (
                      <div>
                        <div className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-textTertiary flex items-center gap-1.5"><Clock className="w-3 h-3" /> Recent</div>
                        {recentCmds.map(cmd => { const idx = globalIdx++; return <CommandRow key={cmd.id} cmd={cmd} isSelected={idx === selected} onHover={() => setSelected(idx)} onClick={() => navigate(cmd)} />; })}
                      </div>
                    )}
                    <div>
                      <div className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-textTertiary">All</div>
                      {otherCmds.map(cmd => { const idx = globalIdx++; return <CommandRow key={cmd.id} cmd={cmd} isSelected={idx === selected} onHover={() => setSelected(idx)} onClick={() => navigate(cmd)} />; })}
                    </div>
                  </>
                )}
              </div>

              <div className="px-4 py-2 border-t border-white/8 flex items-center gap-4 text-[10px] font-mono text-textTertiary">
                <span className="flex items-center gap-1"><kbd className="bg-white/5 border border-white/10 px-1 rounded">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-white/5 border border-white/10 px-1 rounded">↵</kbd> open</span>
                <span className="flex items-center gap-1"><kbd className="bg-white/5 border border-white/10 px-1 rounded">esc</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CommandRow({ cmd, isSelected, onHover, onClick }: { cmd: typeof COMMANDS[0]; isSelected: boolean; onHover: () => void; onClick: () => void }) {
  const rowRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (isSelected) rowRef.current?.scrollIntoView({ block: 'nearest' }); }, [isSelected]);
  return (
    <button ref={rowRef} onMouseEnter={onHover} onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${isSelected ? 'bg-primaryGlow/10' : 'hover:bg-white/4'}`}
    >
      <div className={`shrink-0 transition-colors ${isSelected ? 'text-primaryGlow' : 'text-textSecondary'}`}>{cmd.icon}</div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-textPrimary/80'}`}>{cmd.label}</div>
        <div className="text-xs font-mono text-textSecondary truncate">{cmd.sublabel}</div>
      </div>
      {isSelected && <ArrowRight className="w-3.5 h-3.5 text-primaryGlow shrink-0" />}
    </button>
  );
}

export function CommandPaletteTrigger() {
  return (
    <button
      onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))}
      className="hidden md:flex items-center gap-2 text-xs font-mono text-textSecondary bg-white/5 hover:bg-white/8 border border-white/10 hover:border-primaryGlow/30 px-3 py-1.5 rounded-lg transition-all"
    >
      <Search className="w-3 h-3" />
      <span>Search</span>
      <kbd className="flex items-center gap-0.5 text-[10px] text-textTertiary ml-1"><span>⌘</span><span>K</span></kbd>
    </button>
  );
}