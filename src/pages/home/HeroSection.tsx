import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLElement>;
  stats: { value: number; suffix: string; label: string }[];
  childrenBeforeStats?: React.ReactNode;
}

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
            'radial-gradient(circle, rgba(20,184,166,0.09) 0%, rgba(59,130,246,0.04) 50%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 60%)',
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
        <div className="max-w-[62rem]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass text-teal-400 text-xs font-bold tracking-widest uppercase mb-8"
          >
            <span className="dot-pulse" />
            NextWave Digital Solutions
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(2.6rem,7.5vw,5.5rem)] font-bold leading-[1.03] tracking-tight text-white mb-6"
          >
            Driving Excellence
            <br />
            Through <span className="shimmer-text">Digital Innovation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed font-light"
          >
            We deliver <span className="text-white font-medium">AI automation</span>,{' '}
            <span className="text-white font-medium">custom software development</span>, and{' '}
            <span className="text-white font-medium">digital transformation</span> solutions that
            empower organisations to grow faster and operate smarter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.34 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link to="/contact">
              <button className="group btn-primary inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold text-base">
                Get a Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/services">
              <button className="group btn-secondary inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold text-base backdrop-blur-sm">
                <span>Explore Solutions</span>
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

