import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const posters = [
  {
    src: '/full website design.jpeg',
    label: 'Website Packages',
    sub: 'From R2,000',
    link: '/services',
  },
  {
    src: '/landing page website.jpeg',
    label: 'Landing Page',
    sub: 'R750 Special',
    link: '/services',
  },
  {
    src: '/full e-commerce website design.jpeg',
    label: 'Ecommerce Store',
    sub: 'From R4,000',
    link: '/services',
  },
  {
    src: '/custom mobile app.jpeg',
    label: 'Custom Mobile App',
    sub: 'Custom Quote',
    link: '/quote',
  },
];

function PosterTile({
  poster,
  className,
}: {
  poster: typeof posters[0];
  className: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={poster.link}>
      <motion.div
        className={`relative overflow-hidden bg-charcoal-light cursor-pointer ${className}`}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src={poster.src}
          alt={poster.label}
          className="absolute inset-0 w-full h-full object-cover object-top"
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.1) 55%, transparent 100%)',
          }}
          animate={{ opacity: hovered ? 0.6 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Info */}
        <motion.div
          className="absolute bottom-0 left-0 p-6"
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-sans text-base font-medium text-cream leading-tight">
            {poster.label}
          </p>
          <span className="font-sans text-[11px] tracking-[0.18em] uppercase text-gold mt-1 block">
            {poster.sub}
          </span>
          <motion.p
            className="font-sans text-[10px] tracking-[0.22em] uppercase text-cream/50 mt-2"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.25 }}
          >
            View Package →
          </motion.p>
        </motion.div>
      </motion.div>
    </Link>
  );
}

export function PricingPostersSection() {
  return (
    <section
      className="relative"
      style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(183,255,0,0.02) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10"
        >
          <div>
            <div className="section-label mb-3">Packages at a Glance</div>
            <h2
              className="font-serif font-light text-cream leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
            >
              Our Pricing
            </h2>
          </div>
          <Link
            to="/services"
            className="group flex items-center gap-3 font-sans text-[10px] tracking-[0.28em] uppercase text-gold/70 hover:text-gold transition-colors duration-500 shrink-0"
          >
            Full Details
            <span className="block h-px w-6 bg-current transition-all duration-500 group-hover:w-10" />
          </Link>
        </motion.div>

        {/* Asymmetric poster grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Large left — website packages */}
          <div className="lg:col-span-6">
            <PosterTile poster={posters[0]} className="h-[60vw] lg:h-full min-h-[320px] lg:min-h-[580px]" />
          </div>

          {/* Right column — 3 stacked */}
          <div className="lg:col-span-6 grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <PosterTile poster={posters[1]} className="h-[40vw] lg:h-[280px]" />
              <PosterTile poster={posters[2]} className="h-[40vw] lg:h-[280px]" />
            </div>
            <PosterTile poster={posters[3]} className="h-[40vw] lg:h-[280px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
