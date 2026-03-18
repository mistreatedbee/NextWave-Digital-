import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Code2, Smartphone, Globe, LayoutDashboard,
  ArrowRight, CheckCircle2,
  Sparkles, Zap, Shield, Users, ChevronRight,
  Brain, Database, TrendingUp, Layers,
  ArrowUpRight, Star
} from 'lucide-react';

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
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
  const [pos, setPos] = useState({ x: -300, y: -300 });
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div
      className="pointer-events-none fixed z-[999] w-96 h-96 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 65%)',
        transform: `translate(${pos.x - 192}px, ${pos.y - 192}px)`,
        transition: 'transform 0.12s ease-out',
      }}
    />
  );
}

// ─── Scroll reveal ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 30, x = 0 }: {
  children: React.ReactNode; delay?: number; y?: number; x?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Marquee strip ───────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'AI Automation', 'Software Development', 'Digital Transformation',
  'Cloud Architecture', 'Mobile Applications', 'Enterprise Systems',
  'UI/UX Design', 'Data Intelligence', 'Cybersecurity', 'API Integration',
];
function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden py-5 border-y border-white/[0.05]"
      style={{ background: 'linear-gradient(90deg, rgba(20,184,166,0.03), rgba(99,102,241,0.03))' }}>
      <motion.div
        className="flex gap-14 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-[10px] font-bold tracking-[0.28em] uppercase text-slate-600 hover:text-teal-400 transition-colors cursor-default">
            <span className="w-1 h-1 rounded-full bg-teal-500/50 inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Logo mark SVG ────────────────────────────────────────────────────────────
function LogoMark({ size = 520 }: { size?: number }) {
  return (
    <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }} aria-hidden="true">
      <defs>
        <radialGradient id="hcg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hrg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="hrg2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="hig" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="hwg1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0" />
          <stop offset="35%" stopColor="#2DD4BF" stopOpacity="0.95" />
          <stop offset="65%" stopColor="#3B82F6" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hwg2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
          <stop offset="30%" stopColor="#6366F1" stopOpacity="0.8" />
          <stop offset="65%" stopColor="#2DD4BF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="hcc"><circle cx="210" cy="210" r="178" /></clipPath>
      </defs>
      <circle cx="210" cy="210" r="205" fill="url(#hcg)" />
      <circle cx="210" cy="210" r="172" stroke="url(#hrg1)" strokeWidth="0.75" fill="none" strokeDasharray="7 5" opacity="0.55" />
      <circle cx="210" cy="210" r="132" stroke="url(#hrg2)" strokeWidth="0.6" fill="none" strokeDasharray="3 9" opacity="0.45" />
      <circle cx="210" cy="210" r="94" stroke="url(#hig)" strokeWidth="1.25" fill="none" opacity="0.75" />
      <g opacity="0.18" stroke="#2DD4BF" strokeWidth="0.4">
        <line x1="55" y1="55" x2="365" y2="365" />
        <line x1="365" y1="55" x2="55" y2="365" />
        <line x1="210" y1="30" x2="210" y2="390" />
        <line x1="30" y1="210" x2="390" y2="210" />
      </g>
      <g clipPath="url(#hcc)" opacity="0.055">
        {Array.from({ length: 44 }).map((_, i) => (
          <line key={i} x1="28" y1={36 + i * 8} x2="392" y2={36 + i * 8} stroke="#2DD4BF" strokeWidth="0.5" />
        ))}
      </g>
      <g clipPath="url(#hcc)">
        <path d="M 76 190 C 110 162, 144 218, 178 190 C 212 162, 246 218, 280 190 C 310 166, 336 212, 350 196" stroke="url(#hwg1)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />
        <path d="M 70 210 C 104 182, 138 238, 172 210 C 206 182, 240 238, 274 210 C 306 182, 338 234, 352 218" stroke="url(#hwg1)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 76 230 C 110 202, 144 258, 178 230 C 212 202, 246 258, 280 230 C 312 202, 338 250, 352 234" stroke="url(#hwg2)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
        <path d="M 86 250 C 118 224, 150 276, 184 250 C 214 224, 246 272, 276 250 C 308 224, 336 270, 348 256" stroke="url(#hwg2)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
      </g>
      {[
        { cx: 210, cy: 38,  r: 4,   fill: "#2DD4BF", o: 0.85 },
        { cx: 382, cy: 210, r: 3,   fill: "#6366F1", o: 0.7 },
        { cx: 210, cy: 382, r: 3.5, fill: "#3B82F6", o: 0.65 },
        { cx: 38,  cy: 210, r: 2.5, fill: "#2DD4BF", o: 0.5 },
        { cx: 341, cy: 83,  r: 2,   fill: "#2DD4BF", o: 0.6 },
        { cx: 79,  cy: 337, r: 2,   fill: "#6366F1", o: 0.55 },
        { cx: 337, cy: 337, r: 1.5, fill: "#3B82F6", o: 0.45 },
      ].map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.fill} opacity={dot.o} />
      ))}
      <circle cx="210" cy="210" r="20" fill="#060a12" stroke="#2DD4BF" strokeWidth="1.25" opacity="0.92" />
      <circle cx="210" cy="210" r="9"  fill="#2DD4BF" opacity="0.88" />
      <circle cx="210" cy="210" r="3.5" fill="#FFFFFF" opacity="0.96" />
    </svg>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────────
const colorMap: Record<string, { icon: string; border: string; glow: string; text: string }> = {
  teal:    { icon: 'text-teal-400',    border: 'hover:border-teal-500/40',    glow: 'rgba(20,184,166,0.14)',  text: 'text-teal-400' },
  blue:    { icon: 'text-blue-400',    border: 'hover:border-blue-500/40',    glow: 'rgba(59,130,246,0.14)',  text: 'text-blue-400' },
  indigo:  { icon: 'text-indigo-400',  border: 'hover:border-indigo-500/40',  glow: 'rgba(99,102,241,0.14)',  text: 'text-indigo-400' },
  emerald: { icon: 'text-emerald-400', border: 'hover:border-emerald-500/40', glow: 'rgba(52,211,153,0.14)',  text: 'text-emerald-400' },
  violet:  { icon: 'text-violet-400',  border: 'hover:border-violet-500/40',  glow: 'rgba(167,139,250,0.14)', text: 'text-violet-400' },
  cyan:    { icon: 'text-cyan-400',    border: 'hover:border-cyan-500/40',    glow: 'rgba(34,211,238,0.14)',  text: 'text-cyan-400' },
};

function ServiceCard({ icon, title, desc, color, delay, index }: {
  icon: React.ReactNode; title: string; desc: string; color: string; delay: number; index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const c = colorMap[color] || colorMap.teal;
  return (
    <Reveal delay={delay} y={28}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={hovered
          ? { y: -8, boxShadow: `0 28px 70px rgba(0,0,0,0.4), 0 0 0 1px ${c.glow}` }
          : { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' }}
        transition={{ duration: 0.3, ease: [0.34, 1.4, 0.64, 1] }}
        className={`relative rounded-2xl p-7 h-full cursor-default group border border-white/[0.06] ${c.border} transition-colors duration-300`}
        style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)', backdropFilter: 'blur(16px)' }}
      >
        <span className="absolute top-6 right-6 font-display text-5xl font-bold text-white/[0.03] select-none pointer-events-none">
          {String(index + 1).padStart(2, '0')}
        </span>
        <motion.div
          animate={hovered ? { scale: 1.12, rotate: -5 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.28, ease: [0.34, 1.4, 0.64, 1] }}
          className={`inline-flex p-3.5 rounded-xl mb-5 border border-white/[0.08] bg-white/[0.04] ${c.icon}`}
        >
          {icon}
        </motion.div>
        <h3 className="font-display text-[15px] font-bold text-white mb-2.5 tracking-tight">{title}</h3>
        <p className="text-[13.5px] text-slate-400 leading-relaxed mb-5">{desc}</p>
        <motion.div
          animate={hovered ? { x: 4 } : { x: 0 }}
          className={`flex items-center gap-1.5 text-xs font-semibold ${c.text} opacity-60 group-hover:opacity-100 transition-opacity`}
        >
          Learn more <ArrowUpRight className="w-3.5 h-3.5" />
        </motion.div>
      </motion.div>
    </Reveal>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
const PROJECTS = [
  { tag: 'AI Platform',       title: 'Nexus Automation Hub',   desc: 'End-to-end workflow automation reducing manual ops by 80%.', accent: '#2DD4BF' },
  { tag: 'Enterprise SaaS',   title: 'FleetView ERP',          desc: 'Real-time logistics management for a 200-vehicle fleet.',   accent: '#3B82F6' },
  { tag: 'Mobile App',        title: 'HealthSync Pro',         desc: 'Cross-platform health tracking app with 50k+ users.',       accent: '#6366F1' },
  { tag: 'POS System',        title: 'RetailPulse',            desc: 'Multi-location POS with live inventory and analytics.',     accent: '#10B981' },
  { tag: 'Digital Transform', title: 'BankCore Modernisation', desc: 'Legacy-to-cloud migration for a regional banking group.',   accent: '#8B5CF6' },
];

function ProjectCard({ tag, title, desc, accent, index }: {
  tag: string; title: string; desc: string; accent: string; index: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={hovered ? { y: -6 } : { y: 0 }}
      transition={{ duration: 0.28, ease: [0.34, 1.4, 0.64, 1] }}
      className="snap-start flex-shrink-0 w-[300px] rounded-2xl overflow-hidden cursor-pointer"
      style={{
        border: hovered ? `1px solid ${accent}40` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hovered ? `0 24px 60px rgba(0,0,0,0.45), 0 0 40px ${accent}18` : 'none',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        background: 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="h-44 relative overflow-hidden flex items-center justify-center"
        style={{ background: `linear-gradient(145deg, ${accent}18 0%, rgba(6,10,18,0.9) 100%)` }}>
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: `linear-gradient(${accent}18 1px, transparent 1px), linear-gradient(90deg,${accent}18 1px, transparent 1px)`, backgroundSize: '22px 22px' }} />
        <div className="absolute w-32 h-32 rounded-full blur-3xl"
          style={{ background: `${accent}25`, top: '10%', left: '50%', transform: 'translateX(-50%)' }} />
        <div className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center border border-white/10"
          style={{ background: `${accent}18`, backdropFilter: 'blur(8px)' }}>
          <TrendingUp className="w-7 h-7" style={{ color: accent }} />
        </div>
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${accent}30`, color: accent }}>
          {tag}
        </div>
        <span className="absolute bottom-3 right-4 font-display text-4xl font-bold select-none"
          style={{ color: `${accent}18` }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-5" style={{ background: 'rgba(6,10,18,0.6)', backdropFilter: 'blur(8px)' }}>
        <h3 className="font-display font-bold text-white text-sm mb-2">{title}</h3>
        <p className="text-[12px] text-slate-400 leading-relaxed">{desc}</p>
        <motion.div
          animate={hovered ? { x: 4, opacity: 1 } : { x: 0, opacity: 0.4 }}
          className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold"
          style={{ color: accent }}
        >
          Case study <ArrowUpRight className="w-3 h-3" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProjectShowcase() {
  return (
    <div className="relative overflow-hidden">
      <div className="flex gap-5 overflow-x-auto pb-4 px-6 lg:px-10 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {PROJECTS.map((p, i) => (
          <Reveal key={i} delay={i * 0.07} y={16}>
            <ProjectCard {...p} index={i} />
          </Reveal>
        ))}
      </div>
      <div className="absolute top-0 left-0 w-16 h-full pointer-events-none"
        style={{ background: 'linear-gradient(to right, #060a12, transparent)' }} />
      <div className="absolute top-0 right-0 w-28 h-full pointer-events-none"
        style={{ background: 'linear-gradient(to left, #060a12, transparent)' }} />
    </div>
  );
}

// ─── Testimonial card ─────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Sarah Okonkwo', role: 'CEO, Apex Logistics',     text: 'NextWave delivered our fleet management system months ahead of schedule. The quality of work was extraordinary.', stars: 5 },
  { name: 'James Mokoena', role: 'CTO, HealthBridge Africa', text: 'The AI automation they built saves our team over 20 hours a week. Game-changing ROI from day one.', stars: 5 },
  { name: 'Priya Naidoo',  role: 'MD, FreshMart Retail',    text: 'Our new e-commerce platform has doubled conversion rates. Their attention to UX detail is unmatched.', stars: 5 },
];

function TestimonialCard({ name, role, text, stars, delay }: typeof TESTIMONIALS[0] & { delay: number }) {
  return (
    <Reveal delay={delay} y={24}>
      <div className="rounded-2xl p-7 h-full border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300"
        style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 100%)', backdropFilter: 'blur(14px)' }}>
        <div className="flex gap-1 mb-5">
          {Array.from({ length: stars }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-teal-400 text-teal-400" />
          ))}
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light italic">"{text}"</p>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #0d9488, #1d4ed8)' }}>
            {name.charAt(0)}
          </div>
          <div>
            <div className="text-white text-xs font-semibold">{name}</div>
            <div className="text-slate-500 text-[11px]">{role}</div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY       = useTransform(scrollYProgress, [0, 1],    ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const logoY       = useTransform(scrollYProgress, [0, 1],    ['0%', '10%']);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.7],  [1, 0]);

  const services = [
    { icon: <Brain className="w-6 h-6" />,          color: 'teal',    title: 'AI & Automation',        desc: 'Intelligent agents and workflow automation that eliminate repetitive tasks and drive smarter decision-making across operations.' },
    { icon: <Code2 className="w-6 h-6" />,           color: 'blue',    title: 'Custom Software',        desc: 'Bespoke business software engineered precisely for your needs — no bloat, no compromises, no workarounds.' },
    { icon: <Globe className="w-6 h-6" />,           color: 'indigo',  title: 'Web Applications',       desc: 'Scalable, secure, high-performance web platforms and customer portals built with modern cloud architecture.' },
    { icon: <Smartphone className="w-6 h-6" />,      color: 'violet',  title: 'Mobile Apps',            desc: 'Native and cross-platform mobile applications for iOS and Android with seamless UX and offline-first capability.' },
    { icon: <Layers className="w-6 h-6" />,          color: 'cyan',    title: 'Digital Transformation', desc: 'End-to-end modernisation of legacy systems into agile, cloud-native platforms that scale with confidence.' },
    { icon: <LayoutDashboard className="w-6 h-6" />, color: 'emerald', title: 'Business Systems',       desc: 'Admin dashboards, CRMs, ERPs, and internal tools that give your team real-time visibility and full control.' },
  ];

  const stats = [
    { value: 120, suffix: '+',  label: 'Projects Delivered' },
    { value: 98,  suffix: '%',  label: 'Client Satisfaction' },
    { value: 5,   suffix: 'yr', label: 'Years of Excellence' },
    { value: 24,  suffix: '/7', label: 'Dedicated Support' },
  ];

  const processSteps = [
    { n: '01', title: 'Discover',   desc: 'Deep-dive into your goals, processes, and pain points to align on the right solution.' },
    { n: '02', title: 'Strategise', desc: 'Architect the optimal solution with a clear delivery roadmap and technology stack.' },
    { n: '03', title: 'Design',     desc: 'Precision UI/UX crafted for your users, your brand, and your industry context.' },
    { n: '04', title: 'Build',      desc: 'Agile development sprints with transparent progress, demos, and fast iteration.' },
    { n: '05', title: 'Launch',     desc: 'Seamless deployment, team onboarding, and ongoing partnership for sustained growth.' },
  ];

  const whyUs = [
    { icon: <Shield className="w-5 h-5 text-teal-400" />,     title: 'Enterprise-Grade Security', desc: 'Security baked in from day one, not bolted on later. ISO-aligned processes.' },
    { icon: <Zap className="w-5 h-5 text-blue-400" />,        title: 'Performance Obsessed',      desc: 'Sub-second load times, 99.9% uptime SLAs, and systems built for peak load.' },
    { icon: <Database className="w-5 h-5 text-indigo-400" />, title: 'Scalable by Design',        desc: 'Architecture that grows seamlessly with your business, without painful rewrites.' },
    { icon: <Users className="w-5 h-5 text-emerald-400" />,   title: 'Long-Term Partnership',     desc: 'We stay invested in your success well beyond launch — not just until delivery.' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
        .tg { background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 55%, #6366f1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .shimmer-text { background: linear-gradient(90deg, #14b8a6, #3b82f6, #6366f1, #14b8a6); background-size: 220% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 4.5s linear infinite; }
        @keyframes shimmer { 0% { background-position: -220% center; } 100% { background-position: 220% center; } }
        .hero-grid { background-image: linear-gradient(rgba(20,184,166,0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.032) 1px, transparent 1px); background-size: 60px 60px; }
        .glass { background: linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%); border: 1px solid rgba(255,255,255,0.07); backdrop-filter: blur(18px); }
        .glass-strong { background: linear-gradient(135deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.022) 100%); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(24px); }
        .btn-primary { background: linear-gradient(135deg, #0d9488 0%, #1e40af 100%); box-shadow: 0 6px 28px rgba(20,184,166,0.2), 0 2px 8px rgba(0,0,0,0.3); transition: all 0.2s ease; }
        .btn-primary:hover { background: linear-gradient(135deg, #14b8a6 0%, #2563eb 100%); box-shadow: 0 12px 44px rgba(20,184,166,0.36), 0 4px 12px rgba(0,0,0,0.3); transform: translateY(-2px); }
        .btn-secondary { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s ease; }
        .btn-secondary:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); transform: translateY(-1px); }
        @keyframes float { 0%,100% { transform: translateY(0); } 40% { transform: translateY(-12px); } 70% { transform: translateY(6px); } }
        .float        { animation: float 10s ease-in-out infinite; }
        .float-delay  { animation: float 10s ease-in-out infinite 3.5s; }
        .float-delay2 { animation: float 10s ease-in-out infinite 6s; }
        .section-tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 14px; border-radius: 999px; background: rgba(20,184,166,0.07); border: 1px solid rgba(20,184,166,0.18); font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #14b8a6; margin-bottom: 16px; }
        .dot-pulse { width: 7px; height: 7px; border-radius: 50%; background: #14b8a6; display: inline-block; animation: pr 2s ease-out infinite; }
        @keyframes pr { 0% { box-shadow: 0 0 0 0 rgba(20,184,166,0.65); } 70% { box-shadow: 0 0 0 9px rgba(20,184,166,0); } 100% { box-shadow: 0 0 0 0 rgba(20,184,166,0); } }
        .grad-line { height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(20,184,166,0.25) 30%, rgba(99,102,241,0.25) 70%, transparent 100%); }
      `}</style>

      <CursorGlow />

      <div className="min-h-screen font-body bg-[#060a12] text-white overflow-x-hidden">

        {/* ══ HERO ════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 hero-grid" />
          <div className="absolute top-[-12%] right-[-8%] w-[900px] h-[900px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, rgba(59,130,246,0.05) 45%, transparent 70%)', filter: 'blur(130px)' }} />
          <div className="absolute bottom-[-12%] left-[-8%] w-[750px] h-[750px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)', filter: 'blur(110px)' }} />
          <div className="absolute right-[20%] top-[24%] w-2.5 h-2.5 rounded-full bg-teal-400/45 float pointer-events-none" />
          <div className="absolute right-[32%] top-[70%] w-2   h-2   rounded-full bg-blue-400/40 float-delay pointer-events-none" />
          <div className="absolute left-[7%]  bottom-[26%] w-2   h-2   rounded-full bg-indigo-400/40 float-delay2 pointer-events-none" />
          <div className="absolute left-[18%] top-[20%]   w-1.5 h-1.5 rounded-full bg-teal-300/35 float-delay pointer-events-none" />

          {/* Large logo right */}
          <motion.div
            style={{ y: logoY, opacity: logoOpacity }}
            className="absolute right-[-6%] top-1/2 -translate-y-[52%] hidden xl:block pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 60 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.09) 0%, rgba(99,102,241,0.06) 50%, transparent 75%)', filter: 'blur(50px)', transform: 'scale(1.15)' }} />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}>
                <LogoMark size={720} />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}
            className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 w-full">
            <div className="max-w-[52rem]">
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass text-teal-400 text-[10px] font-bold tracking-[0.26em] uppercase mb-9"
              >
                <span className="dot-pulse" />
                NextWave Digital Solutions
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[clamp(2.75rem,6.8vw,5.6rem)] font-bold leading-[0.97] tracking-tight text-white mb-7"
              >
                Building Powerful<br />
                <span className="shimmer-text">Websites, Apps &amp;</span><br />
                <span className="shimmer-text">Business Software</span><br />
                <span className="text-white">For Modern Businesses</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed font-light"
              >
                We deliver{' '}
                <span className="text-white font-medium">AI automation</span>,{' '}
                <span className="text-white font-medium">custom software development</span>, and{' '}
                <span className="text-white font-medium">digital transformation</span>{' '}
                solutions that empower organisations to grow faster and operate smarter.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.32 }}
                className="flex flex-col sm:flex-row gap-4 mb-16"
              >
                <Link to="/contact">
                  <button className="group btn-primary inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold text-[15px] active:scale-[0.98] transition-transform">
                    Get a Consultation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link to="/services">
                  <button className="group btn-secondary inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold text-[15px] backdrop-blur-sm active:scale-[0.98] transition-transform">
                    Explore Solutions
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.46 }}
                className="flex flex-wrap gap-x-10 gap-y-5"
              >
                {stats.map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.46 + i * 0.07 }}
                    className="group text-left"
                  >
                    <div className="font-display text-[2rem] font-bold text-white group-hover:text-teal-300 transition-colors duration-300 leading-none mb-1">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-[10px] text-slate-600 tracking-[0.26em] uppercase">{s.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        <Marquee />

        {/* ══ SERVICES ════════════════════════════════════════════════ */}
        <section className="py-32 relative">
          <div className="absolute right-0 top-1/4 w-[560px] h-[560px] rounded-full pointer-events-none"
            style={{ background: 'rgba(59,130,246,0.045)', filter: 'blur(110px)' }} />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-16">
                <div>
                  <div className="section-tag"><Sparkles className="w-3 h-3" /> Our Capabilities</div>
                  <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-white leading-tight">
                    Solutions That Drive<br /><span className="tg">Real Results</span>
                  </h2>
                </div>
                <Link to="/services">
                  <button className="group flex items-center gap-2 text-sm text-slate-500 hover:text-teal-400 transition-colors font-medium whitespace-nowrap">
                    All services <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s, i) => <ServiceCard key={i} {...s} delay={i * 0.06} index={i} />)}
            </div>
          </div>
        </section>

        <div className="grad-line mx-10" />

        {/* ══ PROJECTS ════════════════════════════════════════════════ */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(20,184,166,0.025) 50%, transparent 100%)' }} />
          <div className="max-w-7xl mx-auto relative z-10">
            <Reveal>
              <div className="px-6 lg:px-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-12">
                <div>
                  <div className="section-tag"><TrendingUp className="w-3 h-3" /> Our Work</div>
                  <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-white leading-tight">
                    Projects We're<br /><span className="tg">Proud Of</span>
                  </h2>
                </div>
                <Link to="/portfolio">
                  <button className="group flex items-center gap-2 text-sm text-slate-500 hover:text-teal-400 transition-colors font-medium whitespace-nowrap">
                    Full portfolio <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </Link>
              </div>
            </Reveal>
            <ProjectShowcase />
          </div>
        </section>

        <div className="grad-line mx-10" />

        {/* ══ WHY US ══════════════════════════════════════════════════ */}
        <section className="py-32 relative">
          <div className="absolute left-0 top-1/3 w-[550px] h-[550px] rounded-full pointer-events-none"
            style={{ background: 'rgba(99,102,241,0.055)', filter: 'blur(110px)' }} />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <Reveal>
                <div>
                  <div className="section-tag"><Shield className="w-3 h-3" /> Why NextWave</div>
                  <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-white leading-tight mb-6">
                    We Build<br /><span className="tg">Business Assets</span>
                  </h2>
                  <p className="text-slate-400 mb-12 text-lg leading-relaxed font-light">
                    We don't just write code — we engineer digital assets that solve real problems,
                    deliver measurable ROI, and compound in value for years to come.
                  </p>
                  <div className="space-y-7">
                    {whyUs.map((item, i) => (
                      <Reveal key={i} delay={i * 0.09}>
                        <div className="flex gap-4 group cursor-default">
                          <div className="flex-shrink-0 w-11 h-11 rounded-xl glass flex items-center justify-center group-hover:border-teal-500/30 transition-all duration-300">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="font-display text-white font-semibold text-[14px] mb-1">{item.title}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="relative">
                  <div className="absolute -inset-8 rounded-3xl pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.07) 0%, rgba(99,102,241,0.07) 100%)', filter: 'blur(28px)' }} />
                  <div className="relative glass-strong rounded-2xl overflow-hidden"
                    style={{ boxShadow: '0 0 80px rgba(99,102,241,0.1), 0 2px 2px rgba(255,255,255,0.04) inset' }}>
                    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05]"
                      style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/75" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/75" />
                        <div className="w-3 h-3 rounded-full bg-green-500/75" />
                      </div>
                      <span className="text-[10px] text-slate-600 ml-auto font-mono tracking-wider">nextwave.config.ts</span>
                    </div>
                    <div className="p-7 font-mono text-[12.5px] leading-loose">
                      <div><span className="text-indigo-400">const</span> <span className="text-blue-300">NextWave</span> <span className="text-slate-400">= {'{'}</span></div>
                      {[
                        { k: 'excellence',    v: '"Uncompromising"',   c: 'text-green-300' },
                        { k: 'performance',   v: '"Sub-second"',       c: 'text-emerald-300' },
                        { k: 'security',      v: '"Enterprise-Grade"', c: 'text-teal-300' },
                        { k: 'scalability',   v: '"Cloud-Native"',     c: 'text-blue-300' },
                        { k: 'clientSuccess', v: '"Top Priority"',     c: 'text-violet-300' },
                      ].map((item, i) => (
                        <motion.div key={item.k}
                          initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.85 + i * 0.12, duration: 0.45 }}
                          className="pl-6 flex gap-2"
                        >
                          <span className="text-teal-400/80">{item.k}:</span>
                          <span className={item.c}>{item.v}</span>
                          <span className="text-slate-600">,</span>
                        </motion.div>
                      ))}
                      <div className="text-slate-400">{'}'}</div>
                      <div className="mt-4 pt-4 border-t border-white/[0.04] text-[11px]">
                        <span className="text-slate-600">// </span>
                        <span className="text-emerald-400">✓ All systems operational — 99.9% uptime</span>
                      </div>
                      <div className="mt-1 text-[11px]">
                        <span className="text-slate-600">// </span>
                        <span className="text-blue-400">⚡ Latest deploy: 2 minutes ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <div className="grad-line mx-10" />

        {/* ══ PROCESS ════════════════════════════════════════════════ */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(59,130,246,0.03) 50%, transparent 100%)' }} />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
            <Reveal>
              <div className="text-center mb-20">
                <div className="section-tag mx-auto w-fit"><Zap className="w-3 h-3" /> Our Process</div>
                <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-white mb-4">
                  How We <span className="tg">Deliver</span>
                </h2>
                <p className="text-slate-400 max-w-md mx-auto font-light text-lg leading-relaxed">
                  A transparent, agile delivery framework — from first conversation to long-term success.
                </p>
              </div>
            </Reveal>
            <div className="relative">
              <div className="hidden md:block absolute top-[38px] left-[12%] right-[12%] h-px"
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(20,184,166,0.22) 15%, rgba(99,102,241,0.22) 85%, transparent 100%)' }} />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {processSteps.map((step, i) => (
                  <Reveal key={i} delay={i * 0.09} y={20}>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.22 }}
                      className="flex flex-col items-center text-center group cursor-default">
                      <motion.div
                        whileHover={{ boxShadow: '0 0 44px rgba(20,184,166,0.22), 0 0 0 1px rgba(20,184,166,0.3)' }}
                        className="relative w-[76px] h-[76px] rounded-2xl glass flex items-center justify-center mb-6 z-10 border border-white/[0.07] group-hover:border-teal-500/30 transition-colors"
                      >
                        <span className="font-display text-2xl font-bold tg">{step.n}</span>
                      </motion.div>
                      <h3 className="font-display text-[13px] font-bold text-white mb-2 tracking-wide">{step.title}</h3>
                      <p className="text-[12px] text-slate-500 leading-relaxed max-w-[130px]">{step.desc}</p>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grad-line mx-10" />

        {/* ══ TESTIMONIALS ═══════════════════════════════════════════ */}
        <section className="py-32 relative">
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: 'rgba(20,184,166,0.04)', filter: 'blur(100px)' }} />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
            <Reveal>
              <div className="text-center mb-16">
                <div className="section-tag mx-auto w-fit"><Star className="w-3 h-3" /> Client Stories</div>
                <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-white">
                  Trusted by <span className="tg">Growing Businesses</span>
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} {...t} delay={i * 0.08} />)}
            </div>
          </div>
        </section>

        <div className="grad-line mx-10" />

        {/* ══ CTA ════════════════════════════════════════════════════ */}
        <section className="py-28 px-6 lg:px-10">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden p-14 md:p-24 text-center">
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(145deg, #050d1a 0%, #080e1f 50%, #060b16 100%)' }} />
                <div className="absolute inset-0 hero-grid opacity-25" />
                <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full pointer-events-none"
                  style={{ background: 'rgba(20,184,166,0.07)', filter: 'blur(90px)' }} />
                <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full pointer-events-none"
                  style={{ background: 'rgba(99,102,241,0.07)', filter: 'blur(80px)' }} />
                <div className="absolute inset-0 rounded-3xl border border-white/[0.06] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.5), transparent)' }} />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7"
                    style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.18)' }}>
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    <span className="text-[10px] font-bold tracking-[0.26em] uppercase text-teal-400">Let's Build Together</span>
                  </div>
                  <h2 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-bold text-white mb-5 leading-[1.05]">
                    Ready to Transform<br />
                    <span className="shimmer-text">Your Business?</span>
                  </h2>
                  <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto font-light leading-relaxed">
                    Partner with NextWave to build the digital infrastructure your organisation
                    needs to lead, scale, and compete.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <Link to="/contact">
                      <button className="group btn-primary inline-flex items-center gap-3 px-9 py-5 rounded-xl text-white font-bold text-[15px] active:scale-[0.98] transition-transform">
                        Get a Consultation
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                    <Link to="/services">
                      <button className="group btn-secondary inline-flex items-center gap-3 px-9 py-5 rounded-xl text-white font-bold text-[15px] backdrop-blur-sm active:scale-[0.98] transition-transform">
                        Explore Solutions
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-6">
                    {['No lock-in contracts', 'Free initial consultation', '99.9% uptime SLA', 'Dedicated account manager'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-[12px] text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
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
