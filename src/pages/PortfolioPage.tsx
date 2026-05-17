import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, ExternalLink } from 'lucide-react';
import { portfolioItems, PortfolioItem } from '../data/portfolio';
import { LightboxModal } from '../components/LightboxModal';
import { SEO } from '../components/SEO';

// Filter categories shown in tabs
const FILTER_TABS = ['All', 'Websites', 'Restaurants', 'Systems', 'Mobile Apps', 'E-commerce'] as const;
type FilterTab = typeof FILTER_TABS[number];

function matchesTab(item: PortfolioItem, tab: FilterTab): boolean {
  if (tab === 'All') return true;
  if (tab === 'Systems') return item.category === 'Systems' || item.category === 'Task Management';
  return item.category === tab;
}

// Aspect ratio cycle for visual variety
const RATIOS = ['5/4', '3/4', '16/9', '4/3'];

// ── Gradient placeholder (when no thumbnail) ──────────────────
function GradientPlaceholder({ accent }: { accent?: string }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(135deg, ${accent || '#B7FF00'}22 0%, rgba(22,22,22,0.98) 70%)`,
        backgroundImage: [
          `linear-gradient(135deg, ${accent || '#B7FF00'}18 0%, rgba(22,22,22,0.98) 70%)`,
          'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 14px)',
        ].join(', '),
      }}
    />
  );
}

// ── Published project card ─────────────────────────────────────
function PublishedCard({ item, index, onOpen }: {
  item: PortfolioItem; index: number; onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const ratio = RATIOS[index % RATIOS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: (index % 6) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="break-inside-avoid mb-4 relative overflow-hidden group cursor-pointer bg-charcoal-light rounded-sm"
      style={{ aspectRatio: ratio, minHeight: '220px' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onOpen}
    >
      {/* Image */}
      {item.thumbnail ? (
        <motion.img
          src={item.thumbnail}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="lazy"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : null}
      <GradientPlaceholder accent={item.placeholderAccent} />

      {/* Dark gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.1) 55%, transparent 100%)' }}
        animate={{ opacity: hovered ? 0.85 : 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Category badge — top left */}
      <div className="absolute top-4 left-4">
        <span className="section-label text-cream/60">{item.displayCategory}</span>
      </div>

      {/* Live badge — top right (if has href) */}
      {item.href && item.href !== '#' && (
        <div className="absolute top-4 right-4">
          <span className="font-sans text-[8px] font-bold tracking-[0.2em] uppercase px-2 py-1 bg-gold text-obsidian rounded-sm">
            Live
          </span>
        </div>
      )}

      {/* Info — bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-5"
        animate={{ y: hovered ? -6 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 className="font-display font-semibold text-cream text-base lg:text-lg leading-tight mb-1">
          {item.title}
        </h3>
        <p className="font-sans text-[12px] text-cream/40 line-clamp-2 max-w-[260px]">
          {item.shortDescription}
        </p>

        {/* Action row */}
        <motion.div
          className="flex items-center gap-3 mt-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.25 }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            className="font-sans text-[9px] font-semibold tracking-[0.22em] uppercase text-gold hover:text-cream transition-colors duration-200"
          >
            Case Study →
          </button>
          {item.href && item.href !== '#' && (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 font-sans text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1.5 min-h-[30px] bg-gold text-obsidian hover:bg-gold/85 transition-colors duration-200"
            >
              View Live ↗
            </a>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Private/in-development card ────────────────────────────────
function PrivateCard({ item, index, onOpen }: {
  item: PortfolioItem; index: number; onOpen: () => void;
}) {
  const ratio = RATIOS[index % RATIOS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="break-inside-avoid mb-4 relative overflow-hidden group cursor-pointer bg-charcoal-light rounded-sm border border-gold/10 hover:border-gold/25 transition-colors duration-400"
      style={{ aspectRatio: ratio, minHeight: '220px' }}
      onClick={onOpen}
    >
      {/* Blurred thumbnail */}
      {item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover object-top blur-sm brightness-50"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : null}
      <GradientPlaceholder accent={item.placeholderAccent} />

      {/* Heavy overlay */}
      <div className="absolute inset-0 bg-obsidian/70" />

      {/* Diagonal pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(183,255,0,0.04) 0px, rgba(183,255,0,0.04) 1px, transparent 1px, transparent 16px)',
        }}
      />

      {/* Confidential badge — top right */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-gold/10 border border-gold/25 rounded-sm">
        <Lock className="w-2.5 h-2.5 text-gold/70" />
        <span className="font-sans text-[8px] font-bold tracking-[0.2em] uppercase text-gold/70">
          Confidential
        </span>
      </div>

      {/* Category — top left */}
      <div className="absolute top-4 left-4">
        <span className="section-label text-cream/40">{item.displayCategory}</span>
      </div>

      {/* Centre lock message */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
        <Lock className="w-6 h-6 text-gold/30" />
        <span className="font-sans text-[9px] font-bold tracking-[0.28em] uppercase text-gold/35">
          Private / In Development
        </span>
      </div>

      {/* Info — bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-display font-semibold text-cream/70 text-base leading-tight mb-1">
          {item.title}
        </h3>
        <p className="font-sans text-[11px] text-cream/30 line-clamp-2 max-w-[240px]">
          {item.shortDescription}
        </p>
        <motion.p
          className="font-sans text-[9px] font-semibold tracking-[0.22em] uppercase text-gold/50 mt-3"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          View Overview →
        </motion.p>
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [lightbox,  setLightbox]  = useState<PortfolioItem | null>(null);

  const published = portfolioItems.filter(p => !p.isPrivate);
  const privateProjects = portfolioItems.filter(p => p.isPrivate);

  const filteredPublished = published.filter(p => matchesTab(p, activeTab));
  const filteredPrivate   = privateProjects.filter(p => matchesTab(p, activeTab));

  return (
    <div className="bg-ivory text-obsidian dark:bg-obsidian dark:text-cream min-h-screen">
      <SEO
        title="Portfolio — NextWave Digital Solutions"
        description="Selected digital work by NextWave Digital Solutions — websites, mobile apps, ecommerce stores, business systems, and AI automation solutions."
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pt-40 pb-16 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-4">Our Work</div>
          <h1
            className="font-display font-bold leading-tight mb-5"
            style={{ fontSize: 'clamp(3rem, 7vw, 8rem)' }}
          >
            Selected Digital Work
          </h1>
          <p className="font-sans text-base text-obsidian/55 dark:text-cream/55 max-w-2xl leading-relaxed">
            A curated collection of websites, applications, ecommerce platforms, automation systems,
            and digital experiences built by NextWave Digital Solutions.
          </p>
        </motion.div>
      </section>

      {/* ── Filter tabs ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          className="flex gap-6 flex-wrap border-b border-obsidian/8 dark:border-cream/8 mb-16"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative font-sans text-[10px] tracking-[0.22em] uppercase pb-4 transition-colors duration-400 ${
                activeTab === tab
                  ? 'text-obsidian dark:text-cream'
                  : 'text-obsidian/35 dark:text-cream/35 hover:text-obsidian/70 dark:hover:text-cream/70'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.span
                  layoutId="portfolio-tab"
                  className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* ── Published grid ────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-4"
          >
            {filteredPublished.length === 0 ? (
              <p className="font-sans text-[13px] text-obsidian/35 dark:text-cream/35 py-12">
                No published projects in this category yet.
              </p>
            ) : (
              filteredPublished.map((item, i) => (
                <PublishedCard
                  key={item.id}
                  item={item}
                  index={i}
                  onOpen={() => setLightbox(item)}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Private projects section ─────────────────── */}
        {filteredPrivate.length > 0 && (
          <div className="mt-6">
            {/* Divider */}
            <div className="ruled-line my-20" />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12"
            >
              <div className="section-label mb-3">In Development &amp; Private Projects</div>
              <h2
                className="font-display font-semibold leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
              >
                Building the Future
              </h2>
              <p className="font-sans text-sm text-obsidian/50 dark:text-cream/50 max-w-xl leading-relaxed">
                These projects are currently in development or under confidentiality agreements.
                Previews are intentionally blurred for privacy.
              </p>
            </motion.div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {filteredPrivate.map((item, i) => (
                <PrivateCard
                  key={item.id}
                  item={item}
                  index={i}
                  onOpen={() => setLightbox(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Bottom CTA ───────────────────────────────── */}
        <div className="py-24 text-center">
          <p className="font-sans text-[13px] text-obsidian/35 dark:text-cream/35 mb-4">
            Ready to become our next success story?
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 font-sans text-[11px] tracking-[0.28em] uppercase text-gold hover:text-obsidian dark:hover:text-cream transition-colors duration-400"
          >
            Start Your Project
            <span className="block h-px w-6 bg-current transition-all duration-400 group-hover:w-10" />
          </Link>
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────── */}
      <LightboxModal
        isOpen={!!lightbox}
        onClose={() => setLightbox(null)}
        item={lightbox}
      />
    </div>
  );
}
