import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { faqs } from '../data/faqs';
import { SEO } from '../components/SEO';

export default function FaqPage() {
  const [category, setCategory] = useState<string>('All');
  const [openId,   setOpenId]   = useState<string | null>(null);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(faqs.map((f) => f.category)))],
    [],
  );

  const filtered = faqs.filter((item) =>
    category === 'All' || item.category === category
  );

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="bg-obsidian text-cream min-h-screen">
      <SEO
        title="FAQ — NextWave Digital Solutions"
        description="Answers to frequently asked questions about NextWave's services, pricing, process, and projects."
      />

      {/* Hero */}
      <section className="pt-40 pb-16 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-4">Need Answers?</div>
          <h1
            className="font-serif font-light text-cream leading-tight"
            style={{ fontSize: 'clamp(3rem, 7vw, 8rem)' }}
          >
            Frequently Asked
            <br />
            <span className="italic text-gold">Questions.</span>
          </h1>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Category tabs */}
        <motion.div
          className="flex flex-wrap gap-8 border-b border-cream/8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`relative font-sans text-[10px] tracking-[0.22em] uppercase pb-4 transition-colors duration-400 ${
                category === cat ? 'text-cream' : 'text-cream/35 hover:text-cream/70'
              }`}
            >
              {cat}
              {category === cat && (
                <motion.span
                  layoutId="faq-tab"
                  className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* FAQ accordion */}
        <div className="max-w-4xl">
          {filtered.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="ruled-line" />
              <button
                className="w-full flex items-start justify-between gap-8 py-8 text-left group -mx-6 lg:-mx-10 px-6 lg:px-10 hover:bg-gold/[0.015] transition-colors duration-300"
                onClick={() => toggle(faq.id)}
              >
                <h3 className="font-sans text-base font-medium text-cream group-hover:text-cream/80 transition-colors duration-300 leading-relaxed">
                  {faq.question}
                </h3>
                <motion.span
                  animate={{ rotate: openId === faq.id ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif text-xl text-gold/50 group-hover:text-gold transition-colors duration-300 shrink-0 mt-0.5"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 pl-0 lg:pl-0 pr-16">
                      <p className="font-sans text-[14px] text-cream/50 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          <div className="ruled-line" />
        </div>

        {/* CTA */}
        <div className="py-24 text-center">
          <p className="font-sans text-[13px] text-cream/35 mb-4">
            Still have questions? We&apos;re happy to help.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 font-sans text-[11px] tracking-[0.28em] uppercase text-gold hover:text-cream transition-colors duration-400"
          >
            Get in Touch
            <span className="block h-px w-6 bg-current transition-all duration-400 group-hover:w-10" />
          </Link>
        </div>
      </div>
    </div>
  );
}
