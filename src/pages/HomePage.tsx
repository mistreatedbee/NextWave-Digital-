import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { HeroSection } from './home/HeroSection';
import { ServicesOverviewSection } from './home/ServicesOverviewSection';
import { FeaturedPortfolioSection } from './home/FeaturedPortfolioSection';
import { ProcessSection } from './home/ProcessSection';
import { PricingPostersSection } from './home/PricingPostersSection';

const processSteps = [
  { number: '01', title: 'Discover',    desc: 'Deep-dive into your goals and pain points to align on the right solution.' },
  { number: '02', title: 'Strategise',  desc: 'Architect the optimal solution with a clear delivery roadmap.' },
  { number: '03', title: 'Design',      desc: 'Precision UI/UX crafted for your users, brand, and industry.' },
  { number: '04', title: 'Build',       desc: 'Agile development sprints with transparent progress and fast iteration.' },
  { number: '05', title: 'Launch',      desc: 'Seamless deployment, team onboarding, and ongoing partnership.' },
];

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
        {/* Top ruled line */}
        <motion.div
          className="h-px bg-gold/20 mb-16 origin-left mx-auto"
          style={{ maxWidth: '8rem' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-6 mx-auto">Start a Conversation</div>
          <h2
            className="font-serif font-light text-cream leading-tight mb-10"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}
          >
            Ready to build something
            <br />
            <span className="italic text-gold">exceptional?</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12">
            <Link
              to="/contact"
              className="group flex items-center gap-3 font-sans text-[11px] tracking-[0.28em] uppercase text-gold hover:text-cream transition-colors duration-500"
            >
              Start a Project
              <span className="block h-px w-6 bg-current transition-all duration-500 group-hover:w-10" />
            </Link>
            <Link
              to="/portfolio"
              className="font-sans text-[11px] tracking-[0.28em] uppercase text-cream/40 hover:text-cream transition-colors duration-500"
            >
              See Our Work
            </Link>
          </div>
        </motion.div>

        {/* Bottom ruled line */}
        <motion.div
          className="h-px bg-gold/20 mt-16 origin-left mx-auto"
          style={{ maxWidth: '8rem' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <div className="bg-obsidian text-cream overflow-x-hidden">
      <SEO
        title="NextWave Digital Solutions — Premium Websites, Apps & AI Automation"
        description="NextWave creates premium websites, business software, ecommerce platforms, and AI automations for modern South African businesses."
      />
      <HeroSection />
      <ServicesOverviewSection />
      <PricingPostersSection />
      <FeaturedPortfolioSection />
      <ProcessSection steps={processSteps} />
      <CtaStrip />
    </div>
  );
}
