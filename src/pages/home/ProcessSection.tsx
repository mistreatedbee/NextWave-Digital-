import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle, Map, Code2, Eye, Rocket, TrendingUp,
} from 'lucide-react';

const steps = [
  {
    n: '01',
    title: 'Consultation',
    desc: 'We listen deeply to understand your goals, challenges, audience, and vision before anything else.',
    icon: MessageCircle,
  },
  {
    n: '02',
    title: 'Strategy & Planning',
    desc: 'We architect the optimal solution — clear roadmap, technology stack, timeline, and success metrics.',
    icon: Map,
  },
  {
    n: '03',
    title: 'Design & Development',
    desc: 'Precision UI/UX crafted for your brand, then built with clean, scalable, production-grade code.',
    icon: Code2,
  },
  {
    n: '04',
    title: 'Review & Revisions',
    desc: 'We refine together — your feedback shapes every iteration until every detail is exactly right.',
    icon: Eye,
  },
  {
    n: '05',
    title: 'Launch',
    desc: 'Seamless deployment with full team onboarding, testing, and a smooth go-live supported by us.',
    icon: Rocket,
  },
  {
    n: '06',
    title: 'Support & Growth',
    desc: 'Ongoing partnership to scale, maintain, and evolve your digital asset long after launch.',
    icon: TrendingUp,
  },
];

export function ProcessSection() {
  return (
    <section
      className="relative bg-[#F0F0EE] dark:bg-charcoal"
      style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
    >
      {/* Subtle lime ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(183,255,0,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <div className="section-label mb-3">How We Work</div>
            <h2
              className="font-display font-semibold leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
            >
              The Process
            </h2>
          </div>
          <p className="font-sans text-[13px] text-obsidian/45 dark:text-cream/45 max-w-xs leading-relaxed">
            A transparent, agile framework — from first conversation to long-term success.
          </p>
        </motion.div>

        {/* Step cards — 3-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{
                  y: -6,
                  boxShadow: '0 20px 60px rgba(183,255,0,0.08), 0 4px 20px rgba(0,0,0,0.15)',
                }}
                className="relative rounded-2xl border border-gold/15 hover:border-gold/45 transition-colors duration-400 p-6 lg:p-8 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.035)',
                  backdropFilter: 'blur(14px)',
                }}
              >
                {/* Top row: number + icon */}
                <div className="flex items-start justify-between mb-4">
                  <span
                    className="font-display font-bold text-gold/15 leading-none select-none"
                    style={{ fontSize: '4rem' }}
                  >
                    {step.n}
                  </span>
                  <div className="w-11 h-11 rounded-xl border border-gold/30 flex items-center justify-center shrink-0 bg-gold/5">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                </div>

                {/* Label */}
                <div className="section-label mb-2">Step {step.n}</div>

                {/* Title */}
                <h3 className="font-display font-semibold text-xl mb-3 text-obsidian dark:text-cream">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-[13px] text-obsidian/55 dark:text-cream/55 leading-relaxed">
                  {step.desc}
                </p>

                {/* Corner accent */}
                <div
                  className="absolute bottom-0 right-0 w-16 h-16 rounded-br-2xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(225deg, rgba(183,255,0,0.06) 0%, transparent 60%)',
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
