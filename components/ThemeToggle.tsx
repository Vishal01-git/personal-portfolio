"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200
        border-white/10 bg-white/5 hover:bg-white/10 hover:border-primaryGlow/40
        text-textSecondary hover:text-primaryGlow
        [data-theme=light]:border-amber-200/60 [data-theme=light]:bg-amber-50/60"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
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
            key="sun"
            initial={{ opacity: 0, rotate: 30,  scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0,   scale: 1   }}
            exit={{    opacity: 0, rotate: -30,  scale: 0.7 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute"
          >
            <Sun className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}