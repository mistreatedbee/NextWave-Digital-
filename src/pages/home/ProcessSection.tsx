import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  MessageCircle, Map, Palette, Code2,
  CheckCircle2, Rocket, Headphones,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Counter for step numbers
function StepCounter({ to }: { to: string }) {
  const [show, setShow] = useState('00');
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (inView) setTimeout(() => setShow(to), 200);
  }, [inView, to]);
  return <span ref={ref} className="tabular-nums">{show}</span>;
}

const STEPS = [
  { n: '01', title: 'Consultation',  desc: 'We listen deeply to understand your goals, challenges, audience, and vision.',  icon: MessageCircle },
  { n: '02', title: 'Strategy',      desc: 'We architect the optimal solution — clear roadmap, technology stack, and timeline.', icon: Map },
  { n: '03', title: 'Design',        desc: 'Precision UI/UX crafted around your brand, audience, and industry context.',       icon: Palette },
  { n: '04', title: 'Development',   desc: 'Clean, scalable, production-grade code built with performance and security first.', icon: Code2 },
  { n: '05', title: 'Testing',       desc: 'Rigorous QA across devices, browsers, and real-world scenarios before launch.',    icon: CheckCircle2 },
  { n: '06', title: 'Launch',        desc: 'Seamless deployment with full team onboarding and smooth go-live support.',        icon: Rocket },
  { n: '07', title: 'Support',       desc: 'Ongoing partnership to scale, maintain, and evolve your digital asset long-term.', icon: Headphones },
];

export function ProcessSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const lineRef     = useRef<SVGLineElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!lineRef.current) return;
      const line = lineRef.current;
      const len  = 2000; // approximate, overridden by SVG viewBox
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          end:   'bottom 55%',
          scrub: 2,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F0F0EE] dark:bg-charcoal overflow-hidden"
      style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
    >
      {/* Subtle lime ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(183,255,0,0.04) 0%, transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <div className="section-label mb-3">How We Work</div>
            <h2 className="font-display font-semibold leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
              The Process
            </h2>
          </div>
          <p className="font-sans text-[13px] text-obsidian/45 dark:text-cream/45 max-w-xs leading-relaxed">
            Seven transparent steps — from first conversation to long-term growth partnership.
          </p>
        </motion.div>

        {/* Desktop: 4+3 grid with SVG connecting line */}
        <div className="hidden lg:block relative">
          {/* SVG connecting path — scrubbed by GSAP */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden>
            <line
              ref={lineRef}
              x1="80" y1="80" x2="1120" y2="80"
              stroke="#B7FF00" strokeWidth="1" strokeOpacity="0.25"
              strokeLinecap="round"
            />
          </svg>

          {/* Row 1 — 4 cards */}
          <div className="grid grid-cols-4 gap-4 mb-4 relative z-10">
            {STEPS.slice(0, 4).map((step, i) => (
              <StepCard key={step.n} step={step} i={i} />
            ))}
          </div>
          {/* Row 2 — 3 cards centred */}
          <div className="grid grid-cols-3 gap-4 max-w-[75%] mx-auto relative z-10">
            {STEPS.slice(4).map((step, i) => (
              <StepCard key={step.n} step={step} i={i + 4} />
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden relative pl-10">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gold/15" />
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative">
                {/* Dot on line */}
                <motion.div
                  className="absolute -left-[1.45rem] top-6 w-3 h-3 rounded-full border-2 border-gold/60 bg-charcoal"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                />
                <StepCard step={step} i={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, i }: { step: typeof STEPS[0]; i: number }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -8,
        boxShadow: '0 24px 60px rgba(183,255,0,0.10), 0 4px 20px rgba(0,0,0,0.2)',
      }}
      className="relative rounded-2xl border border-gold/15 hover:border-gold/45 transition-colors duration-400 p-6 cursor-default"
      style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(14px)' }}
    >
      {/* Top row: number + icon */}
      <div className="flex items-start justify-between mb-3">
        <span className="font-display font-bold text-gold/12 leading-none select-none"
          style={{ fontSize: '3.5rem' }}>
          <StepCounter to={step.n} />
        </span>
        <motion.div
          className="w-10 h-10 rounded-xl border border-gold/30 flex items-center justify-center bg-gold/5 shrink-0"
          initial={{ scale: 0, rotate: -20 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 + 0.25, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Icon className="w-4 h-4 text-gold" />
        </motion.div>
      </div>

      <div className="section-label mb-1.5">Step {step.n}</div>
      <h3 className="font-display font-semibold text-lg mb-2 text-obsidian dark:text-cream">
        {step.title}
      </h3>
      <p className="font-sans text-[12px] text-obsidian/50 dark:text-cream/50 leading-relaxed">
        {step.desc}
      </p>

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-14 h-14 rounded-br-2xl pointer-events-none"
        style={{ background: 'linear-gradient(225deg, rgba(183,255,0,0.07) 0%, transparent 60%)' }} />
    </motion.div>
  );
}
