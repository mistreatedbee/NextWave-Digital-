import React, { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { shouldUseEnhancedMotion } from '../../utils/motionSafety';

// Subtle tilt on hover — adds premium 3D depth feel
function TiltRow({ children, className }: { children: React.ReactNode; className?: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-60, 60], [1.5, -1.5]);
  const rotateY = useTransform(mx, [-200, 200], [-1.5, 1.5]);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  }, [mx, my]);

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const WA_BASE = 'https://wa.me/27731531188?text=';

const services = [
  {
    n: '01',
    name: 'Starter Website',
    desc: 'A polished 5-page website to establish your online presence.',
    price: 'From R2,000',
    href: '/services/starter-website',
    waMsg: 'Hi%20NextWave%20Digital%20Solutions%2C%20I%20want%20to%20book%20the%20Starter%20Website%20Package.',
  },
  {
    n: '02',
    name: 'Professional Website',
    desc: 'Up to 10 pages with enhanced SEO, logo design, and Google optimisation.',
    price: 'From R3,500',
    href: '/services/professional-website',
    waMsg: 'Hi%20NextWave%20Digital%20Solutions%2C%20I%20want%20to%20book%20the%20Professional%20Website%20Package.',
  },
  {
    n: '03',
    name: 'Premium Website',
    desc: 'Unlimited pages, ecommerce integration, and 12-month hosting included.',
    price: 'From R5,500',
    href: '/services/premium-website',
    waMsg: 'Hi%20NextWave%20Digital%20Solutions%2C%20I%20want%20to%20book%20the%20Premium%20Website%20Package.',
  },
  {
    n: '04',
    name: 'Landing Page',
    desc: 'High-converting single page with chatbot, booking, and contact form.',
    price: 'R750 Special',
    href: '/services/landing-page',
    waMsg: 'Hi%20NextWave%20Digital%20Solutions%2C%20I%20want%20to%20book%20the%20Landing%20Page%20Special%20for%20R750.',
  },
  {
    n: '05',
    name: 'Ecommerce Store',
    desc: 'Unlimited products, payment gateway, and full admin dashboard.',
    price: 'From R4,000',
    href: '/services/ecommerce',
    waMsg: 'Hi%20NextWave%20Digital%20Solutions%2C%20I%20want%20to%20book%20the%20Ecommerce%20Website%20Package.',
  },
  {
    n: '06',
    name: 'AI Automation Suite',
    desc: 'Chatbots, CRM, email automation, sales funnels, and workflow systems.',
    price: 'From R7,499',
    href: '/services/ai-automation',
    waMsg: 'Hi%20NextWave%20Digital%20Solutions%2C%20I%20want%20to%20book%20the%20AI%20Automation%20Package.',
  },
];

export function ServicesOverviewSection() {
  const linesRef = useRef<HTMLDivElement[]>([]);
  const enhancedMotion = shouldUseEnhancedMotion();

  useEffect(() => {
    if (!shouldUseEnhancedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      linesRef.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });
    });
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative"
      style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
    >
      <div
        className="absolute left-0 top-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(183,255,0,0.025) 0%, transparent 65%)',
          filter: enhancedMotion ? 'blur(80px)' : undefined,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16"
        >
          <div>
            <div className="section-label mb-3">What We Do</div>
            <h2
              className="font-display font-semibold leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
            >
              Our Services
            </h2>
          </div>
          <Link
            to="/services"
            className="group flex items-center gap-3 font-sans text-[10px] tracking-[0.28em] uppercase text-gold/70 hover:text-gold transition-colors duration-500 shrink-0"
          >
            View All Packages
            <span className="block h-px w-6 bg-current transition-all duration-500 group-hover:w-10" />
          </Link>
        </motion.div>

        {/* Service rows */}
        <div>
          {services.map((service, i) => (
            <motion.div
              key={service.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* GSAP-animated ruled line */}
              <div
                ref={(el) => { if (el) linesRef.current[i] = el; }}
                className="ruled-line"
                style={{ display: 'block' }}
              />

              <TiltRow>
              <motion.div
                className="group flex items-start gap-6 lg:gap-16 py-8 lg:py-10 cursor-pointer -mx-6 lg:-mx-10 px-6 lg:px-10"
                whileHover={{ backgroundColor: 'rgba(183,255,0,0.02)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Background number */}
                <motion.span
                  className="font-display font-bold leading-none shrink-0 w-16 select-none hidden sm:block text-obsidian/5 dark:text-cream/5"
                  style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}
                  whileHover={{ opacity: 0.12 }}
                  transition={{ duration: 0.3 }}
                >
                  {service.n}
                </motion.span>

                {/* Service name — clickable link to detail page */}
                <Link to={service.href} className="flex-1" onClick={(e) => e.stopPropagation()}>
                  <motion.h3
                    className="font-display font-semibold leading-tight hover:text-gold transition-colors duration-300"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.8rem)' }}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {service.name}
                  </motion.h3>
                </Link>

                {/* Right block: desc + price + book button */}
                <div className="shrink-0 text-right w-44 lg:w-60 hidden md:flex flex-col items-end gap-2">
                  <p className="font-sans text-[13px] text-obsidian/45 dark:text-cream/45 leading-relaxed">
                    {service.desc}
                  </p>
                  <span className="font-sans text-[11px] tracking-[0.18em] uppercase text-gold">
                    {service.price}
                  </span>
                  <motion.a
                    href={`${WA_BASE}${service.waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[9px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 border border-gold/35 text-gold hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Book Now →
                  </motion.a>
                </div>

                {/* Mobile: always show book button */}
                <div className="md:hidden shrink-0 flex flex-col items-end gap-1">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-gold">
                    {service.price}
                  </span>
                  <a
                    href={`${WA_BASE}${service.waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[9px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1.5 min-h-[36px] flex items-center border border-gold/35 text-gold bg-gold/5"
                  >
                    Book →
                  </a>
                </div>
              </motion.div>
              </TiltRow>
            </motion.div>
          ))}

          {/* Final ruled line — also GSAP animated */}
          <div
            ref={(el) => { if (el) linesRef.current[services.length] = el; }}
            className="ruled-line"
          />
        </div>
      </div>
    </section>
  );
}
