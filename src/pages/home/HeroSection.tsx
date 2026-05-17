import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

const WA_BASE = 'https://wa.me/27731531188?text=';

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 50);
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(id); }
      else setCount(start);
    }, 22);
    return () => clearInterval(id);
  }, [inView, to]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Slide data ───────────────────────────────────────────────────────────────
const WA_WEBSITE  = `${WA_BASE}Hi%20NextWave%20Digital%20Solutions%2C%20I%20want%20to%20book%20a%20Website.`;
const WA_ECOM     = `${WA_BASE}Hi%20NextWave%20Digital%20Solutions%2C%20I%20want%20to%20book%20the%20Ecommerce%20Website%20Package.`;
const WA_AI       = `${WA_BASE}Hi%20NextWave%20Digital%20Solutions%2C%20I%20want%20to%20book%20the%20AI%20Automation%20Package.`;
const WA_LANDING  = `${WA_BASE}Hi%20NextWave%20Digital%20Solutions%2C%20I%20want%20to%20book%20the%20Landing%20Page%20Special%20for%20R750.`;
const WA_PROJECT  = `${WA_BASE}Hi%20NextWave%20Digital%20Solutions%2C%20I%20would%20like%20to%20start%20my%20project.`;

interface SlideData {
  id: number;
  label: string;
  headingLines: string[];
  goldLineIdx: number;
  sub: string;
  cta1: { text: string; href?: string; wa?: string };
  cta2: { text: string; href?: string; wa?: string };
  accentColor: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    label: 'Digital Studio — Johannesburg, South Africa',
    headingLines: ['We Build', 'Digital', 'Futures.'],
    goldLineIdx: 1,
    sub: 'NextWave creates premium websites, apps, AI automations, and business software for modern South African businesses.',
    cta1: { text: 'View Our Work',   href: '/portfolio' },
    cta2: { text: 'Start a Project', href: '/contact' },
    accentColor: 'rgba(183,255,0,0.08)',
  },
  {
    id: 2,
    label: 'Premium Web Design',
    headingLines: ['Professional Websites', 'That Help Your Business', 'Grow.'],
    goldLineIdx: 2,
    sub: 'We design modern, mobile-friendly websites that build trust, attract customers, and position your business professionally online.',
    cta1: { text: 'View Website Packages', href: '/services' },
    cta2: { text: 'Book a Website',         wa: WA_WEBSITE },
    accentColor: 'rgba(183,255,0,0.06)',
  },
  {
    id: 3,
    label: 'Sell Online',
    headingLines: ['Start Selling Online', 'With a Powerful', 'Ecommerce Website.'],
    goldLineIdx: 0,
    sub: 'Launch a complete online store with unlimited products, secure payments, product management, mobile-friendly design, and training included.',
    cta1: { text: 'View Ecommerce Package', href: '/services' },
    cta2: { text: 'Start Selling Online',   wa: WA_ECOM },
    accentColor: 'rgba(58,144,144,0.08)',
  },
  {
    id: 4,
    label: 'Work Smarter',
    headingLines: ['Let AI Handle the Admin', 'While You Focus', 'On Growth.'],
    goldLineIdx: 2,
    sub: 'Automate customer support, emails, follow-ups, bookings, lead capture, reminders, workflows, and daily business tasks.',
    cta1: { text: 'View AI Automation',      href: '/services' },
    cta2: { text: 'Automate My Business',    wa: WA_AI },
    accentColor: 'rgba(183,255,0,0.10)',
  },
  {
    id: 5,
    label: 'Special Offer',
    headingLines: ['High-Converting', 'Landing Pages Built', 'For Results.'],
    goldLineIdx: 1,
    sub: 'Get a modern landing page with chatbot, service sections, gallery, appointment booking, contact forms, and mobile-friendly design.',
    cta1: { text: 'View Landing Page Offer', href: '/services' },
    cta2: { text: 'Book Landing Page',       wa: WA_LANDING },
    accentColor: 'rgba(200,164,90,0.06)',
  },
  {
    id: 6,
    label: 'Selected Work',
    headingLines: ['Real Projects.', 'Real Businesses.', 'Real Digital Results.'],
    goldLineIdx: 2,
    sub: 'Explore completed websites, platforms, ecommerce systems, and digital solutions built by NextWave Digital Solutions.',
    cta1: { text: 'View Projects',      href: '/portfolio' },
    cta2: { text: 'Start Your Project', wa: WA_PROJECT },
    accentColor: 'rgba(183,255,0,0.05)',
  },
];

// ─── Per-slide background decorations ────────────────────────────────────────
function SlideBg({ id }: { id: number }) {
  if (id === 1) return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none" aria-hidden>
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B7FF00" stopOpacity="0"/>
          <stop offset="50%" stopColor="#B7FF00" stopOpacity="1"/>
          <stop offset="100%" stopColor="#B7FF00" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0,1,2,3].map(i => (
        <path key={i}
          d={`M0,${180+i*60} C200,${140+i*60} 400,${220+i*60} 600,${180+i*60} S1000,${140+i*60} 1400,${180+i*60}`}
          stroke="url(#wg)" strokeWidth="1.5" fill="none"
          style={{ animation: `wavePath${i} ${8+i*2}s ease-in-out infinite`, animationDelay: `${i*1.5}s` }}
        />
      ))}
      <style>{`
        @keyframes wavePath0{0%,100%{d:path("M0,180 C200,140 400,220 600,180 S1000,140 1400,180")} 50%{d:path("M0,200 C200,160 400,240 600,200 S1000,160 1400,200")}}
        @keyframes wavePath1{0%,100%{d:path("M0,240 C200,200 400,280 600,240 S1000,200 1400,240")} 50%{d:path("M0,220 C200,180 400,260 600,220 S1000,180 1400,220")}}
        @keyframes wavePath2{0%,100%{d:path("M0,300 C200,260 400,340 600,300 S1000,260 1400,300")} 50%{d:path("M0,320 C200,280 400,360 600,320 S1000,280 1400,320")}}
        @keyframes wavePath3{0%,100%{d:path("M0,360 C200,320 400,400 600,360 S1000,320 1400,360")} 50%{d:path("M0,340 C200,300 400,380 600,340 S1000,300 1400,340")}}
      `}</style>
    </svg>
  );

  if (id === 2) return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Floating browser mockup */}
      <motion.div
        className="absolute right-[5%] top-[15%] w-[320px] lg:w-[420px] opacity-10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 400 260" fill="none">
          <rect x="1" y="1" width="398" height="258" rx="8" stroke="#B7FF00" strokeWidth="1"/>
          <rect x="1" y="1" width="398" height="32" rx="8" fill="#B7FF00" fillOpacity="0.08" stroke="#B7FF00" strokeWidth="1"/>
          <circle cx="18" cy="17" r="5" fill="#B7FF00" fillOpacity="0.4"/>
          <circle cx="34" cy="17" r="5" fill="#B7FF00" fillOpacity="0.3"/>
          <circle cx="50" cy="17" r="5" fill="#B7FF00" fillOpacity="0.2"/>
          <rect x="12" y="45" width="376" height="8" rx="2" fill="#B7FF00" fillOpacity="0.12"/>
          <rect x="12" y="60" width="280" height="6" rx="2" fill="#B7FF00" fillOpacity="0.07"/>
          <rect x="12" y="80" width="376" height="80" rx="4" fill="#B7FF00" fillOpacity="0.06" stroke="#B7FF00" strokeWidth="0.5" strokeOpacity="0.3"/>
          <rect x="12" y="172" width="120" height="8" rx="2" fill="#B7FF00" fillOpacity="0.1"/>
          <rect x="12" y="186" width="180" height="6" rx="2" fill="#B7FF00" fillOpacity="0.07"/>
          <rect x="12" y="198" width="140" height="6" rx="2" fill="#B7FF00" fillOpacity="0.07"/>
          <rect x="304" y="172" width="84" height="28" rx="4" fill="#B7FF00" fillOpacity="0.15" stroke="#B7FF00" strokeWidth="0.5" strokeOpacity="0.5"/>
        </svg>
      </motion.div>
      {/* Grid dots */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, #B7FF00 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );

  if (id === 3) return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-[0.06]">
        <div className="grid grid-cols-3 gap-3 p-8 h-full content-center">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div key={i}
              className="rounded border border-gold/50 bg-gold/5 aspect-square"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
      {/* Cart icon floating */}
      <motion.div
        className="absolute right-[8%] top-[20%] opacity-[0.12] text-gold"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      </motion.div>
    </div>
  );

  if (id === 4) return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.09] pointer-events-none" aria-hidden>
      <defs>
        <radialGradient id="ng">
          <stop offset="0%" stopColor="#B7FF00" stopOpacity="1"/>
          <stop offset="100%" stopColor="#B7FF00" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* Node connections */}
      {[[200,150,500,250],[500,250,750,150],[750,150,900,300],[200,150,350,350],[350,350,500,250],[900,300,800,400]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#B7FF00" strokeWidth="0.8" strokeOpacity="0.4"
          strokeDasharray="6 4" style={{ animation: `nodeLine 3s ease-in-out ${i*0.4}s infinite alternate` }}/>
      ))}
      {[[200,150],[500,250],[750,150],[350,350],[900,300],[800,400]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="url(#ng)"
          style={{ animation: `nodePulse 2s ease-in-out ${i*0.5}s infinite` }}/>
      ))}
      <style>{`
        @keyframes nodeLine { from{strokeOpacity:0.2} to{strokeOpacity:0.7} }
        @keyframes nodePulse { 0%,100%{r:4;opacity:0.6} 50%{r:8;opacity:1} }
      `}</style>
    </svg>
  );

  if (id === 5) return (
    <svg className="absolute right-0 top-0 h-full w-1/2 opacity-[0.06] pointer-events-none" aria-hidden viewBox="0 0 500 600" preserveAspectRatio="xMidYMid meet">
      <rect x="40" y="40" width="420" height="520" rx="4" stroke="#B7FF00" strokeWidth="1" fill="none"
        strokeDasharray="1000" strokeDashoffset="1000"
        style={{ animation: 'wireframeDraw 4s ease-out forwards' }}/>
      <rect x="60" y="60" width="380" height="60" rx="2" stroke="#B7FF00" strokeWidth="0.8" fill="none" fillOpacity="0.05"
        strokeDasharray="900" strokeDashoffset="900"
        style={{ animation: 'wireframeDraw 4s ease-out 0.3s forwards' }}/>
      <rect x="60" y="140" width="180" height="120" rx="2" stroke="#B7FF00" strokeWidth="0.8" fill="none"
        strokeDasharray="600" strokeDashoffset="600"
        style={{ animation: 'wireframeDraw 4s ease-out 0.6s forwards' }}/>
      <rect x="260" y="140" width="180" height="120" rx="2" stroke="#B7FF00" strokeWidth="0.8" fill="none"
        strokeDasharray="600" strokeDashoffset="600"
        style={{ animation: 'wireframeDraw 4s ease-out 0.9s forwards' }}/>
      <rect x="60" y="280" width="380" height="260" rx="2" stroke="#B7FF00" strokeWidth="0.8" fill="none"
        strokeDasharray="1200" strokeDashoffset="1200"
        style={{ animation: 'wireframeDraw 4s ease-out 1.2s forwards' }}/>
      <style>{`@keyframes wireframeDraw { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );

  if (id === 6) return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {[
        { img: '/christianleadershipmovement.png', x: '55%', y: '10%', w: '260px', delay: 0 },
        { img: '/safe cloud africa.png',           x: '68%', y: '35%', w: '200px', delay: 1.5 },
        { img: '/ashley portfolio.png',            x: '50%', y: '60%', w: '180px', delay: 3 },
      ].map((t, i) => (
        <motion.div key={i}
          className="absolute rounded overflow-hidden shadow-2xl"
          style={{ left: t.x, top: t.y, width: t.w, opacity: 0.12, transform: 'perspective(800px) rotateY(-8deg)' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5 + i, delay: t.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img src={t.img} alt="" className="w-full object-cover" loading="lazy" style={{ maxHeight: '160px' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
        </motion.div>
      ))}
    </div>
  );

  return null;
}

// ─── Main HeroSection ─────────────────────────────────────────────────────────
const TOTAL  = SLIDES.length;
const INTERVAL_MS = 4000;

const stats = [
  { to: 15,  suffix: '+',  label: 'Projects Delivered' },
  { to: 5,   suffix: 'yr', label: 'Years of Excellence' },
  { to: 100, suffix: '%',  label: 'Client Satisfaction' },
];

export function HeroSection() {
  const [idx,     setIdx]     = useState(0);
  const [paused,  setPaused]  = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const dragStart = useRef<{ x: number } | null>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setIdx(i => (i + 1) % TOTAL), []);
  const prev = useCallback(() => setIdx(i => (i - 1 + TOTAL) % TOTAL), []);

  // Auto-advance
  useEffect(() => {
    if (paused) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(next, INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, next]);

  // Mouse tracking for radial glow
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
  };

  // Swipe
  const onPointerDown = (e: React.PointerEvent) => { dragStart.current = { x: e.clientX }; };
  const onPointerUp   = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    dragStart.current = null;
  };

  const slide = SLIDES[idx];

  const textV = {
    enter:  { opacity: 0, y: 36, filter: 'blur(6px)' },
    center: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.16,1,0.3,1] as const } },
    exit:   { opacity: 0, y: -20, filter: 'blur(4px)', transition: { duration: 0.4, ease: [0.4,0,1,1] as const } },
  };

  return (
    <section
      className="relative min-h-screen flex flex-col justify-end pt-28 pb-20 overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Dark base */}
      <div className="absolute inset-0 bg-obsidian dark:bg-obsidian" />

      {/* Mouse-tracking radial glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-none"
        style={{ background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(183,255,0,0.06) 0%, transparent 45%)` }}
      />

      {/* Per-slide background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${idx}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SlideBg id={slide.id} />
        </motion.div>
      </AnimatePresence>

      {/* Ambient blobs */}
      <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none animate-slow-drift"
        style={{ background: `radial-gradient(circle, ${slide.accentColor} 0%, transparent 65%)`, filter: 'blur(100px)' }} />
      <div className="absolute bottom-[-10%] left-[-8%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(58,144,144,0.035) 0%, transparent 60%)', filter: 'blur(90px)' }} />

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(183,255,0,0.3) 2px, rgba(183,255,0,0.3) 3px)', backgroundSize: '100% 4px' }} />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-obsidian/55 pointer-events-none" />

      {/* Prev / Next arrows — desktop only */}
      <button
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 hidden md:flex z-20 w-10 h-10 border border-cream/10 hover:border-gold/50 text-cream/40 hover:text-gold items-center justify-center transition-all duration-400 backdrop-blur-sm"
        onClick={prev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 hidden md:flex z-20 w-10 h-10 border border-cream/10 hover:border-gold/50 text-cream/40 hover:text-gold items-center justify-center transition-all duration-400 backdrop-blur-sm"
        onClick={next}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10 w-full">

        {/* Label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`label-${idx}`}
            variants={textV}
            initial="enter"
            animate="center"
            exit="exit"
            className="section-label mb-10 text-cream/60 dark:text-cream/60"
            style={{ color: 'rgba(245,245,243,0.55)' }}
          >
            {slide.label}
          </motion.div>
        </AnimatePresence>

        {/* Heading lines */}
        <div className="mb-10">
          <AnimatePresence mode="wait">
            <motion.div key={`heading-${idx}`} className="space-y-1">
              {slide.headingLines.map((line, li) => (
                <motion.div
                  key={li}
                  variants={textV}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.85, delay: li * 0.12, ease: [0.16,1,0.3,1] }}
                  className="overflow-hidden"
                >
                  <h1
                    className={`font-display font-bold leading-[0.92] tracking-tight ${
                      li === slide.goldLineIdx ? 'text-gold italic' : 'text-cream'
                    }`}
                    style={{ fontSize: 'clamp(3rem, 7.5vw, 9rem)' }}
                  >
                    {line}
                  </h1>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Ruled line */}
        <motion.div
          className="h-px bg-gold/35 mb-8 origin-left"
          style={{ width: '3.5rem' }}
          key={`line-${idx}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16,1,0.3,1] }}
        />

        {/* Sub + stats row */}
        <div className="flex flex-col lg:flex-row gap-10 lg:items-start lg:justify-between mb-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${idx}`}
              variants={textV}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.8, delay: 0.35 }}
              className="font-sans text-base lg:text-lg text-cream/55 max-w-md leading-relaxed font-light"
            >
              {slide.sub}
            </motion.p>
          </AnimatePresence>

          {/* Stats — only on first slide */}
          {idx === 0 && (
            <div className="flex gap-10 lg:gap-16 shrink-0">
              {stats.map(s => (
                <div key={s.label} className="text-left">
                  <div className="font-display font-semibold text-gold leading-none mb-1"
                    style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <div className="section-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`ctas-${idx}`}
            variants={textV}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.75, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6"
          >
            {/* CTA 1 */}
            {slide.cta1.href ? (
              <Link to={slide.cta1.href}
                className="group inline-flex items-center gap-3 bg-gold text-obsidian font-sans text-[11px] font-bold tracking-[0.25em] uppercase px-7 py-4 min-h-[52px] hover:bg-gold/85 transition-all duration-300 active:scale-[0.97]">
                {slide.cta1.text}
                <span className="block h-px w-4 bg-current transition-all duration-400 group-hover:w-7" />
              </Link>
            ) : (
              <button onClick={() => window.open(slide.cta1.wa!, '_blank', 'noopener,noreferrer')}
                className="group inline-flex items-center gap-3 bg-gold text-obsidian font-sans text-[11px] font-bold tracking-[0.25em] uppercase px-7 py-4 min-h-[52px] hover:bg-gold/85 transition-all duration-300 active:scale-[0.97]">
                <MessageCircle className="w-4 h-4 shrink-0" />
                {slide.cta1.text}
              </button>
            )}

            {/* CTA 2 */}
            {slide.cta2.href ? (
              <Link to={slide.cta2.href}
                className="group inline-flex items-center gap-3 font-sans text-[11px] font-semibold tracking-[0.25em] uppercase px-7 py-4 min-h-[52px] border border-cream/20 text-cream/65 hover:border-gold/60 hover:text-cream transition-all duration-400">
                {slide.cta2.text}
              </Link>
            ) : (
              <button onClick={() => window.open(slide.cta2.wa!, '_blank', 'noopener,noreferrer')}
                className="group inline-flex items-center gap-3 font-sans text-[11px] font-semibold tracking-[0.25em] uppercase px-7 py-4 min-h-[52px] border border-cream/20 text-cream/65 hover:border-gold/60 hover:text-cream transition-all duration-400">
                <MessageCircle className="w-3.5 h-3.5 shrink-0 opacity-60" />
                {slide.cta2.text}
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation row: counter + progress + dots */}
        <div className="flex items-center gap-6 mt-12">
          {/* Slide counter */}
          <span className="font-display font-semibold text-gold text-sm tabular-nums">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <span className="font-sans text-cream/30 text-sm">/ {String(TOTAL).padStart(2, '0')}</span>

          {/* Progress bar */}
          <div className="flex-1 max-w-[180px] h-[2px] bg-cream/10 relative overflow-hidden">
            <div
              key={`progress-${idx}`}
              className="absolute inset-y-0 left-0 w-full bg-gold origin-left"
              style={{
                animation: paused ? 'none' : 'progressFill 4s linear forwards',
                transform: paused ? undefined : undefined,
              }}
            />
          </div>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`transition-all duration-400 rounded-full ${
                  i === idx
                    ? 'w-5 h-1.5 bg-gold'
                    : 'w-1.5 h-1.5 border border-gold/30 hover:border-gold/70'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 right-10 hidden md:flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="w-6 h-10 rounded-full border border-cream/20 flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-gold"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="section-label text-cream/30" style={{ fontSize: '8px' }}>SCROLL</span>
      </motion.div>
    </section>
  );
}
