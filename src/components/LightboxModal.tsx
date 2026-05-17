import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Lock } from 'lucide-react';
import type { PortfolioItem } from '../data/portfolio';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PortfolioItem | null;
}

export function LightboxModal({ isOpen, onClose, item }: LightboxModalProps) {
  if (!item) return null;

  const description = item.longDescription || item.shortDescription;
  const hasLiveLink = !item.isPrivate && !!item.href && item.href !== '#';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-obsidian/85 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-obsidian border border-cream/8 rounded-2xl shadow-2xl"
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Hero image ─────────────────────────────────── */}
            <div className="relative h-64 lg:h-96 overflow-hidden rounded-t-2xl bg-charcoal-light flex-shrink-0">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover object-top ${
                    item.isPrivate ? 'blur-sm brightness-50' : ''
                  }`}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : null}

              {/* Gradient colour fallback (shown when no thumbnail or thumbnail fails) */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${item.placeholderAccent || '#B7FF00'}22 0%, rgba(22,22,22,0.95) 70%)`,
                }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />

              {/* Private overlay */}
              {item.isPrivate && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                  <Lock className="w-8 h-8 text-gold/60" />
                  <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gold/70">
                    Private / In Development
                  </span>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-obsidian/70 hover:bg-obsidian border border-cream/15 hover:border-gold/40 text-cream/70 hover:text-cream transition-all duration-300 rounded-sm backdrop-blur-sm z-20"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Category label */}
              <div className="absolute bottom-4 left-6 z-10">
                <span className="section-label">{item.displayCategory}</span>
              </div>
            </div>

            {/* ── Content ────────────────────────────────────── */}
            <div className="px-6 lg:px-10 py-8">
              {/* Title */}
              <h2
                className="font-display font-bold text-cream leading-tight mb-1"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}
              >
                {item.title}
              </h2>
              <p className="section-label mb-5">{item.displayCategory}</p>

              {/* Ruled line */}
              <div className="ruled-line mb-6" />

              {/* Description */}
              <p className="font-sans text-[15px] text-cream/65 leading-relaxed mb-8">
                {description}
              </p>

              {/* Tech stack */}
              {item.technologies.length > 0 && (
                <div className="mb-8">
                  <div className="section-label mb-3">Tech Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-sans text-xs text-cream/75 bg-charcoal-light border border-cream/10 px-3 py-1.5 rounded-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                {hasLiveLink ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 bg-gold text-obsidian font-sans text-[11px] font-bold tracking-[0.25em] uppercase px-8 py-4 min-h-[52px] hover:bg-gold/85 transition-all duration-300 active:scale-[0.97]"
                  >
                    View Live Project
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                ) : item.isPrivate ? (
                  <div className="inline-flex items-center gap-2.5 border border-gold/20 text-gold/50 font-sans text-[11px] font-semibold tracking-[0.25em] uppercase px-8 py-4 min-h-[52px] cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    Confidential Project
                  </div>
                ) : null}

                <button
                  onClick={onClose}
                  className="font-sans text-[10px] tracking-[0.25em] uppercase text-cream/35 hover:text-cream transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
