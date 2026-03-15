"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-xl font-mono text-sm font-bold text-primaryGlow bg-surface/80 backdrop-blur-md border border-primaryGlow/30 shadow-neon-glow hover:bg-primaryGlow/15 hover:border-primaryGlow/60 transition-all duration-200 select-none"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}