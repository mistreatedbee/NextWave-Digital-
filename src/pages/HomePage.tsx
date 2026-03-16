import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Code2, Smartphone, Globe, LayoutDashboard,
  Bot, ShoppingCart, ArrowRight, CheckCircle2,
  Sparkles, Zap, Shield, Users, ChevronRight,
  Brain, Database, Cloud, Lock, Layers, TrendingUp
} from 'lucide-react';

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(id); }
      else setCount(start);
    }, 16);
    return () => clearInterval(id);
  }, [inView, to]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Cursor glow ─────────────────────────────────────────────────────────────
function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div
      className="pointer-events-none fixed z-[999] w-72 h-72 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)',
        transform: `translate(${pos.x - 144}px, ${pos.y - 144}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
}

// ─── Reveal on scroll ─────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 32, x = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'AI Automation', 'Software Development', 'Digital Transformation',
  'Cloud Architecture', 'Mobile Applications', 'Enterprise Systems',
  'UI/UX Design', 'Data Intelligence', 'Cybersecurity',
];
function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden py-4 bg-teal-500/[0.04] border-y border-teal-500/10">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-4 text-xs font-bold tracking-[0.22em] uppercase text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Project card for scrolling showcase ─────────────────────────────────────
const PROJECTS = [
  { tag: 'AI Platform', title: 'Nexus Automation Hub', desc: 'End-to-end workflow automation reducing manual ops by 80%.', color: 'teal', gradient: 'from-teal-900/60 to-slate-900/80' },
  { tag: 'Enterprise SaaS', title: 'FleetView ERP', desc: 'Real-time logistics management for a 200-vehicle fleet.', color: 'blue', gradient: 'from-blue-900/60 to-slate-900/80' },
  { tag: 'Mobile App', title: 'HealthSync Pro', desc: 'Cross-platform health tracking app with 50k+ users.', color: 'indigo', gradient: 'from-indigo-900/60 to-slate-900/80' },
  { tag: 'POS System', title: 'RetailPulse', desc: 'Multi-location POS with live inventory and analytics.', color: 'emerald', gradient: 'from-emerald-900/60 to-slate-900/80' },
  { tag: 'Digital Transform', title: 'BankCore Modernisation', desc: 'Legacy-to-cloud migration for a regional banking group.', color: 'violet', gradient: 'from-violet-900/60 to-slate-900/80' },
];

function ProjectShowcase() {
  return (
    <div className="relative overflow-hidden">
      <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 px-6 lg:px-8 snap-x snap-mandatory">
        {PROJECTS.map((p, i) => (
          <Reveal key={i} delay={i * 0.08} y={20}>
            <div className={`snap-start flex-shrink-0 w-[300px] rounded-2xl overflow-hidden border border-white/[0.07] group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]`}>
              {/* Mock screen */}
              <div className={`h-44 bg-gradient-to-br ${p.gradient} relative flex items-center justify-center`}>
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'linear-gradient(rgba(20,184,166,0.08) 1px, transparent 1px), linear-gradient(90deg,rgba(20,184,166,0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="w-8 h-8 text-teal-400" />
                </div>
                <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] font-bold tracking-wider text-teal-400 uppercase backdrop-blur-sm">
                  {p.tag}
                </div>
              </div>
              <div className="p-5 bg-[#0b1120]">
                <h3 className="font-display font-bold text-white text-base mb-1.5">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-slate-600 group-hover:text-teal-400 transition-colors">
                  View case study <ArrowRight className="w-3 h-3 ml-0.5" />
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      {/* Fade edges */}
      <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-[#060a12] to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#060a12] to-transparent pointer-events-none" />
    </div>
  );
}

// ─── Interactive service icon card ────────────────────────────────────────────
function ServiceCard({ icon, title, desc, color, delay }) {
  const [hovered, setHovered] = useState(false);
  const colorStyles = {
    teal:    { badge: 'text-teal-400 bg-teal-400/10 border-teal-400/25',    glow: 'rgba(20,184,166,0.18)'  },
    blue:    { badge: 'text-blue-400 bg-blue-400/10 border-blue-400/25',    glow: 'rgba(59,130,246,0.18)'  },
    indigo:  { badge: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/25', glow: 'rgba(99,102,241,0.18)' },
    emerald: { badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25', glow: 'rgba(52,211,153,0.18)' },
    violet:  { badge: 'text-violet-400 bg-violet-400/10 border-violet-400/25', glow: 'rgba(167,139,250,0.18)' },
    cyan:    { badge: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',    glow: 'rgba(34,211,238,0.18)'  },
  };
  const c = colorStyles[color] || colorStyles.teal;

  return (
    <Reveal delay={delay} y={24}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={hovered ? { y: -6, boxShadow: `0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px ${c.glow}` } : { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="rounded-2xl p-6 cursor-default h-full"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)' }}
      >
        <motion.div
          animate={hovered ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.25 }}
          className={`inline-flex p-3 rounded-xl border mb-4 ${c.badge}`}
        >
          {icon}
        </motion.div>
        <h3 className="font-display text-base font-bold text-white mb-2">{title}</h3>
        <AnimatePresence>
          {hovered ? (
            <motion.p
              key="desc"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-slate-300 leading-relaxed overflow-hidden"
            >
              {desc}
            </motion.p>
          ) : (
            <motion.p
              key="short"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-slate-500 leading-relaxed"
            >
              {desc.slice(0, 55)}…
            </motion.p>
          )}
        </AnimatePresence>
        <motion.div
          animate={hovered ? { x: 4, opacity: 1 } : { x: 0, opacity: 0.4 }}
          className={`mt-5 flex items-center gap-1.5 text-xs font-semibold ${c.badge.split(' ')[0]}`}
        >
          Learn more <ArrowRight className="w-3 h-3" />
        </motion.div>
      </motion.div>
    </Reveal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY      = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const services = [
    { icon: <Brain className="w-6 h-6" />,        color: 'teal',    title: 'AI & Automation',       desc: 'Intelligent agents and workflow automation that eliminate repetitive manual tasks and drive smarter decision-making across your operations.' },
    { icon: <Code2 className="w-6 h-6" />,         color: 'blue',    title: 'Custom Software',       desc: 'Bespoke business software engineered precisely for your operational needs — no bloat, no compromises.' },
    { icon: <Globe className="w-6 h-6" />,         color: 'indigo',  title: 'Web Applications',      desc: 'Scalable, secure, high-performance web platforms and customer portals built with modern architecture.' },
    { icon: <Smartphone className="w-6 h-6" />,    color: 'violet',  title: 'Mobile Apps',           desc: 'Native and cross-platform mobile applications for iOS and Android with seamless UX and offline-first capability.' },
    { icon: <Layers className="w-6 h-6" />,        color: 'cyan',    title: 'Digital Transformation', desc: 'End-to-end modernisation of legacy systems into agile, cloud-native platforms that scale with confidence.' },
    { icon: <LayoutDashboard className="w-6 h-6" />, color: 'emerald', title: 'Business Systems',   desc: 'Admin dashboards, CRMs, ERPs, and internal tools that give your team real-time visibility and control.' },
  ];

  const stats = [
    { value: 120, suffix: '+', label: 'Projects Delivered' },
    { value: 98,  suffix: '%', label: 'Client Satisfaction' },
    { value: 5,   suffix: 'yr', label: 'Years of Excellence' },
    { value: 24,  suffix: '/7', label: 'Dedicated Support' },
  ];

  const processSteps = [
    { number: '01', title: 'Discover',   desc: 'Deep-dive into your goals, processes, and pain points.' },
    { number: '02', title: 'Strategise', desc: 'Architect the optimal solution with a clear roadmap.' },
    { number: '03', title: 'Design',     desc: 'Precision UI/UX crafted for your users and brand.' },
    { number: '04', title: 'Build',      desc: 'Agile development with transparent progress updates.' },
    { number: '05', title: 'Launch',     desc: 'Seamless deployment, onboarding, and ongoing growth.' },
  ];

  const trusts = [
    { icon: <Shield className="w-5 h-5 text-teal-400" />,   title: 'Enterprise-Grade Security',  desc: 'Security baked in from day one, not bolted on later.' },
    { icon: <Zap className="w-5 h-5 text-blue-400" />,      title: 'Performance Obsessed',       desc: 'Sub-second load times and 99.9% uptime SLAs.' },
    { icon: <Database className="w-5 h-5 text-indigo-400" />, title: 'Scalable by Design',       desc: 'Architecture that grows seamlessly with your business.' },
    { icon: <Users className="w-5 h-5 text-emerald-400" />, title: 'Long-Term Partnership',      desc: 'We stay invested in your success well beyond launch.' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .font-display { font-family: 'Syne', sans-serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }

        .text-gradient-primary {
          background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 55%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #14b8a6, #3b82f6, #6366f1, #14b8a6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .hero-grid {
          background-image:
            linear-gradient(rgba(20,184,166,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,184,166,0.035) 1px, transparent 1px);
          background-size: 56px 56px;
        }

        .glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(18px);
        }

        .glass-strong {
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(24px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #0d9488 0%, #1d4ed8 100%);
          box-shadow: 0 8px 32px rgba(20,184,166,0.22), 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #14b8a6 0%, #2563eb 100%);
          box-shadow: 0 14px 48px rgba(20,184,166,0.38), 0 4px 12px rgba(0,0,0,0.35);
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.2s ease;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-1px);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          40%       { transform: translateY(-14px) rotate(1.5deg); }
          70%       { transform: translateY(7px) rotate(-1deg); }
        }
        .float        { animation: float 9s ease-in-out infinite; }
        .float-delay  { animation: float 9s ease-in-out infinite 3s; }
        .float-delay2 { animation: float 9s ease-in-out infinite 5.5s; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .section-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px;
          border-radius: 999px;
          background: rgba(20,184,166,0.08);
          border: 1px solid rgba(20,184,166,0.2);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #14b8a6;
          margin-bottom: 16px;
        }

        .dot-pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: #14b8a6;
          display: inline-block;
          animation: pulse-ring 1.8s ease-out infinite;
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(20,184,166,0.6); }
          70%  { box-shadow: 0 0 0 8px rgba(20,184,166,0); }
          100% { box-shadow: 0 0 0 0 rgba(20,184,166,0); }
        }
      `}</style>

      <CursorGlow />

      <div className="min-h-screen font-body bg-[#060a12] text-white overflow-x-hidden">

        {/* ════════════════════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">

          {/* Grid */}
          <div className="absolute inset-0 hero-grid" />

          {/* Atmospheric glows */}
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full blur-[140px]"
            style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.09) 0%, rgba(59,130,246,0.04) 50%, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full blur-[120px]"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 60%)' }} />

          {/* Floating orbs */}
          <div className="absolute right-[18%] top-[22%] w-2.5 h-2.5 rounded-full bg-teal-400/50 float" />
          <div className="absolute right-[30%] top-[65%] w-2 h-2 rounded-full bg-blue-400/50 float-delay" />
          <div className="absolute left-[8%] bottom-[28%] w-2 h-2 rounded-full bg-indigo-400/50 float-delay2" />
          <div className="absolute left-[20%] top-[18%] w-1.5 h-1.5 rounded-full bg-teal-300/40 float-delay" />

          <motion.div style={{ y: heroY, opacity: heroOpacity }}
            className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 w-full">
            <div className="max-w-[62rem]">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass text-teal-400 text-xs font-bold tracking-widest uppercase mb-8"
              >
                <span className="dot-pulse" />
                NextWave Digital Solutions
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[clamp(2.6rem,7.5vw,5.5rem)] font-bold leading-[1.03] tracking-tight text-white mb-6"
              >
                Driving Excellence<br />
                Through{' '}
                <span className="shimmer-text">Digital Innovation</span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed font-light"
              >
                We deliver <span className="text-white font-medium">AI automation</span>,{' '}
                <span className="text-white font-medium">custom software development</span>, and{' '}
                <span className="text-white font-medium">digital transformation</span> solutions
                that empower organisations to grow faster and operate smarter.
              </motion.p>

              {/* CTA */}
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

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.48 }}
                className="flex flex-wrap gap-x-10 gap-y-6"
              >
                {stats.map((s, i) => (
                  <div key={i} className="text-left">
                    <div className="font-display text-3xl font-bold text-white">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 tracking-widest uppercase">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Floating code card — desktop */}
          <motion.div
            initial={{ opacity: 0, x: 60, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-10 top-1/2 -translate-y-[55%] hidden xl:block"
          >
            <div className="glass-strong rounded-2xl p-6 w-[320px] float"
              style={{ boxShadow: '0 0 60px rgba(20,184,166,0.12), 0 0 120px rgba(20,184,166,0.04)' }}>
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.07]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[11px] text-slate-600 ml-auto font-mono">nextwave.config.ts</span>
              </div>
              <div className="space-y-2 font-mono text-[13px] leading-relaxed">
                <div><span className="text-indigo-400">const</span> <span className="text-blue-300">config</span> <span className="text-white">= {'{'}</span></div>
                {[
                  ['innovation',  '"Relentless"'],
                  ['quality',     '"Premium"'],
                  ['security',    '"Enterprise"'],
                  ['delivery',    '"On-Time"'],
                  ['support',     '"24 / 7"'],
                ].map(([k, v], i) => (
                  <motion.div key={k}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="pl-5 flex gap-2"
                  >
                    <span className="text-teal-400">{k}:</span>
                    <span className="text-green-300">{v}</span>
                    <span className="text-slate-600">,</span>
                  </motion.div>
                ))}
                <div className="text-white">{'}'}</div>
                <div className="pt-2 mt-1 border-t border-white/[0.05] text-[11px]">
                  <span className="text-slate-600">// </span>
                  <span className="text-emerald-400">✓ Ready to innovate</span>
                </div>
              </div>
            </div>
          </motion.div>

        </section>

        {/* ═══ MARQUEE ═════════════════════════════════════════════════════ */}
        <Marquee />

        {/* ════════════════════════════════════════════════════════════════
            SERVICES
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-28 relative">
          <div className="absolute right-0 top-1/2 w-[500px] h-[500px] rounded-full blur-[100px] -translate-y-1/2"
            style={{ background: 'rgba(59,130,246,0.05)' }} />

          <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
            <Reveal>
              <div className="mb-16">
                <div className="section-tag"><Sparkles className="w-3 h-3" /> Our Capabilities</div>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
                    Solutions That<br /><span className="text-gradient-primary">Drive Real Results</span>
                  </h2>
                  <Link to="/services">
                    <button className="group flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors font-medium">
                      All services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s, i) => (
                <ServiceCard key={i} {...s} delay={i * 0.07} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            PROJECT SHOWCASE
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-950/10 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <Reveal>
              <div className="px-6 lg:px-10 mb-12">
                <div className="section-tag"><TrendingUp className="w-3 h-3" /> Our Work</div>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
                    Projects We're<br /><span className="text-gradient-primary">Proud Of</span>
                  </h2>
                  <Link to="/portfolio">
                    <button className="group flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors font-medium">
                      Full portfolio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            </Reveal>
            <ProjectShowcase />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            WHY US
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-28 relative">
          <div className="absolute left-0 top-1/2 w-[500px] h-[500px] rounded-full blur-[100px] -translate-y-1/2"
            style={{ background: 'rgba(99,102,241,0.06)' }} />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

              <Reveal>
                <div>
                  <div className="section-tag"><Shield className="w-3 h-3" /> Why NextWave</div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                    We Build<br /><span className="text-gradient-primary">Business Assets</span>
                  </h2>
                  <p className="text-slate-400 mb-10 text-lg leading-relaxed font-light">
                    We don't just write code — we engineer digital assets that solve real problems,
                    deliver measurable ROI, and compound in value for years to come.
                  </p>
                  <div className="space-y-6">
                    {trusts.map((item, i) => (
                      <Reveal key={i} delay={i * 0.1}>
                        <div className="flex gap-4 group">
                          <div className="flex-shrink-0 w-11 h-11 rounded-xl glass flex items-center justify-center group-hover:border-teal-500/30 transition-all duration-300">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="font-display text-white font-semibold text-sm mb-1">{item.title}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="relative">
                  <div className="absolute -inset-6 rounded-3xl blur-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.08) 0%, rgba(99,102,241,0.08) 100%)' }} />
                  <div className="relative glass-strong rounded-3xl overflow-hidden"
                    style={{ boxShadow: '0 0 60px rgba(99,102,241,0.12)' }}>
                    {/* Terminal bar */}
                    <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-[11px] text-slate-600 ml-auto font-mono">system_status.ts</span>
                    </div>
                    <div className="p-6 font-mono text-[13px] space-y-2 leading-relaxed">
                      <div><span className="text-indigo-400">const</span> <span className="text-blue-300">NextWave</span> <span className="text-white">= {'{'}</span></div>
                      {[
                        ['excellence',      '"Uncompromising"'],
                        ['performance',     '"Sub-second"'],
                        ['security',        '"Enterprise-Grade"'],
                        ['scalability',     '"Cloud-Native"'],
                        ['clientSuccess',   '"Top Priority"'],
                      ].map(([k, v], i) => (
                        <motion.div key={k}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + i * 0.12 }}
                          className="pl-6 flex gap-2"
                        >
                          <span className="text-teal-400">{k}:</span>
                          <span className="text-green-300">{v}</span>
                          <span className="text-slate-600">,</span>
                        </motion.div>
                      ))}
                      <div className="text-white">{'}'}</div>
                      <div className="pt-3 mt-1 border-t border-white/[0.05] text-[12px]">
                        <span className="text-slate-600">// </span>
                        <span className="text-emerald-400">✓ All systems operational — 99.9% uptime</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            PROCESS
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
            <Reveal>
              <div className="text-center mb-20">
                <div className="section-tag mx-auto w-fit"><Zap className="w-3 h-3" /> Our Process</div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                  How We <span className="text-gradient-primary">Deliver</span>
                </h2>
                <p className="text-slate-400 max-w-lg mx-auto font-light text-lg leading-relaxed">
                  A transparent, agile delivery framework — from first conversation to long-term success.
                </p>
              </div>
            </Reveal>

            {/* Connecting line */}
            <div className="relative">
              <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.25) 20%, rgba(99,102,241,0.25) 80%, transparent)' }} />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {processSteps.map((step, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="flex flex-col items-center text-center group">
                      <motion.div
                        whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(20,184,166,0.25)' }}
                        className="relative w-20 h-20 rounded-2xl glass flex items-center justify-center mb-5 z-10 cursor-default transition-colors group-hover:border-teal-500/40"
                      >
                        <span className="font-display text-2xl font-bold text-gradient-primary">{step.number}</span>
                      </motion.div>
                      <h3 className="font-display text-sm font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-[130px]">{step.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            CTA BANNER
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 lg:px-10">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden p-14 md:p-20 text-center">
                {/* BG */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, #050d1a 0%, #081424 50%, #050912 100%)' }} />
                <div className="absolute inset-0 hero-grid opacity-30" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px]"
                  style={{ background: 'rgba(20,184,166,0.08)' }} />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[90px]"
                  style={{ background: 'rgba(99,102,241,0.08)' }} />
                <div className="absolute inset-0 rounded-3xl border border-white/[0.07]" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                    style={{ background: 'rgba(20,184,166,0.09)', border: '1px solid rgba(20,184,166,0.2)' }}>
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-[11px] font-bold tracking-widest uppercase text-teal-400">Let's Build Together</span>
                  </div>

                  <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
                    Ready to Transform<br />
                    <span className="shimmer-text">Your Business?</span>
                  </h2>
                  <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto font-light leading-relaxed">
                    Partner with NextWave to build the digital infrastructure
                    your organisation needs to lead, scale, and compete.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/contact">
                      <button className="group btn-primary inline-flex items-center gap-3 px-9 py-5 rounded-xl text-white font-bold text-base">
                        Get a Consultation
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                    <Link to="/services">
                      <button className="group btn-secondary inline-flex items-center gap-3 px-9 py-5 rounded-xl text-white font-bold text-base backdrop-blur-sm">
                        Explore Solutions
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>

                  {/* Trust row */}
                  <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                    {['No lock-in contracts', 'Free initial consultation', '99.9% uptime SLA', 'Dedicated account manager'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </div>
    </>
  );
}