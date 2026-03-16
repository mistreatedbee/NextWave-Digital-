import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLElement>;
  stats: { value: number; suffix: string; label: string }[];
  childrenBeforeStats?: React.ReactNode;
}

const quickHighlights = [
  'Websites that attract and convert clients',
  'Custom software built around your business',
  'AI automation that saves time and reduces manual work',
];

export function HeroSection({ heroRef, stats, childrenBeforeStats }: HeroSectionProps) {
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden"
    >
      <div className="absolute inset-0 hero-grid" />

      <div
        className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(20,184,166,0.12) 0%, rgba(59,130,246,0.07) 45%, transparent 72%)',
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="absolute right-[18%] top-[22%] w-2.5 h-2.5 rounded-full bg-teal-400/50 float" />
      <div className="absolute right-[30%] top-[65%] w-2 h-2 rounded-full bg-blue-400/50 float-delay" />
      <div className="absolute left-[8%] bottom-[28%] w-2 h-2 rounded-full bg-indigo-400/50 float-delay2" />
      <div className="absolute left-[20%] top-[18%] w-1.5 h-1.5 rounded-full bg-teal-300/40 float-delay" />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 w-full"
      >
        <div className="max-w-[68rem]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass text-teal-300 text-xs font-bold tracking-[0.22em] uppercase mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            NextWave Digital Solutions
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[0.98] tracking-tight text-white mb-6"
          >
            We Build{' '}
            <span className="shimmer-text">Websites, Apps, AI Automations</span>
            <br />
            & Custom Software for Growing Businesses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl leading-relaxed font-light"
          >
            At <span className="text-white font-semibold">NextWave Digital Solutions</span>, we help
            businesses move forward with{' '}
            <span className="text-white font-medium">modern websites</span>,{' '}
            <span className="text-white font-medium">business software</span>,{' '}
            <span className="text-white font-medium">management systems</span>, and{' '}
            <span className="text-white font-medium">AI-powered automation</span> built to improve
            efficiency, increase visibility, and support growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="grid sm:grid-cols-3 gap-3 mb-10 max-w-4xl"
          >
            {quickHighlights.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-4"
              >
                <CheckCircle2 className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-200 leading-relaxed">{item}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.38 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link to="/contact">
              <button className="group btn-primary inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold text-base shadow-lg shadow-cyan-500/10">
                Start Your Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <Link to="/services">
              <button className="group btn-secondary inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold text-base backdrop-blur-sm border border-white/10">
                <span>View Our Services</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {childrenBeforeStats}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48 }}
            className="flex flex-wrap gap-x-10 gap-y-6"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-left">
                <div className="font-display text-3xl font-bold text-white">
                  {s.value}
                  {s.suffix}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 tracking-widest uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
