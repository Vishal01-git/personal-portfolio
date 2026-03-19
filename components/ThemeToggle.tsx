"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDracula = theme === 'dracula';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDracula ? 'Switch to Terminal theme' : 'Switch to Dracula theme'}
      title={isDracula ? 'Terminal theme' : 'Dracula theme'}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200
        border-white/10 bg-white/5 hover:bg-white/10 hover:border-primaryGlow/40
        text-textSecondary hover:text-primaryGlow"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDracula ? (
          <motion.span
            key="dracula"
            initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0,   scale: 1   }}
            exit={{    opacity: 0, rotate:  30,  scale: 0.7 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute"
          >
            <Moon className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.span
            key="terminal"
            initial={{ opacity: 0, rotate: 30,  scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0,   scale: 1   }}
            exit={{    opacity: 0, rotate: -30,  scale: 0.7 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute"
          >
            <Terminal className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}