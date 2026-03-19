"use client";

import React, { useState } from 'react';
import { 
  Database, Github, Linkedin, ChevronDown, ChevronRight, Folder, 
  Plug, Play, History, CheckCircle2 
} from 'lucide-react';
import { links } from '@/data/links';

const FORMSPREE_URL = "https://formspree.io/f/xqeylrjn";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST", body: new FormData(form), headers: { Accept: "application/json" },
      });
      if (res.ok) { setStatus("sent"); form.reset(); } else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-20 flex flex-col items-center min-h-[85vh] bg-white dark:bg-background text-textPrimary">
      
      {/* Universal Heading */}
      <div className="text-center mb-10 md:mb-16 space-y-4 w-full">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-textPrimary">
          Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">Connect</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto text-sm md:text-base">
          Whether you're hiring, building something interesting, or just want to talk data engineering—my inbox is open.
        </p>
      </div>

      {/* ── DESKTOP VARIANT (IDE Style) ── */}
      <div className="hidden md:flex flex-row w-full h-[750px] max-h-[85vh] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-md dark:shadow-xl bg-surface">
        
        {/* Sidebar (Auth Items equivalent) */}
        <div className="w-64 shrink-0 flex flex-col border-r border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/25">
          <div className="px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-textTertiary border-b border-black/5 dark:border-white/5 relative">
            <div className="absolute top-0 right-0 p-2 flex gap-1.5 opacity-40">
               <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
               <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
               <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            Explorer
          </div>
          {/* Folder tree */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 select-none">
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-textSecondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-textPrimary rounded cursor-pointer transition-colors">
              <ChevronDown className="w-3.5 h-3.5 shrink-0"/>
              <Folder className="w-4 h-4 text-accent shrink-0"/>
              <span className="truncate">portfolio_project</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1.5 pl-6 text-sm text-textSecondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-textPrimary rounded cursor-pointer transition-colors">
              <ChevronRight className="w-3.5 h-3.5 shrink-0"/>
              <Folder className="w-4 h-4 text-accent shrink-0"/>
              <span className="truncate">schema</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1.5 pl-6 text-sm text-textSecondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-textPrimary rounded cursor-pointer transition-colors">
              <ChevronDown className="w-3.5 h-3.5 shrink-0"/>
              <Folder className="w-4 h-4 text-accent shrink-0"/>
              <span className="truncate">queries</span>
            </div>
            
            {/* Active file */}
            <div className="flex items-center gap-1.5 px-2 py-1.5 pl-10 text-sm bg-black/5 dark:bg-white/10 text-primaryGlow rounded border border-black/5 dark:border-white/5 relative cursor-default">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-full bg-primaryGlow rounded-r-md" />
              <Database className="w-3.5 h-3.5 text-primaryGlow shrink-0"/>
              <span className="truncate font-medium">contact.sql</span>
            </div>
          </div>

          <div className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-widest text-textTertiary border-t border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20">
            Network
          </div>
          <div className="px-2 py-3 space-y-1 select-none flex-shrink-0">
            <a href={links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-3 py-2 text-sm text-textSecondary hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors group">
              <Github className="w-4 h-4 group-hover:text-primaryGlow transition-colors"/> GitHub
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-3 py-2 text-sm text-textSecondary hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors group">
              <Linkedin className="w-4 h-4 group-hover:text-primaryGlow transition-colors"/> LinkedIn
            </a>
          </div>
        </div>

        {/* Main Editor Area (HTTP POST equivalent) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117] border-l border-white/5 relative z-0">
          {/* Tab bar */}
          <div className="flex bg-black/20 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2 px-6 py-2.5 border-t-2 border-t-primaryGlow bg-[#0d1117] border-r border-r-white/10 text-sm font-mono text-primaryGlow select-none">
              <Database className="w-4 h-4"/> contact.sql
              <span className="ml-2 w-2 h-2 rounded-full bg-primaryGlow opacity-40" />
            </div>
          </div>
          
          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto px-4 py-6 font-mono text-sm leading-relaxed flex relative text-gray-300 shadow-inner">
            {/* Line Numbers */}
            <div className="flex flex-col text-right text-white/10 select-none pr-5 shrink-0 tabular-nums">
              {[...Array(16)].map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            
            {/* Code Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col z-10 w-full max-w-2xl">
              <div className="text-pink-400">CREATE TABLE <span className="text-gray-400">Contact_Requests (</span></div>
              <div className="pl-8"><span className="text-cyan-400">id</span> INT PRIMARY KEY AUTO_INCREMENT,</div>
              <div className="pl-8"><span className="text-cyan-400">name</span> VARCHAR(255),</div>
              <div className="pl-8"><span className="text-cyan-400">email</span> VARCHAR(255),</div>
              <div className="pl-8"><span className="text-cyan-400">message</span> TEXT</div>
              <div><span className="text-gray-400">);</span></div>
              <br/>
              <div className="text-pink-400">INSERT INTO <span className="text-gray-400">Contact_Requests (name, email, message)</span></div>
              <div className="text-pink-400">VALUES <span className="text-gray-400">(</span></div>
              
              <div className="pl-8 flex items-center gap-2 my-1">
                <span className="text-yellow-300">'</span>
                <input required name="name" type="text" placeholder="Enter your name..." disabled={status==='sending'||status==='sent'}
                  className="bg-transparent dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg p-2.5 text-textPrimary text-sm placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-primaryGlow/50 transition-colors shadow-sm w-[280px]"
                />
                <span className="text-yellow-300">',</span>
              </div>
              <div className="pl-8 flex items-center gap-2 my-1">
                <span className="text-yellow-300">'</span>
                <input required name="email" type="email" placeholder="Enter your email..." disabled={status==='sending'||status==='sent'}
                  className="bg-transparent dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg p-2.5 text-textPrimary text-sm placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-primaryGlow/50 transition-colors shadow-sm w-[280px]"
                />
                <span className="text-yellow-300">',</span>
              </div>
              <div className="pl-8 flex gap-2 my-1 items-start">
                <span className="text-yellow-300 mt-2">'</span>
                <textarea required name="message" rows={3} placeholder="Enter message body..." disabled={status==='sending'||status==='sent'}
                  className="bg-transparent dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg p-2.5 text-textPrimary text-sm placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-primaryGlow/50 transition-colors shadow-sm w-[360px] resize-none"
                />
                <span className="text-yellow-300 mt-2">'</span>
              </div>
              <div><span className="text-gray-400">);</span></div>
              
              <div className="mt-8 mb-4 pl-[4.5rem]">
                <button type="submit" disabled={status === 'sending' || status === 'sent'}
                  className="bg-gray-900 hover:bg-black dark:bg-gradient-to-r dark:from-primaryGlow dark:to-secondaryGlow text-white border border-gray-800 dark:border-borderStrong shadow-sm transition-all px-6 py-3 rounded-lg font-mono font-bold flex items-center gap-3 active:scale-[0.98]"
                >
                  <span className="text-secondaryGlow font-bold">&gt;</span> 
                  {status === 'idle'    && 'EXECUTE COMMIT;'}
                  {status === 'sending' && <span className="animate-pulse">PROCESSING...</span>}
                  {status === 'sent'    && 'COMMIT SUCCESSFUL'}
                  {status === 'error'   && 'RETRY EXECUTION'}
                </button>
              </div>
            </form>
          </div>

          {/* Terminal Pane */}
          <div className="h-44 border-t border-white/10 bg-[#07090e] flex flex-col shrink-0 z-10">
            <div className="flex px-5 py-2 border-b border-white/5 text-xs font-mono text-textSecondary uppercase tracking-widest gap-2 bg-black/40">
               &gt;_ terminal
            </div>
            <div className="flex-1 p-5 font-mono text-[13px] overflow-y-auto leading-loose text-gray-400">
              <div className="text-textSecondary mb-2">&gt; tail -f /var/log/transactions.log</div>
              
              {status === 'idle' && (
                <div className="flex items-center gap-2 opacity-50">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                  Awaiting transaction commit parameters...
                </div>
              )}
              {status === 'sending' && (
                <div className="flex items-center gap-2 text-primaryGlow animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-primaryGlow" />
                  Executing query... establishing secure connection.
                </div>
              )}
              {status === 'sent' && (
                <div className="text-green-600 dark:text-green-400 space-y-1.5 font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                     Query executed successfully.
                  </div>
                  <div className="pl-3.5 opacity-80 font-normal">1 row affected (pending approval) — 200 OK</div>
                </div>
              )}
              {status === 'error' && (
                <div className="text-red-500 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                     ERROR 1064 (42000): Host connection refused.
                  </div>
                  <div className="pl-3.5 opacity-60">Transaction rolled back. Check network.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE VARIANT (DB Parameters Style) ── */}
      <div className="flex md:hidden flex-col w-full max-w-sm mx-auto">
        <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-md dark:shadow-xl bg-surface">
          {/* Tabs */}
          <div className="flex bg-black/5 dark:bg-black/40 border-b border-black/10 dark:border-white/10">
            <div className="flex-1 py-3.5 flex flex-col items-center justify-center gap-1.5 border-b-[3px] border-primaryGlow text-textPrimary bg-primaryGlow/5">
               <Plug className="w-4 h-4 text-primaryGlow"/>
               <span className="text-[9px] uppercase font-mono tracking-widest text-primaryGlow">Connect</span>
            </div>
            <div className="flex-1 py-3.5 flex flex-col items-center justify-center gap-1.5 border-b-[3px] border-transparent text-textSecondary border-l border-black/5 dark:border-white/5 disabled opacity-60">
               <Play className="w-4 h-4"/>
               <span className="text-[9px] uppercase font-mono tracking-widest">Execute</span>
            </div>
            <div className="flex-1 py-3.5 flex flex-col items-center justify-center gap-1.5 border-b-[3px] border-transparent text-textSecondary border-l border-black/5 dark:border-white/5 disabled opacity-60">
               <History className="w-4 h-4"/>
               <span className="text-[9px] uppercase font-mono tracking-widest">Rollback</span>
            </div>
          </div>
          
          <div className="p-5">
            <h3 className="font-mono text-sm text-textPrimary mb-5 font-medium tracking-wide">Contact_Requests Parameters</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-black/5 dark:bg-[#0a0f1c] shadow-inner">
                {/* Table Header */}
                <div className="grid grid-cols-[85px_60px_1fr] bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest text-textTertiary">
                  <div>Parameter</div>
                  <div>Type</div>
                  <div>Value</div>
                </div>
                
                {/* Rows */}
                <style>{`
                  .mobile-input:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 50px white inset !important;
                    -webkit-text-fill-color: black !important;
                  }
                  .dark .mobile-input:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 50px #0a0f1c inset !important;
                    -webkit-text-fill-color: white !important;
                  }
                `}</style>
                <div className="grid grid-cols-[85px_60px_1fr] border-b border-black/10 dark:border-white/10 p-3 items-center gap-2">
                   <div className="text-xs font-mono text-textPrimary/80">Name</div>
                   <div className="text-[10px] font-mono text-textSecondary">VARCHAR</div>
                   <div className="flex-1">
                     <input required name="name" type="text" placeholder="[Enter name]" disabled={status==='sending'||status==='sent'}
                        className="bg-transparent dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg p-2.5 text-textPrimary text-sm placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-primaryGlow/50 transition-colors shadow-sm w-full"
                     />
                   </div>
                </div>
                <div className="grid grid-cols-[85px_60px_1fr] border-b border-black/10 dark:border-white/10 p-3 items-center gap-2">
                   <div className="text-xs font-mono text-textPrimary/80">Email</div>
                   <div className="text-[10px] font-mono text-textSecondary">VARCHAR</div>
                   <div className="flex-1">
                     <input required name="email" type="email" placeholder="[Enter email]" disabled={status==='sending'||status==='sent'}
                        className="bg-transparent dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg p-2.5 text-textPrimary text-sm placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-primaryGlow/50 transition-colors shadow-sm w-full"
                     />
                   </div>
                </div>
                <div className="grid grid-cols-[85px_60px_1fr] p-3 items-start gap-2">
                   <div className="text-xs font-mono text-textPrimary/80 mt-2">Message</div>
                   <div className="text-[10px] font-mono text-textSecondary mt-2.5">TEXT</div>
                   <div className="flex-1">
                     <textarea required name="message" rows={3} placeholder="[Enter message]" disabled={status==='sending'||status==='sent'}
                        className="bg-transparent dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg p-2.5 text-textPrimary text-sm placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-primaryGlow/50 transition-colors shadow-sm w-full resize-none"
                     />
                   </div>
                </div>
              </div>

              {/* Status Messages */}
              {status === 'error' && (
                <div className="text-[11px] font-mono text-red-500 text-center pt-1 font-bold">
                  Transaction failed. Try emailing directly.
                </div>
              )}
              {status === 'sent' && (
                <div className="text-green-600 dark:text-green-400 text-[11px] font-mono text-center pt-1 font-bold">
                   COMMIT SUCCESSFUL — 200 OK
                </div>
              )}

              <button type="submit" disabled={status === 'sending' || status === 'sent'}
                className="w-full bg-gray-900 hover:bg-black dark:bg-gradient-to-r dark:from-primaryGlow dark:to-secondaryGlow text-white border border-gray-800 dark:border-borderStrong shadow-sm transition-all h-12 rounded-xl flex items-center justify-center gap-2.5 font-mono text-xs font-bold tracking-widest active:scale-[0.98]"
              >
                  {status === 'idle'    && <><Play className="w-3.5 h-3.5 fill-current" /> COMMIT</>}
                  {status === 'sending' && <><span className="shrink-0 animate-pulse">▶</span> PROCESSING</>}
                  {status === 'sent'    && <><CheckCircle2 className="w-4 h-4" /> SUCCESS</>}
                  {status === 'error'   && <><Play className="w-3.5 h-3.5 fill-current" /> RETRY</>}
              </button>

            </form>
          </div>
        </div>
        
        {/* Mobile Network Links (GitHub, LinkedIn) */}
        <div className="mt-8 flex justify-center gap-4 border-t border-black/5 dark:border-white/5 pt-6">
           <a href={links.github} target="_blank" rel="noreferrer" className="text-textSecondary hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 transition-colors flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full">
             <Github className="w-3.5 h-3.5"/> GitHub
           </a>
           <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-textSecondary hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 transition-colors flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full">
             <Linkedin className="w-3.5 h-3.5"/> LinkedIn
           </a>
        </div>
      </div>
    </div>
  );
}



