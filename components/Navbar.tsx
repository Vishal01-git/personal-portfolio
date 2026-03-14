import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';
import { Database, Terminal, Cpu, Network, User, Mail } from 'lucide-react';

export function Navbar() {
  const links = [
    { name: 'Architecture', href: '/architecture', icon: <Network className="w-4 h-4" /> },
    { name: 'Projects', href: '/projects', icon: <Database className="w-4 h-4" /> },
    { name: 'Skills', href: '/skills', icon: <Cpu className="w-4 h-4" /> },
    { name: 'Experience', href: '/experience', icon: <Terminal className="w-4 h-4" /> },
    { name: 'About', href: '/about', icon: <User className="w-4 h-4" /> },
    { name: 'Contact', href: '/contact', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-6xl mx-auto">
        <GlassCard className="py-2 px-4 md:px-6 rounded-full flex items-center justify-between shadow-elevation border-white/10" glowColor="none">
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/profile_image.jpg" 
              alt="Vishal Prajapati" 
              width={32} 
              height={32} 
              className="rounded-full object-cover border border-primaryGlow/50 group-hover:shadow-neon-glow transition-all" 
            />
            <span className="font-heading font-bold text-lg tracking-wide hidden sm:block text-white">
              Vishal Prajapati
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto no-scrollbar">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 text-sm font-medium text-textSecondary hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
              >
                <span className="opacity-70">{link.icon}</span>
                <span className="hidden md:block">{link.name}</span>
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>
    </nav>
  );
}
