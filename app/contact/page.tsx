"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Terminal, Send, Github, Linkedin, Mail } from 'lucide-react';

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1500);
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
                <div className="w-3 h-3 rounded-full bg-accent/80 shadow-[0_0_10px_rgba(20,241,149,0.5)]" />
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
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-textPrimary focus:outline-none focus:border-primaryGlow/50 focus:ring-1 focus:ring-primaryGlow/50 transition-all resize-none placeholder:text-white/20"
                  placeholder="Enter message body..."
                />
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-full font-mono font-bold tracking-widest uppercase mt-4"
                disabled={status !== "idle"}
              >
                {status === "idle" && <><Send className="w-4 h-4 mr-2" /> Execute Transfer</>}
                {status === "sending" && "Transmitting [======>   ]"}
                {status === "sent" && "Transmission Complete. 200 OK"}
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
                <Github className="w-6 h-6 text-primaryGlow cursor-pointer" />
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
                <Linkedin className="w-6 h-6 text-secondaryGlow cursor-pointer" />
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
                <Mail className="w-6 h-6 text-accent cursor-pointer" />
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
