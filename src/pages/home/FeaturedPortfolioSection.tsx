import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { portfolioItems } from '../../data/portfolio';

const featured = portfolioItems.slice(0, 3);

function ProjectTile({
  item,
  index,
  className,
}: {
  item: typeof portfolioItems[0];
  index: number;
  className: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden bg-charcoal-light cursor-pointer ${className}`}
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.0, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Thumbnail image */}
      <motion.img
        src={item.thumbnail}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Subtle diagonal pattern (visible when no image) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(183,255,0,0.03) 0px,
            rgba(183,255,0,0.03) 1px,
            transparent 1px,
            transparent 14px
          )`,
        }}
      />

      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)',
        }}
        animate={{ opacity: hovered ? 0.7 : 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Category tag — top right */}
      <div className="absolute top-5 right-5">
        <span className="section-label">{item.category}</span>
      </div>

      {/* Big background number */}
      <span
        className="absolute bottom-0 right-4 font-serif font-light text-cream/5 leading-none select-none pointer-events-none"
        style={{ fontSize: 'clamp(6rem, 14vw, 14rem)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Info — bottom left */}
      <motion.div
        className="absolute bottom-0 left-0 p-6 lg:p-8"
        animate={{ y: hovered ? -6 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-cream/50 mb-2">
          {item.shortDescription.slice(0, 40)}…
        </p>
        <h3 className="font-serif font-light text-cream text-xl lg:text-2xl leading-tight">
          {item.title}
        </h3>
        <motion.p
          className="font-sans text-[11px] tracking-[0.22em] uppercase text-gold mt-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.3 }}
        >
          View Project →
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export function FeaturedPortfolioSection() {
  return (
    <section
      className="relative"
      style={{ paddingTop: 'var(--section-pad)', paddingBottom: 'var(--section-pad)' }}
    >
      <div
        className="absolute right-0 top-1/4 w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(58,144,144,0.03) 0%, transparent 60%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header — word-split animation */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <motion.div
              className="section-label mb-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Selected Work
            </motion.div>
            <div className="flex gap-3 flex-wrap overflow-hidden">
              {['Featured', 'Projects'].map((word, i) => (
                <motion.span
                  key={word}
                  className="font-display font-semibold leading-tight block"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.85, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to="/portfolio"
              className="group flex items-center gap-3 font-sans text-[10px] tracking-[0.28em] uppercase text-gold/70 hover:text-gold transition-colors duration-500 shrink-0"
            >
              View All Work
              <span className="block h-px w-6 bg-current transition-all duration-500 group-hover:w-10" />
            </Link>
          </motion.div>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Large tile — left */}
          <a
            href={featured[0].href && featured[0].href !== '#' ? featured[0].href : undefined}
            target={featured[0].href && featured[0].href !== '#' ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="lg:col-span-7 block"
          >
            <ProjectTile item={featured[0]} index={0} className="h-[55vw] lg:h-full min-h-[300px] lg:min-h-[560px]" />
          </a>

          {/* Two stacked tiles — right */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <a
              href={featured[1].href && featured[1].href !== '#' ? featured[1].href : '/portfolio'}
              target={featured[1].href && featured[1].href !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="block flex-1"
            >
              <ProjectTile item={featured[1]} index={1} className="h-[40vw] lg:h-full min-h-[220px]" />
            </a>
            <a
              href={featured[2].href && featured[2].href !== '#' ? featured[2].href : '/portfolio'}
              target={featured[2].href && featured[2].href !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="block flex-1"
            >
              <ProjectTile item={featured[2]} index={2} className="h-[40vw] lg:h-full min-h-[220px]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
