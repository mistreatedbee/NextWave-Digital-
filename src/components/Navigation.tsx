import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandLogo } from './BrandLogo';

const navLinks = [
  { name: 'Work',     path: '/portfolio' },
  { name: 'Services', path: '/services' },
  { name: 'About',    path: '/about' },
  { name: 'Contact',  path: '/contact' },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
};

const linkVariants = {
  hidden: { opacity: 0, y: -8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const drawerLinkVariants = {
  hidden: { opacity: 0, x: 40 },
  show:   (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Navigation() {
  const [scrolled, setScrolled]   = useState(false);
  const [isOpen,   setIsOpen]     = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-obsidian/88 backdrop-blur-xl border-b border-cream/5 py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <BrandLogo />

          {/* Desktop nav */}
          <motion.div
            className="hidden md:flex items-center gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {navLinks.map((link) => (
              <motion.div key={link.path} variants={linkVariants}>
                <Link
                  to={link.path}
                  className={`relative font-sans text-[10px] tracking-[0.25em] uppercase transition-colors duration-400 pb-1 ${
                    isActive(link.path)
                      ? 'text-cream'
                      : 'text-cream/45 hover:text-cream'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-px bg-gold/60"
                    />
                  )}
                </Link>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.div variants={linkVariants}>
              <Link
                to="/quote"
                className="font-sans text-[10px] tracking-[0.22em] uppercase px-5 py-2 border border-gold/40 text-cream/70 hover:text-cream hover:border-gold transition-all duration-500"
              >
                Start a Project
              </Link>
            </motion.div>
          </motion.div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-cream/70 hover:text-cream transition-colors p-2"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-obsidian flex flex-col px-8 py-10"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <div className="flex items-center justify-between mb-16">
              <BrandLogo />
              <button
                className="text-cream/60 hover:text-cream transition-colors p-2"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-3 flex-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  custom={i}
                  variants={drawerLinkVariants}
                  initial="hidden"
                  animate="show"
                >
                  <Link
                    to={link.path}
                    className={`block font-serif font-light leading-tight hover:text-gold transition-colors duration-400 ${
                      isActive(link.path) ? 'text-gold' : 'text-cream'
                    }`}
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)' }}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="pt-10 border-t border-cream/8"
            >
              <Link
                to="/quote"
                className="block font-sans text-[11px] tracking-[0.28em] uppercase text-gold mb-6"
                onClick={() => setIsOpen(false)}
              >
                Start a Project →
              </Link>
              <p className="font-sans text-[11px] text-cream/30 tracking-wide">073 153 1188</p>
              <p className="font-sans text-[11px] text-cream/30 tracking-wide mt-1">info@nextwavedigitalsolutions.co.za</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
