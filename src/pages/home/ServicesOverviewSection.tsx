import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const services = [
  {
    n: '01',
    name: 'Starter Website',
    desc: 'A polished 5-page website to establish your online presence.',
    price: 'From R2,000',
  },
  {
    n: '02',
    name: 'Professional Website',
    desc: 'Up to 10 pages with enhanced SEO, logo design, and Google optimisation.',
    price: 'From R3,500',
  },
  {
    n: '03',
    name: 'Premium Website',
    desc: 'Unlimited pages, ecommerce integration, and 12-month hosting included.',
    price: 'From R5,500',
  },
  {
    n: '04',
    name: 'Landing Page',
    desc: 'High-converting single page with chatbot, booking, and contact form.',
    price: 'R750 Special',
  },
  {
    n: '05',
    name: 'Ecommerce Store',
    desc: 'Unlimited products, payment gateway, and full admin dashboard.',
    price: 'From R4,000',
  },
  {
    n: '06',
    name: 'AI Automation Suite',
    desc: 'Chatbots, CRM, email automation, sales funnels, and workflow systems.',
    price: 'From R7,499',
  },
];

export function ServicesOverviewSection() {
  return (
    <section
      className="relative"
      style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
    >
      <div
        className="absolute left-0 top-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(183,255,0,0.025) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
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
              className="font-serif font-light text-cream leading-tight"
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

        <div>
          {services.map((service, i) => (
            <motion.div
              key={service.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="ruled-line" />
              <motion.div
                className="flex items-start gap-6 lg:gap-16 py-8 lg:py-10 cursor-default -mx-6 lg:-mx-10 px-6 lg:px-10"
                whileHover={{ backgroundColor: 'rgba(183,255,0,0.02)' }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className="font-serif font-light text-cream/8 leading-none shrink-0 w-16 select-none hidden sm:block"
                  style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}
                >
                  {service.n}
                </span>

                <motion.h3
                  className="font-serif font-light text-cream flex-1 leading-tight"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.8rem)' }}
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {service.name}
                </motion.h3>

                <div className="shrink-0 text-right w-40 lg:w-56 hidden md:block">
                  <p className="font-sans text-[13px] text-cream/45 leading-relaxed mb-2">
                    {service.desc}
                  </p>
                  <span className="font-sans text-[11px] tracking-[0.18em] uppercase text-gold">
                    {service.price}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
          <div className="ruled-line" />
        </div>
      </div>
    </section>
  );
}
