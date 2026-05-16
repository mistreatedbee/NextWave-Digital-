import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const packages = [
  {
    n: '01',
    name: 'Starter Website',
    price: 'R2,000',
    highlight: false,
    features: [
      'Free .co.za domain',
      '1 month free hosting',
      'Basic SEO setup',
      'Mobile responsive',
      'Up to 5 pages',
      'Contact form',
      'Social media integration',
    ],
  },
  {
    n: '02',
    name: 'Professional Website',
    price: 'R3,500',
    highlight: false,
    features: [
      'Free .co.za domain',
      '3 months free hosting',
      'Enhanced SEO',
      'Custom logo design',
      'Google Business optimisation',
      'Mobile responsive',
      'Up to 10 pages',
    ],
  },
  {
    n: '03',
    name: 'Premium Website',
    price: 'R5,500',
    highlight: true,
    features: [
      'Free .co.za domain',
      '12 months free hosting',
      'Ecommerce integration',
      'Monthly maintenance',
      'Premium bespoke design',
      'Unlimited pages',
      'Advanced SEO',
      'Priority support',
    ],
  },
  {
    n: '04',
    name: 'Landing Page',
    price: 'R750',
    highlight: false,
    note: 'Special — Normally R1,500',
    features: [
      'Modern luxury landing page',
      'Mobile friendly',
      'Gallery section',
      'AI chatbot integration',
      'Appointment booking',
      'Contact form',
      'SEO optimised',
    ],
  },
  {
    n: '05',
    name: 'Ecommerce Store',
    price: 'R4,000',
    highlight: false,
    features: [
      'Unlimited products',
      'Payment gateway setup',
      'Training included',
      'Hosting & domain',
      'Mobile friendly',
      'Secure checkout',
      'Admin dashboard',
    ],
  },
  {
    n: '06',
    name: 'AI Automation Suite',
    price: 'R7,499',
    highlight: false,
    features: [
      'AI chatbots',
      'CRM automation',
      'Email & social automation',
      'Lead capture systems',
      'Sales funnel automation',
      'Appointment automation',
      'Workflow & reporting automation',
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="bg-obsidian text-cream min-h-screen">
      <SEO
        title="Pricing — NextWave Digital Solutions"
        description="Clear, honest pricing for every NextWave Digital Solutions service package."
      />

      {/* Hero */}
      <section className="pt-40 pb-16 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-4">Clear &amp; Honest</div>
          <h1
            className="font-serif font-light text-cream leading-tight mb-6"
            style={{ fontSize: 'clamp(3rem, 7vw, 8rem)' }}
          >
            Pricing
          </h1>
          <p className="font-sans text-[14px] text-cream/45 max-w-lg leading-relaxed">
            No hidden fees. No surprises. Six packages engineered to deliver real value for every budget.
          </p>
        </motion.div>
      </section>

      {/* Pricing grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={`relative p-8 border transition-colors duration-400 ${
                pkg.highlight
                  ? 'border-gold/40 bg-charcoal'
                  : 'border-cream/8 bg-charcoal hover:border-cream/16'
              }`}
            >
              {pkg.highlight && (
                <div className="absolute top-0 left-0 right-0 h-px bg-gold/60" />
              )}

              {/* Number */}
              <span className="section-label text-cream/20 block mb-6">{pkg.n}</span>

              {/* Name */}
              <h2
                className="font-serif font-light text-cream leading-tight mb-1"
                style={{ fontSize: 'clamp(1.4rem, 2vw, 2rem)' }}
              >
                {pkg.name}
              </h2>

              {/* Note */}
              {pkg.note && (
                <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-gold/60 mb-3">
                  {pkg.note}
                </p>
              )}

              {/* Price */}
              <div
                className={`font-serif font-light mt-4 mb-8 leading-none ${
                  pkg.highlight ? 'text-gold' : 'text-cream'
                }`}
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
              >
                {pkg.price}
              </div>

              {/* Ruled line */}
              <div className="h-px bg-cream/8 mb-6" />

              {/* Features */}
              <ul className="space-y-2.5 mb-8">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-gold mt-2 shrink-0" />
                    <span className="font-sans text-[12px] text-cream/45 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/quote"
                className="group inline-flex items-center gap-3 font-sans text-[10px] tracking-[0.25em] uppercase text-gold/70 hover:text-gold transition-colors duration-400"
              >
                Get a Quote
                <span className="block h-px w-4 bg-current transition-all duration-400 group-hover:w-8" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="font-sans text-[13px] text-cream/35 mb-4">
            Need a custom solution or have questions about pricing?
          </p>
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
