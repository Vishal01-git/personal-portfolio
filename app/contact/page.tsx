"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Terminal, Send, Github, Linkedin, Mail, CheckCircle2 } from 'lucide-react';
import { links } from '@/data/links';

// ── Replace YOUR_FORM_ID with your Formspree endpoint ─────────────────────
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
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-20 flex flex-col items-center min-h-[80vh]">
      <div className="text-center mb-16 space-y-4 w-full">
        <h1 className="text-4xl md:text-5xl font-bold font-heading">
          Initialize <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryGlow to-secondaryGlow">Connection</span>
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          Establish a direct protocol link to discuss data architecture, pipelines, or engineering roles.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 w-full">
        <div className="flex-[2]">
          <GlassCard className="p-0 overflow-hidden border-white/10">
            <div className="bg-black/60 px-4 py-3 border-b border-white/10 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-primaryGlow/80 shadow-neon-glow" />
              </div>
              <span className="font-mono text-xs text-textSecondary uppercase tracking-widest pl-2">POST /api/contact</span>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {[
                { name: 'name',    type: 'text',  label: 'payload.name',    placeholder: 'Enter your name...'    },
                { name: 'email',   type: 'email', label: 'payload.email',   placeholder: 'Enter your email...'   },
              ].map(f => (
                <div key={f.name} className="space-y-3">
                  <label className="font-mono text-sm text-primaryGlow flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> {f.label}
                  </label>
                  <input required name={f.name} type={f.type} placeholder={f.placeholder}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-textPrimary focus:outline-none focus:border-primaryGlow/50 focus:ring-1 focus:ring-primaryGlow/50 transition-all placeholder:text-white/20"
                  />
                </div>
              ))}

              <div className="space-y-3">
                <label className="font-mono text-sm text-primaryGlow flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> payload.message
                </label>
                <textarea required name="message" rows={4} placeholder="Enter message body..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-textPrimary focus:outline-none focus:border-primaryGlow/50 focus:ring-1 focus:ring-primaryGlow/50 transition-all resize-none placeholder:text-white/20"
                />
              </div>

              {status === "error" && (
                <p className="text-red-400 font-mono text-xs">
                  Transmission failed. Try emailing directly at {links.email}
                </p>
              )}

              <Button type="submit" variant="primary" size="lg"
                className={`w-full font-mono font-bold mt-4 uppercase ${status === "sent" ? "tracking-normal text-sm" : "tracking-widest"}`}
                disabled={status === "sending" || status === "sent"}
              >
                {status === "idle"    && <><Send className="w-4 h-4 mr-2 shrink-0" />Execute Transfer</>}
                {status === "sending" && <><span className="shrink-0 mr-2 animate-pulse">▶</span>Transmitting...</>}
                {status === "sent"    && <><CheckCircle2 className="w-4 h-4 mr-2 shrink-0 text-statusSuccess" />Transmission Complete — 200 OK</>}
                {status === "error"   && <><Send className="w-4 h-4 mr-2 shrink-0" />Retry Transfer</>}
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* Social nodes — all URLs from data/links.ts */}
        <div className="flex-[1] flex flex-col gap-6">
          <h3 className="text-sm font-mono uppercase tracking-widest text-textSecondary border-b border-white/10 pb-2">Network Nodes</h3>

          <a href={links.github} target="_blank" rel="noreferrer" className="block">
            <GlassCard interactive glowColor="primary" className="p-5 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-surface border border-primaryGlow/30 group-hover:bg-primaryGlow/10 flex items-center justify-center transition-colors">
                <Github className="w-6 h-6 text-primaryGlow" />
              </div>
              <div>
                <div className="font-mono font-bold text-white">GitHub</div>
                <div className="text-xs text-textSecondary font-mono mt-1">{links.githubHandle}</div>
              </div>
            </GlassCard>
          </a>

          <a href={links.linkedin} target="_blank" rel="noreferrer" className="block">
            <GlassCard interactive glowColor="primary" className="p-5 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-surface border border-primaryGlow/30 group-hover:bg-primaryGlow/10 flex items-center justify-center transition-colors">
                <Linkedin className="w-6 h-6 text-primaryGlow" />
              </div>
              <div>
                <div className="font-mono font-bold text-white">LinkedIn</div>
                <div className="text-xs text-textSecondary font-mono mt-1">{links.linkedinHandle}</div>
              </div>
            </GlassCard>
          </a>

          <a href={`mailto:${links.email}`} className="block">
            <GlassCard interactive glowColor="primary" className="p-5 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-surface border border-primaryGlow/30 group-hover:bg-primaryGlow/10 flex items-center justify-center transition-colors">
                <Mail className="w-6 h-6 text-primaryGlow" />
              </div>
              <div>
                <div className="font-mono font-bold text-white">Email</div>
                <div className="text-xs text-textSecondary font-mono mt-1">{links.email}</div>
              </div>
            </GlassCard>
          </a>
        </div>
      </div>
    </div>
  );
}