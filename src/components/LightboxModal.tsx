import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category?: string;
  description?: string;
  technologies?: string[];
}

export function LightboxModal({
  isOpen,
  onClose,
  title,
  category,
  description,
  technologies,
}: LightboxModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="max-w-2xl w-full rounded-3xl bg-slate-950 border border-white/10 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-teal-400">
                  Case Study
                </p>
                <h2 className="text-lg font-bold text-white">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {category && (
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300">
                  {category}
                </div>
              )}
              {description && (
                <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
              )}
              {technologies && technologies.length > 0 && (
                <div className="pt-2 border-t border-white/5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                    Technologies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded-full bg-white/5 text-xs text-slate-200 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

