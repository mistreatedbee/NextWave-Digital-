import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const stats = [
  { value: '11+',  label: 'Projects Delivered' },
  { value: '5yr',  label: 'Years of Excellence' },
  { value: '100%', label: 'Client Satisfaction' },
  { value: '24/7', label: 'Dedicated Support' },
];

const values = [
  {
    n: '01',
    name: 'Innovation',
    desc: 'We stay ahead of the curve — exploring new tools, techniques, and technologies to deliver solutions that give our clients a competitive edge.',
  },
  {
    n: '02',
    name: 'Quality',
    desc: "We refuse to ship anything we wouldn't be proud to show the world. Every pixel, every line of code is crafted with precision and intent.",
  },
  {
    n: '03',
    name: 'Partnership',
    desc: 'We build long-term relationships, not one-off projects. Your success is our success — we stay invested long after launch.',
  },
];

export function AboutPage() {
  return (
    <div className="bg-obsidian text-cream min-h-screen">
      <SEO
        title="About — NextWave Digital Solutions"
        description="NextWave Digital Solutions is a premium digital studio based in Nelspruit, South Africa, crafting websites, software, and AI automation for ambitious businesses."
      />

      {/* Hero */}
      <section className="pt-40 pb-0 max-w-7xl mx-auto px-6 lg:px-10 relative">
        {/* Est. tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute top-40 right-6 lg:right-10 section-label text-cream/20"
        >
          Est. 2019 &mdash; Nelspruit, SA
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <div className="section-label mb-4">Who We Are</div>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light text-cream leading-tight"
            style={{ fontSize: 'clamp(4rem, 9vw, 10rem)' }}
          >
            NextWave
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light italic text-gold leading-tight"
            style={{ fontSize: 'clamp(3rem, 7vw, 8rem)' }}
          >
            Digital Solutions.
          </motion.h1>
        </div>

        {/* Ruled line */}
        <motion.div
          className="h-px bg-gold/15 mt-12 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </section>

      {/* Story section */}
      <section
        className="max-w-7xl mx-auto px-6 lg:px-10"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Large quote */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <blockquote
              className="font-serif font-light italic text-cream/75 leading-snug"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.8rem)' }}
            >
              &ldquo;We believe that great digital work is indistinguishable from great craft.&rdquo;
            </blockquote>
          </motion.div>

          {/* Story text */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-5"
          >
            <p className="font-sans text-[15px] text-cream/55 leading-relaxed">
              Founded in Nelspruit, Mpumalanga, NextWave Digital Solutions was built on a simple conviction: that businesses in South Africa deserve world-class digital experiences.
            </p>
            <p className="font-sans text-[15px] text-cream/55 leading-relaxed">
              For five years, we've partnered with clients across South Africa and beyond — from startups finding their feet to established enterprises navigating digital transformation. Every project is an opportunity to create something that truly matters.
            </p>
            <p className="font-sans text-[15px] text-cream/55 leading-relaxed">
              We are not a factory. We don't churn out templates. We build bespoke digital assets engineered to perform, endure, and grow with your business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-charcoal" style={{ paddingTop: 'clamp(4rem,8vw,6rem)', paddingBottom: 'clamp(4rem,8vw,6rem)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="font-serif font-light text-gold leading-none mb-2"
                  style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}
                >
                  {s.value}
                </div>
                <div className="section-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="max-w-7xl mx-auto px-6 lg:px-10"
        style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-4xl"
        >
          <div className="section-label mb-3">Core Values</div>
          <h2
            className="font-serif font-light text-cream leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
          >
            What Drives Us
          </h2>
        </motion.div>

        <div className="max-w-4xl">
          {values.map((v, i) => (
            <motion.div
              key={v.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="ruled-line" />
              <div className="flex items-start gap-8 lg:gap-16 py-8 lg:py-10">
                <span
                  className="font-serif font-light text-cream/8 leading-none shrink-0 w-12 hidden sm:block"
                  style={{ fontSize: '4rem' }}
                >
                  {v.n}
                </span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline gap-4 lg:gap-12">
                  <h3
                    className="font-serif font-light text-cream shrink-0"
                    style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}
                  >
                    {v.name}
                  </h3>
                  <p className="font-sans text-[14px] text-cream/45 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="ruled-line" />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 text-center"
        >
          <h2
            className="font-serif font-light text-cream mb-10 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
          >
            Ready to build something remarkable?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link
              to="/contact"
              className="group flex items-center gap-3 font-sans text-[11px] tracking-[0.28em] uppercase text-gold hover:text-cream transition-colors duration-400"
            >
              Start a Project
              <span className="block h-px w-6 bg-current transition-all duration-400 group-hover:w-10" />
            </Link>
            <Link
              to="/portfolio"
              className="font-sans text-[11px] tracking-[0.28em] uppercase text-cream/40 hover:text-cream transition-colors duration-400"
            >
              See Our Work
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
