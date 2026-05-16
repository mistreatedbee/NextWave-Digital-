import React, { useEffect, useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WA_URL =
  'https://wa.me/27731531188?text=Hi%20NextWave%20Digital%20Solutions%2C%20I%20would%20like%20to%20book%20a%20service.';

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3">
      {/* WhatsApp "Book a Service" button */}
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-sm bg-gold/20 animate-ping pointer-events-none" />

        <motion.a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-2.5 bg-gold text-obsidian font-sans text-[10px] font-bold tracking-[0.22em] uppercase px-4 py-3 rounded-sm shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-shadow duration-400"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Book a Service on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          Book a Service
        </motion.a>
      </motion.div>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            className="w-10 h-10 flex items-center justify-center bg-obsidian/80 dark:bg-cream/10 border border-obsidian/15 dark:border-cream/15 text-obsidian dark:text-cream hover:border-gold hover:text-gold backdrop-blur-sm transition-colors duration-400"
            aria-label="Back to top"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
