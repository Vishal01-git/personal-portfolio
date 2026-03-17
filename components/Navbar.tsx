"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Database, Terminal, Cpu, Network, User, Mail, GitBranch } from 'lucide-react';
import { CommandPaletteTrigger } from '@/components/CommandPalette';
import { ThemeToggle } from '@/components/ThemeToggle';
import { meta } from '@/data/meta';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Architecture', href: '/architecture', icon: <Network className="w-4 h-4" /> },
    { name: 'Projects',     href: '/projects',     icon: <Database className="w-4 h-4" /> },
    { name: 'Skills',       href: '/skills',       icon: <Cpu className="w-4 h-4" /> },
    { name: 'Experience',   href: '/experience',   icon: <Terminal className="w-4 h-4" /> },
    { name: 'About',        href: '/about',        icon: <User className="w-4 h-4" /> },
    { name: 'Contact',      href: '/contact',      icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-6xl mx-auto">
        <GlassCard
          className="py-2 px-4 md:px-5 rounded-full flex items-center justify-between shadow-elevation border-white/10"
          glowColor="none"
        >
          {/* Left: avatar + name + status */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 mr-4">
            <Image
              src="/profile_image.jpg"
              alt={meta.name}
              width={32}
              height={32}
              className="rounded-full object-cover border border-primaryGlow/50 group-hover:shadow-neon-glow transition-all shrink-0"
            />
            <div className="hidden sm:flex flex-col gap-0.5 leading-none">
              <span className="font-heading font-bold text-base tracking-wide text-white">
                {meta.name}
              </span>
              {meta.openToRoles && (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-textSecondary/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-statusSuccess animate-pulse shrink-0" />
                  {meta.statusText}
                </span>
              )}
            </div>
          </Link>

          {/* Centre: nav links */}
          <div className="flex items-center gap-0.5">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 text-sm font-medium px-2 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-primaryGlow bg-primaryGlow/10'
                      : 'text-textSecondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`transition-colors ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                    {link.icon}
                  </span>
                  <span className="hidden xl:block">{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primaryGlow shadow-neon-glow" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: theme toggle + ⌘K */}
          <div className="shrink-0 ml-3 flex items-center gap-2">
            <ThemeToggle />
            <CommandPaletteTrigger />
          </div>
        </GlassCard>
      </div>
    </nav>
  );
}