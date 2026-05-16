import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

const WA_NUMBER = '27731531188';

function bookService(name: string, price: string) {
  const msg = `Hi NextWave Digital Solutions! I'm interested in the ${name} package (${price}).\n\nPlease contact me to discuss getting started.`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
}

const POSTERS = [
  { src: '/full website design.jpeg',            label: 'Website Packages',   sub: 'From R2,000' },
  { src: '/landing page website.jpeg',           label: 'Landing Page',        sub: 'R750 Special' },
  { src: '/full e-commerce website design.jpeg', label: 'Ecommerce Store',     sub: 'From R4,000' },
  { src: '/custom mobile app.jpeg',              label: 'Custom Mobile App',   sub: 'Custom Quote' },
];

const packages = [
  {
    n: '01',
    name: 'Starter Website',
    price: 'R2,000',
    note: null,
    desc: 'A clean, professional 5-page website to establish your online presence. Ideal for small businesses and startups that need a polished digital home base fast.',
    features: [
      'Free .co.za domain',
      '1 month free hosting',
      'Unlimited business email accounts',
      'Basic SEO setup',
      'Mobile responsive design',
      'Social media integration',
      'Up to 5 pages',
      'Contact form',
    ],
  },
  {
    n: '02',
    name: 'Professional Website',
    price: 'R3,500',
    note: null,
    desc: 'A comprehensive website with enhanced visibility and a custom brand identity. Built for growing businesses ready to compete online and attract more clients.',
    features: [
      'Free .co.za domain',
      '3 months free hosting',
      'Unlimited email accounts',
      'Enhanced SEO & Google optimisation',
      'Custom logo design',
      'Google Business Profile setup',
      'Mobile responsive design',
      'Social media integration',
      'Up to 10 pages',
    ],
  },
  {
    n: '03',
    name: 'Premium Website',
    price: 'R5,500',
    note: null,
    desc: 'Our flagship website package — unlimited in scope and ambition. Full ecommerce capability, 12-month hosting, and ongoing maintenance included.',
    features: [
      'Free .co.za domain',
      '12 months free hosting',
      'Ecommerce integration',
      'Monthly maintenance & updates',
      'Premium bespoke design',
      'Unlimited pages',
      'Advanced SEO strategy',
      'Mobile responsive design',
      'Priority support',
    ],
  },
  {
    n: '04',
    name: 'Landing Page',
    price: 'R750',
    note: 'Normally R1,500',
    desc: 'A high-converting single-page experience built to capture leads, book appointments, and communicate your offer instantly. Limited-time special offer.',
    features: [
      'Modern luxury landing page',
      'Mobile friendly',
      'Gallery section',
      'Business services section',
      'Contact form',
      'AI chatbot integration',
      'Appointment booking system',
      'Fast loading & SEO optimised',
    ],
  },
  {
    n: '05',
    name: 'Ecommerce Store',
    price: 'R4,000',
    note: null,
    desc: 'A complete online store solution with everything you need to sell products and manage your business — from payment gateway to inventory management.',
    features: [
      'Unlimited products',
      'Payment gateway setup (Payfast / Peach)',
      'Training & onboarding included',
      'Hosting & domain included',
      'Mobile friendly',
      'Secure checkout',
      'Product management dashboard',
      'Admin dashboard',
      'Order & inventory management',
    ],
  },
  {
    n: '06',
    name: 'AI Automation Suite',
    price: 'R7,499',
    note: null,
    desc: 'Transform your business operations with intelligent automation. From lead capture to customer support — we build the systems that work while you sleep.',
    features: [
      'AI chatbots (website & WhatsApp)',
      'Automated follow-ups',
      'Email marketing automation',
      'Lead capture systems',
      'Appointment scheduling automation',
      'CRM automation & integration',
      'Customer support automation',
      'Workflow automation',
      'Reporting & analytics automation',
      'Social media automation',
      'Sales funnel automation',
    ],
  },
  {
    n: '07',
    name: 'Mobile App Development',
    price: 'Custom Quote',
    note: null,
    desc: 'Native and cross-platform mobile applications for iOS and Android. From MVPs to full-featured enterprise apps — built for performance, UX, and offline-first capability.',
    features: [
      'iOS & Android (React Native / Expo)',
      'Custom UI/UX design',
      'API & backend integration',
      'Push notifications',
      'Offline-first capability',
      'App Store & Google Play submission',
      'Ongoing maintenance & updates',
    ],
  },
];

function PackagePanel({ pkg, isOpen, onToggle }: {
  pkg: typeof packages[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <div className="ruled-line" />
      <motion.button
        className="w-full flex items-center gap-6 lg:gap-16 py-8 lg:py-10 text-left cursor-pointer -mx-6 lg:-mx-10 px-6 lg:px-10"
        onClick={onToggle}
        whileHover={{ backgroundColor: 'rgba(183,255,0,0.015)' }}
        transition={{ duration: 0.25 }}
      >
        {/* Number */}
        <span
          className="font-serif font-light text-cream/10 leading-none shrink-0 w-16 select-none hidden sm:block"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
        >
          {pkg.n}
        </span>

        {/* Name + badge */}
        <div className="flex-1 flex flex-wrap items-baseline gap-3 min-w-0">
          <h3
            className="font-display font-semibold leading-tight"
            style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.5rem)' }}
          >
            {pkg.name}
          </h3>
          {pkg.note && (
            <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-cream/40 line-through">
              {pkg.note}
            </span>
          )}
        </div>

        {/* Price */}
        <span className="font-sans text-lg lg:text-xl font-medium text-gold shrink-0 mr-4">
          {pkg.price}
        </span>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-cream/30 shrink-0"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-12 pl-0 sm:pl-22 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="font-sans text-[14px] text-obsidian/55 dark:text-cream/55 leading-relaxed mb-6">
                  {pkg.desc}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => bookService(pkg.name, pkg.price)}
                    className="inline-flex items-center justify-center gap-2 bg-gold text-obsidian font-sans text-[10px] font-bold tracking-[0.22em] uppercase px-6 py-3.5 min-h-[48px] hover:bg-gold/85 active:scale-[0.98] transition-all duration-300"
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    Book This Service
                  </button>
                  <Link
                    to="/quote"
                    className="group inline-flex items-center gap-3 font-sans text-[11px] tracking-[0.28em] uppercase text-gold hover:text-obsidian dark:hover:text-cream transition-colors duration-400 self-center"
                  >
                    Get a Quote
                    <span className="block h-px w-5 bg-current transition-all duration-400 group-hover:w-8" />
                  </Link>
                </div>
              </div>
              <ul className="space-y-2.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-gold mt-2 shrink-0" />
                    <span className="font-sans text-[13px] text-cream/50 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ServicesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="bg-ivory text-obsidian dark:bg-obsidian dark:text-cream min-h-screen">
      <SEO
        title="Services & Pricing — NextWave Digital Solutions"
        description="Transparent pricing for premium websites, ecommerce stores, and AI automation solutions for South African businesses."
      />

      {/* Hero */}
      <section className="pt-40 pb-16 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-4">Transparent Pricing</div>
          <h1
            className="font-display font-semibold leading-tight mb-6"
            style={{ fontSize: 'clamp(3rem, 7vw, 8rem)' }}
          >
            Our Packages
          </h1>
          <p className="font-sans text-base text-cream/50 max-w-lg leading-relaxed">
            Six clearly defined solutions — each built to deliver maximum value for your investment.
          </p>
        </motion.div>
      </section>

      {/* Special offer banner */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-charcoal border-l-4 border-gold p-6 lg:p-8"
        >
          <div className="section-label text-gold mb-2">Limited Offer</div>
          <div className="flex flex-wrap items-baseline gap-4">
            <h2
              className="font-serif font-light text-cream"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.8rem)' }}
            >
              Landing Page — R750
            </h2>
            <span className="font-sans text-[13px] text-cream/30 line-through">Normally R1,500</span>
          </div>
          <p className="font-sans text-[13px] text-cream/50 mt-2 max-w-lg">
            Modern luxury landing page with AI chatbot, appointment booking, and full mobile optimisation.
          </p>
        </motion.div>
      </div>

      {/* Packages accordion */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-32">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.n}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <PackagePanel
              pkg={pkg}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          </motion.div>
        ))}
        <div className="ruled-line" />

        {/* Pricing poster gallery */}
        <div className="mt-24 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="section-label mb-3">Packages at a Glance</div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {POSTERS.map((poster, i) => (
              <motion.div
                key={poster.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden bg-charcoal-light group cursor-pointer"
                style={{ aspectRatio: '3/4' }}
              >
                <motion.img
                  src={poster.src}
                  alt={poster.label}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%)' }}
                />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="font-sans text-sm font-medium text-cream">{poster.label}</p>
                  <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-gold mt-1 block">{poster.sub}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Custom CTA */}
        <div className="mt-20 text-center">
          <p className="font-sans text-[13px] text-cream/40 mb-4">Need something custom or enterprise-scale?</p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 font-sans text-[11px] tracking-[0.28em] uppercase text-gold hover:text-cream transition-colors duration-400"
          >
            Let&apos;s Talk
            <span className="block h-px w-6 bg-current transition-all duration-400 group-hover:w-10" />
          </Link>
        </div>
      </div>
    </div>
  );
}
