import React from 'react';
import { motion } from 'framer-motion';

interface ProcessStep {
  number: string;
  title: string;
  desc: string;
}

interface ProcessSectionProps {
  steps: ProcessStep[];
}

export function ProcessSection({ steps }: ProcessSectionProps) {
  return (
    <section
      className="relative bg-charcoal"
      style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <div className="section-label mb-3">How We Work</div>
          <h2
            className="font-serif font-light text-cream leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
          >
            The Process
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting ruled line */}
          <motion.div
            className="hidden md:block absolute h-px bg-gold/12 origin-left"
            style={{ top: '28px', left: '8%', right: '8%' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start md:items-center text-left md:text-center group"
              >
                {/* Number box */}
                <div
                  className="relative w-14 h-14 flex items-center justify-center mb-6 z-10 border border-gold/25 group-hover:border-gold/50 transition-colors duration-500"
                  style={{ background: 'rgba(200,164,90,0.04)' }}
                >
                  <span className="font-serif text-xl text-cream/50 group-hover:text-gold/70 transition-colors duration-500">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-cream mb-3">
                  {step.title}
                </h3>
                <p className="font-sans text-[12px] text-cream/40 leading-relaxed md:max-w-[140px]">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
