import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';

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

// Animated logo mark – large, geometric, glowing
function LogoMark() {
  return (
    <svg
      viewBox="0 0 420 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        {/* Core teal glow */}
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#2DD4BF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
        </radialGradient>

        {/* Ring gradients */}
        <linearGradient id="ringGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#2DD4BF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="ringGrad2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#6366F1" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="innerGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#2DD4BF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="#2DD4BF" stopOpacity="0" />
          <stop offset="40%"  stopColor="#2DD4BF" stopOpacity="0.9" />
          <stop offset="70%"  stopColor="#3B82F6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="waveGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="#6366F1" stopOpacity="0" />
          <stop offset="30%"  stopColor="#6366F1" stopOpacity="0.7" />
          <stop offset="60%"  stopColor="#2DD4BF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
        </linearGradient>

        {/* Clip to circle */}
        <clipPath id="circClip">
          <circle cx="210" cy="210" r="180" />
        </clipPath>
      </defs>

      {/* Background glow halo */}
      <circle cx="210" cy="210" r="200" fill="url(#coreGlow)" />

      {/* Outer orbit ring */}
      <circle
        cx="210" cy="210" r="170"
        stroke="url(#ringGrad1)"
        strokeWidth="1"
        fill="none"
        strokeDasharray="8 6"
        opacity="0.6"
      />

      {/* Mid orbit ring */}
      <circle
        cx="210" cy="210" r="130"
        stroke="url(#ringGrad2)"
        strokeWidth="0.75"
        fill="none"
        strokeDasharray="4 8"
        opacity="0.5"
      />

      {/* Inner filled ring */}
      <circle
        cx="210" cy="210" r="92"
        stroke="url(#innerGrad)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />

      {/* Rotating diagonal cross lines (orbit accent) */}
      <g opacity="0.25" stroke="#2DD4BF" strokeWidth="0.5">
        <line x1="60"  y1="60"  x2="360" y2="360" />
        <line x1="360" y1="60"  x2="60"  y2="360" />
      </g>

      {/* Horizontal scan lines clipped to circle */}
      <g clipPath="url(#circClip)" opacity="0.07">
        {Array.from({ length: 40 }).map((_, i) => (
          <line
            key={i}
            x1="30" y1={40 + i * 9}
            x2="390" y2={40 + i * 9}
            stroke="#2DD4BF"
            strokeWidth="0.5"
          />
        ))}
      </g>

      {/* Wave mark – the "W" stylized as stacked waves */}
      <g clipPath="url(#circClip)">
        {/* Wave 1 – top */}
        <path
          d="M 80 188
             C 112 162, 142 218, 174 192
             C 206 166, 236 222, 268 196
             C 300 170, 330 226, 350 200"
          stroke="url(#waveGrad)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Wave 2 – mid */}
        <path
          d="M 72 210
             C 104 184, 136 240, 168 214
             C 200 188, 232 244, 264 218
             C 296 192, 328 248, 352 222"
          stroke="url(#waveGrad)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Wave 3 – lower */}
        <path
          d="M 80 232
             C 112 206, 144 262, 176 236
             C 208 210, 240 266, 270 240
             C 300 214, 330 268, 348 244"
          stroke="url(#waveGrad2)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />
        {/* Wave 4 – bottom faint */}
        <path
          d="M 90 252
             C 120 228, 150 280, 182 256
             C 210 232, 240 282, 268 258
             C 298 234, 326 282, 344 260"
          stroke="url(#waveGrad2)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>

      {/* Orbit dots */}
      <circle cx="210" cy="40"  r="3.5" fill="#2DD4BF" opacity="0.8" />
      <circle cx="380" cy="210" r="2.5" fill="#6366F1" opacity="0.7" />
      <circle cx="210" cy="380" r="3"   fill="#3B82F6" opacity="0.6" />
      <circle cx="40"  cy="210" r="2"   fill="#2DD4BF" opacity="0.5" />

      {/* Small accent dots on mid ring */}
      <circle cx="337" cy="87"  r="2" fill="#2DD4BF" opacity="0.6" />
      <circle cx="83"  cy="337" r="2" fill="#6366F1" opacity="0.6" />

      {/* Center core */}
      <circle cx="210" cy="210" r="18" fill="#0F172A" stroke="#2DD4BF" strokeWidth="1.5" opacity="0.9" />
      <circle cx="210" cy="210" r="8"  fill="#2DD4BF" opacity="0.9" />
      <circle cx="210" cy="210" r="3"  fill="#FFFFFF" opacity="0.95" />
    </svg>
  );
}

export function HeroSection({ heroRef, stats, childrenBeforeStats }: HeroSectionProps) {
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY       = useTransform(scrollYProgress, [0, 1],    ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Logo parallax – slightly slower than content for depth
  const logoY       = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden"
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 hero-grid" />

      {/* Teal/blue ambient blob – top right */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[900px] h-[900px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(20,184,166,0.13) 0%, rgba(59,130,246,0.07) 45%, transparent 70%)',
          filter: 'blur(140px)',
        }}
      />
      {/* Indigo blob – bottom left */}
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 60%)',
          filter: 'blur(120px)',
        }}
      />
      {/* Subtle horizontal rule behind logo */}
      <div
        className="absolute inset-y-0 right-0 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(45,212,191,0.12) 40%, rgba(99,102,241,0.12) 70%, transparent)' }}
      />

      {/* Floating accent dots */}
      <div className="absolute right-[19%] top-[24%] w-2.5 h-2.5 rounded-full bg-teal-400/50 float" />
      <div className="absolute right-[34%] top-[68%] w-2   h-2   rounded-full bg-blue-400/45 float-delay" />
      <div className="absolute left-[7%]  bottom-[30%] w-2 h-2   rounded-full bg-indigo-400/45 float-delay2" />
      <div className="absolute left-[19%] top-[19%]  w-1.5 h-1.5 rounded-full bg-teal-300/35 float-delay" />
      <div className="absolute right-[10%] bottom-[22%] w-1.5 h-1.5 rounded-full bg-indigo-300/35 float-delay2" />

      {/* ── Large logo – right side, fixed behind content ── */}
      <motion.div
        style={{ y: logoY, opacity: logoOpacity }}
        className="absolute right-[-4%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-[540px] h-[540px] lg:w-[680px] lg:h-[680px] xl:w-[760px] xl:h-[760px]"
        >
          {/* Soft glow behind logo */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(20,184,166,0.10) 0%, rgba(99,102,241,0.07) 50%, transparent 75%)',
              filter: 'blur(40px)',
            }}
          />
          {/* Slow spin wrapper */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
            style={{ transformOrigin: 'center' }}
          >
            <LogoMark />
          </motion.div>
          {/* Counter-spin inner waves – stays upright */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
            style={{ transformOrigin: 'center' }}
          >
            {/* We render just the waves in counter-rotation so they stay readable */}
            <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="wGrad1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"  stopColor="#2DD4BF" stopOpacity="0" />
                  <stop offset="35%" stopColor="#2DD4BF" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="wGrad2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"  stopColor="#6366F1" stopOpacity="0" />
                  <stop offset="30%" stopColor="#6366F1" stopOpacity="0.75" />
                  <stop offset="65%" stopColor="#2DD4BF" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
                </linearGradient>
                <clipPath id="wClip">
                  <circle cx="210" cy="210" r="85" />
                </clipPath>
              </defs>
              <g clipPath="url(#wClip)">
                <path d="M 128 195 C 148 175, 168 215, 188 195 C 208 175, 228 215, 248 195 C 268 175, 288 215, 295 200"
                  stroke="url(#wGrad1)" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 125 210 C 145 190, 165 230, 185 210 C 205 190, 225 230, 245 210 C 265 190, 285 230, 296 215"
                  stroke="url(#wGrad1)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 128 226 C 148 206, 168 246, 188 226 C 208 206, 228 246, 248 226 C 268 206, 288 246, 294 230"
                  stroke="url(#wGrad2)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85" />
              </g>
              {/* Center dot stays visible */}
              <circle cx="210" cy="210" r="5" fill="#2DD4BF" opacity="0.9" />
              <circle cx="210" cy="210" r="2.5" fill="#FFFFFF" opacity="0.95" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Main content ── */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 w-full"
      >
        <div className="max-w-[52rem]">

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(2.8rem,6.5vw,5.8rem)] font-bold leading-[0.96] tracking-tight text-white mb-7"
          >
            Building Powerful{' '}
            <span className="shimmer-text">
              Websites, Apps &amp; Business Software
            </span>
            <br />
            For Modern Businesses
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl text-slate-300/90 mb-9 max-w-2xl leading-relaxed font-light"
          >
            We help businesses move forward with{' '}
            <span className="text-white font-medium">modern websites</span>,{' '}
            <span className="text-white font-medium">business software</span>,{' '}
            <span className="text-white font-medium">management systems</span>, and{' '}
            <span className="text-white font-medium">AI-powered automation</span> built to
            improve efficiency, increase visibility, and support growth.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28 }}
            className="grid sm:grid-cols-3 gap-3 mb-10 max-w-3xl"
          >
            {quickHighlights.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28 + i * 0.08 }}
                className="group flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-md px-4 py-4 transition-colors duration-300"
              >
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-200/90 leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link to="/contact">
              <button className="group btn-primary inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold text-base shadow-lg shadow-cyan-500/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                Start Your Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <Link to="/services">
              <button className="group btn-secondary inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold text-base backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-200">
                <span>View Our Services</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {childrenBeforeStats}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap gap-x-10 gap-y-6"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.07 }}
                className="text-left group"
              >
                <div className="font-display text-3xl font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
                  {s.value}{s.suffix}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 tracking-widest uppercase">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
