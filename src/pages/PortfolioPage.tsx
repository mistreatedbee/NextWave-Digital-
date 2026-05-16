import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { portfolioItems, PortfolioCategory } from '../data/portfolio';
import { LightboxModal } from '../components/LightboxModal';
import { SEO } from '../components/SEO';

const CATEGORIES: (PortfolioCategory | 'All')[] = [
  'All',
  'Websites',
  'Mobile Apps',
  'E-commerce',
];

export default function PortfolioPage() {
  const [selected, setSelected] = useState<(PortfolioCategory | 'All')>('All');
  const [lightbox, setLightbox] = useState<typeof portfolioItems[0] | null>(null);

  const filtered = selected === 'All'
    ? portfolioItems
    : portfolioItems.filter((p) => p.category === selected);

  return (
    <div className="bg-ivory text-obsidian dark:bg-obsidian dark:text-cream min-h-screen">
      <SEO
        title="Portfolio — NextWave Digital Solutions"
        description="Selected projects by NextWave Digital Solutions — websites, mobile apps, ecommerce stores, and AI systems for South African businesses."
      />

      {/* Hero */}
      <section className="pt-40 pb-16 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-4">Our Work</div>
          <h1
            className="font-display font-semibold leading-tight"
            style={{ fontSize: 'clamp(3rem, 7vw, 8rem)' }}
          >
            Selected Projects
          </h1>
        </motion.div>
      </section>

      {/* Filter tabs */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          className="flex gap-8 border-b border-cream/8 mb-16"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`relative font-sans text-[10px] tracking-[0.22em] uppercase pb-4 transition-colors duration-400 ${
                selected === cat ? 'text-cream' : 'text-cream/35 hover:text-cream/70'
              }`}
            >
              {cat}
              {selected === cat && (
                <motion.span
                  layoutId="portfolio-tab"
                  className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Masonry grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="columns-1 md:columns-2 gap-4"
          >
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="break-inside-avoid mb-4 relative overflow-hidden group cursor-pointer bg-charcoal-light"
                style={{ aspectRatio: i % 3 === 0 ? '4/3' : i % 3 === 1 ? '3/4' : '16/9' }}
                onClick={() => setLightbox(item)}
              >
                {/* Image */}
                <motion.img
                  src={item.thumbnail}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />

                {/* Diagonal pattern fallback */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, rgba(183,255,0,0.03) 0px, rgba(183,255,0,0.03) 1px, transparent 1px, transparent 14px)`,
                  }}
                />

                {/* Overlay */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.1) 60%, transparent 100%)' }}
                  whileHover={{ opacity: 1.3 }}
                />

                {/* Info */}
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="section-label text-cream/40 mb-1">{item.category}</div>
                  <h3 className="font-sans text-base font-medium text-cream leading-tight">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[12px] text-cream/35 mt-1 line-clamp-2 max-w-[240px]">
                    {item.shortDescription}
                  </p>
                  <motion.p
                    className="font-sans text-[10px] tracking-[0.22em] uppercase text-gold mt-3"
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 0 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    View Project →
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="text-center py-24">
          <p className="font-sans text-[13px] text-cream/35 mb-4">Have a project in mind?</p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 font-sans text-[11px] tracking-[0.28em] uppercase text-gold hover:text-cream transition-colors duration-400"
          >
            Let&apos;s Build Together
            <span className="block h-px w-6 bg-current transition-all duration-400 group-hover:w-10" />
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <LightboxModal
          isOpen={!!lightbox}
          onClose={() => setLightbox(null)}
          title={lightbox.title}
          category={lightbox.category}
          description={lightbox.longDescription || lightbox.shortDescription}
          technologies={lightbox.technologies}
        />
      )}
    </div>
  );
}
