import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, Check, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { SEO } from './SEO';

const WA_BASE = 'https://wa.me/27731531188?text=';

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface RelatedService {
  name: string;
  price: string;
  href: string;
}

export interface ServiceDetailProps {
  seoTitle:    string;
  seoDesc:     string;
  name:        string;
  price:       string;
  originalPrice?: string;
  badge?:      string;
  tagline:     string;
  description: string;
  who:         string;
  features:    string[];
  benefits:    { title: string; desc: string }[];
  timeline:    string;
  faqs:        ServiceFaq[];
  waMessage:   string;
  relatedServices: RelatedService[];
}

function FaqItem({ q, a }: ServiceFaq) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-obsidian/8 dark:border-cream/8">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-sans text-sm font-semibold text-obsidian dark:text-cream">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gold shrink-0" /> : <ChevronDown className="w-4 h-4 text-gold shrink-0" />}
      </button>
      {open && (
        <p className="font-sans text-sm text-obsidian/60 dark:text-cream/60 leading-relaxed pb-5">
          {a}
        </p>
      )}
    </div>
  );
}

export function ServiceDetailPage(props: ServiceDetailProps) {
  const waUrl = `${WA_BASE}${encodeURIComponent(props.waMessage)}`;

  return (
    <div className="bg-ivory text-obsidian dark:bg-obsidian dark:text-cream min-h-screen">
      <SEO title={props.seoTitle} description={props.seoDesc} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pt-40 pb-20 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {props.badge && (
            <span className="inline-block mb-4 font-sans text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1 bg-gold text-obsidian">
              {props.badge}
            </span>
          )}
          <div className="section-label mb-4">Service Detail</div>
          <h1
            className="font-display font-bold leading-tight mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 7rem)' }}
          >
            {props.name}
          </h1>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-4 mb-6">
            <span
              className="font-display font-bold text-gold leading-none"
              style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
            >
              {props.price}
            </span>
            {props.originalPrice && (
              <span className="font-sans text-lg text-obsidian/35 dark:text-cream/35 line-through">
                {props.originalPrice}
              </span>
            )}
          </div>

          <p className="font-sans text-base text-obsidian/60 dark:text-cream/60 max-w-xl leading-relaxed mb-8">
            {props.tagline}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-gold text-obsidian font-sans text-[11px] font-bold tracking-[0.25em] uppercase px-8 py-5 min-h-[56px] hover:bg-gold/85 transition-all duration-300 active:scale-[0.97]"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              Book This Service on WhatsApp
            </a>
            <Link
              to="/quote"
              className="inline-flex items-center justify-center gap-3 font-sans text-[11px] font-semibold tracking-[0.25em] uppercase px-8 py-5 min-h-[56px] border border-obsidian/20 dark:border-cream/20 hover:border-gold transition-all duration-300"
            >
              Get a Detailed Quote
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Ruled divider */}
      <div className="ruled-line max-w-7xl mx-auto px-6 lg:px-10" />

      {/* ── Description + Who it's for ───────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-label mb-3">About This Service</div>
            <p className="font-sans text-base text-obsidian/65 dark:text-cream/65 leading-relaxed">
              {props.description}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-label mb-3">Who This Is For</div>
            <p className="font-sans text-base text-obsidian/65 dark:text-cream/65 leading-relaxed">
              {props.who}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── What's Included ──────────────────────────────── */}
      <section className="py-20 bg-[#EDEDE9] dark:bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <div className="section-label mb-3">Package Details</div>
            <h2 className="font-display font-semibold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
              What&apos;s Included
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {props.features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3 p-4 bg-ivory dark:bg-charcoal-light border border-obsidian/8 dark:border-cream/8 rounded-sm"
              >
                <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="font-sans text-sm text-obsidian/80 dark:text-cream/80 leading-relaxed">{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="section-label mb-3">Why Choose This</div>
          <h2 className="font-display font-semibold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
            Key Benefits
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {props.benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
              className="p-6 border border-obsidian/8 dark:border-cream/8 rounded-sm bg-ivory dark:bg-charcoal-light"
            >
              <div className="w-8 h-px bg-gold mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">{b.title}</h3>
              <p className="font-sans text-sm text-obsidian/60 dark:text-cream/60 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────── */}
      <section className="py-16 bg-[#EDEDE9] dark:bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="section-label mb-2">Project Timeline</div>
              <h2 className="font-display font-semibold text-2xl">{props.timeline}</h2>
            </div>
            <Link to="/contact" className="group flex items-center gap-2 font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-gold hover:text-obsidian dark:hover:text-cream transition-colors duration-300">
              Ask About Timeline <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why NextWave ─────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="section-label mb-3">Why NextWave</div>
          <h2 className="font-display font-semibold mb-6" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
            Built by a Team That Cares About Results
          </h2>
          <p className="font-sans text-base text-obsidian/65 dark:text-cream/65 leading-relaxed mb-8">
            At NextWave Digital Solutions, we don't build templates — we build bespoke digital assets tailored precisely to your business. Every project comes with dedicated support, clear communication, and a genuine commitment to your success.
          </p>
          <div className="flex flex-wrap gap-6">
            {['No hidden fees', 'Dedicated support', 'Fast turnaround', 'Mobile-first always'].map(item => (
              <div key={item} className="flex items-center gap-2 font-sans text-sm text-obsidian/70 dark:text-cream/70">
                <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-20 bg-[#EDEDE9] dark:bg-charcoal">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="section-label mb-3">Common Questions</div>
          <h2 className="font-display font-semibold mb-10" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
            Frequently Asked
          </h2>
          {props.faqs.map(faq => <FaqItem key={faq.q} {...faq} />)}
        </div>
      </section>

      {/* ── Book CTA ─────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="section-label mb-4 mx-auto">Ready to Get Started?</div>
          <h2 className="font-display font-bold mb-4 leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 4.5rem)' }}>
            Book the {props.name}
          </h2>
          <p className="font-sans text-base text-obsidian/55 dark:text-cream/55 max-w-md mx-auto mb-10">
            Click the button below to open WhatsApp and send us your booking request instantly.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-gold text-obsidian font-sans text-[11px] font-bold tracking-[0.28em] uppercase px-12 py-6 min-h-[64px] hover:bg-gold/85 transition-all duration-300 active:scale-[0.97]"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            Book Now on WhatsApp — {props.price}
          </a>
        </motion.div>
      </section>

      {/* ── Related Services ─────────────────────────────── */}
      {props.relatedServices.length > 0 && (
        <section className="py-20 bg-[#EDEDE9] dark:bg-charcoal">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="section-label mb-8">Explore More</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {props.relatedServices.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <Link
                    to={s.href}
                    className="group block p-6 border border-obsidian/8 dark:border-cream/8 hover:border-gold transition-all duration-400 bg-ivory dark:bg-charcoal-light rounded-sm"
                  >
                    <div className="font-display font-semibold text-lg mb-1 group-hover:text-gold transition-colors duration-300">{s.name}</div>
                    <div className="font-sans text-sm text-gold font-semibold mb-3">{s.price}</div>
                    <div className="flex items-center gap-2 font-sans text-[10px] tracking-[0.2em] uppercase text-obsidian/40 dark:text-cream/40 group-hover:text-gold transition-colors duration-300">
                      View Details <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
