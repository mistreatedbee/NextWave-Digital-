import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const lineVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const stats = [
  { value: '11+', label: 'Projects Delivered' },
  { value: '5yr', label: 'Years of Excellence' },
  { value: '100%', label: 'Client Satisfaction' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end pt-32 pb-20 overflow-hidden">
      {/* Ambient background blobs */}
      <div
        className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none animate-slow-drift"
        style={{
          background: 'radial-gradient(circle, rgba(183,255,0,0.04) 0%, transparent 65%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-8%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(58,144,144,0.04) 0%, transparent 60%)',
          filter: 'blur(90px)',
          animationDelay: '6s',
        }}
      />
      <div
        className="absolute top-[40%] left-[35%] w-[400px] h-[400px] rounded-full pointer-events-none animate-slow-drift"
        style={{
          background: 'radial-gradient(circle, rgba(183,255,0,0.02) 0%, transparent 60%)',
          filter: 'blur(80px)',
          animationDelay: '3s',
        }}
      />

      {/* Subtle vertical ruled line — right side */}
      <div
        className="absolute inset-y-0 right-0 w-px pointer-events-none hidden lg:block"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(183,255,0,0.06) 30%, rgba(183,255,0,0.06) 70%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 w-full">

        {/* Editorial tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="section-label mb-16"
        >
          Digital Studio &mdash; Nelspruit, South Africa
        </motion.div>

        {/* Massive editorial headline */}
        <div className="mb-14">
          {['We Build', 'Digital', 'Futures.'].map((line, i) => (
            <motion.div
              key={line}
              custom={i}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              className="overflow-hidden"
            >
              <h1
                className={`font-serif font-light leading-[0.92] tracking-tight ${
                  i === 1
                    ? 'text-gold italic'
                    : 'text-cream'
                }`}
                style={{ fontSize: 'clamp(4.5rem, 10vw, 11rem)' }}
              >
                {line}
              </h1>
            </motion.div>
          ))}
        </div>

        {/* Ruled line */}
        <motion.div
          className="h-px bg-gold/40 mb-12 origin-left"
          style={{ width: '4rem' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Tagline + stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row gap-10 lg:gap-0 lg:items-start lg:justify-between mb-12"
        >
          <p className="text-base lg:text-lg text-cream/55 max-w-sm leading-relaxed font-light font-sans">
            NextWave creates premium websites, apps,&nbsp;AI automations, and
            business software for modern South African businesses.
          </p>

          <div className="flex gap-10 lg:gap-16">
            {stats.map((s) => (
              <div key={s.label} className="text-left">
                <div
                  className="font-serif font-light text-gold leading-none mb-1"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                >
                  {s.value}
                </div>
                <div className="section-label">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-start gap-8"
        >
          <Link
            to="/portfolio"
            className="group flex items-center gap-3 font-sans text-xs tracking-[0.28em] uppercase text-gold hover:text-cream transition-colors duration-500"
          >
            View Our Work
            <span
              className="block h-px bg-current transition-all duration-500 group-hover:w-10"
              style={{ width: '1.5rem' }}
            />
          </Link>
          <Link
            to="/contact"
            className="font-sans text-xs tracking-[0.28em] uppercase text-cream/50 hover:text-cream transition-colors duration-500"
          >
            Start a Project
          </Link>
        </motion.div>

      </div>

      {/* Scroll indicator — bottom left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-8 left-10 hidden md:flex items-center gap-4 pointer-events-none"
      >
        <div className="w-px h-12 bg-cream/15" />
        <span
          className="section-label"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'left center', marginLeft: '0.5rem' }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
