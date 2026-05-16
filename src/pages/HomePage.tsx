import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { HeroSection } from './home/HeroSection';
import { ServicesOverviewSection } from './home/ServicesOverviewSection';
import { FeaturedPortfolioSection } from './home/FeaturedPortfolioSection';
import { ProcessSection } from './home/ProcessSection';
import { PricingPostersSection } from './home/PricingPostersSection';

function CtaStrip() {
  return (
    <section
      className="relative"
      style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(183,255,0,0.03) 0%, transparent 60%)',
        }}
      />
      <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center relative z-10">
        {/* Top ruled line — draws left to right */}
        <motion.div
          className="h-px bg-gold/20 mb-16 mx-auto origin-left"
          style={{ maxWidth: '8rem' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="section-label mb-6 mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Start a Conversation
          </motion.span>
        </div>

        {/* Split headline with stagger */}
        <div className="overflow-hidden mb-10">
          <motion.h2
            className="font-display font-semibold leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            Ready to build something
          </motion.h2>
        </div>
        <div className="overflow-hidden mb-12">
          <motion.h2
            className="font-display font-bold italic text-gold leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            exceptional?
          </motion.h2>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to="/contact"
            className="group flex items-center gap-3 font-sans text-[11px] tracking-[0.28em] uppercase text-gold hover:text-obsidian dark:hover:text-cream transition-colors duration-500"
          >
            Start a Project
            <span className="block h-px w-6 bg-current transition-all duration-500 group-hover:w-10" />
          </Link>
          <Link
            to="/portfolio"
            className="font-sans text-[11px] tracking-[0.28em] uppercase text-obsidian/40 dark:text-cream/40 hover:text-obsidian dark:hover:text-cream transition-colors duration-500"
          >
            See Our Work
          </Link>
        </motion.div>

        {/* Bottom ruled line — draws right to left */}
        <motion.div
          className="h-px bg-gold/20 mt-16 mx-auto origin-right"
          style={{ maxWidth: '8rem' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </section>
  );
}

export function HomePage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 50); return () => clearTimeout(t); }, []);

  return (
    <motion.div
      className="bg-ivory text-obsidian dark:bg-obsidian dark:text-cream overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <SEO
        title="NextWave Digital Solutions — Premium Websites, Apps & AI Automation"
        description="NextWave creates premium websites, business software, ecommerce platforms, and AI automations for modern South African businesses."
      />
      <HeroSection />
      <ServicesOverviewSection />
      <PricingPostersSection />
      <FeaturedPortfolioSection />
      <ProcessSection />
      <CtaStrip />
    </motion.div>
  );
}
