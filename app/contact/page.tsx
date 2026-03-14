"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Terminal, Send, Github, Linkedin, Mail, CheckCircle2 } from 'lucide-react';

// ─── Replace YOUR_FORM_ID with your Formspree endpoint ─────────────────────
// Sign up free at https://formspree.io → New Form → copy the 8-char ID
// e.g. "https://formspree.io/f/xpwzgkdo"
const FORMSPREE_URL = "https://formspree.io/f/xqeylrjn";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
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
        {/* Terminal Form */}
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
              <div className="space-y-3">
                <label className="font-mono text-sm text-primaryGlow flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> payload.name
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-textPrimary focus:outline-none focus:border-primaryGlow/50 focus:ring-1 focus:ring-primaryGlow/50 transition-all placeholder:text-white/20"
                  placeholder="Enter your name..."
                />
              </div>

              <div className="space-y-3">
                <label className="font-mono text-sm text-primaryGlow flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> payload.email
                </label>
                <input
                  required
                  name="email"
                  type="email"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-textPrimary focus:outline-none focus:border-primaryGlow/50 focus:ring-1 focus:ring-primaryGlow/50 transition-all placeholder:text-white/20"
                  placeholder="Enter your email..."
                />
              </div>

              <div className="space-y-3">
                <label className="font-mono text-sm text-primaryGlow flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> payload.message
                </label>
                <textarea
                  required
                  name="message"
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-textPrimary focus:outline-none focus:border-primaryGlow/50 focus:ring-1 focus:ring-primaryGlow/50 transition-all resize-none placeholder:text-white/20"
                  placeholder="Enter message body..."
                />
              </div>

              {status === "error" && (
                <p className="text-red-400 font-mono text-xs">
                  Transmission failed. Try emailing directly at prajapativicky678@gmail.com
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className={`w-full font-mono font-bold mt-4 uppercase ${
                  status === "sent" ? "tracking-normal text-sm" : "tracking-widest"
                }`}
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

        {/* Social Nodes */}
        <div className="flex-[1] flex flex-col gap-6">
          <h3 className="text-sm font-mono uppercase tracking-widest text-textSecondary border-b border-white/10 pb-2">Network Nodes</h3>

          <a href="https://github.com/Vishal01-git" target="_blank" rel="noreferrer" className="block">
            <GlassCard interactive glowColor="primary" className="p-5 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-surface border border-primaryGlow/30 group-hover:bg-primaryGlow/10 flex items-center justify-center transition-colors">
                <Github className="w-6 h-6 text-primaryGlow" />
              </div>
              <div>
                <div className="font-mono font-bold text-white">GitHub</div>
                <div className="text-xs text-textSecondary font-mono mt-1">/Vishal01-git</div>
              </div>
            </GlassCard>
          </a>

          <a href="https://linkedin.com/in/vishalprajapati07" target="_blank" rel="noreferrer" className="block">
            <GlassCard interactive glowColor="secondary" className="p-5 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-surface border border-secondaryGlow/30 group-hover:bg-secondaryGlow/10 flex items-center justify-center transition-colors">
                <Linkedin className="w-6 h-6 text-secondaryGlow" />
              </div>
              <div>
                <div className="font-mono font-bold text-white">LinkedIn</div>
                <div className="text-xs text-textSecondary font-mono mt-1">/in/vishalprajapati07</div>
              </div>
            </GlassCard>
          </a>

          <a href="mailto:prajapativicky678@gmail.com" className="block">
            <GlassCard interactive glowColor="accent" className="p-5 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-surface border border-accent/30 group-hover:bg-accent/10 flex items-center justify-center transition-colors">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="font-mono font-bold text-white">Email</div>
                <div className="text-xs text-textSecondary font-mono mt-1">prajapativicky678@gmail.com</div>
              </div>
            </GlassCard>
          </a>
        </div>
      </div>
    </div>
  );
}