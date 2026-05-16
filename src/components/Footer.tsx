import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BrandLogo } from './BrandLogo';

const navLinks = [
  { name: 'Work',           path: '/portfolio' },
  { name: 'Services',       path: '/services' },
  { name: 'About',          path: '/about' },
  { name: 'Contact',        path: '/contact' },
  { name: 'Privacy Policy', path: '/privacy' },
];

const serviceLinks = [
  'Starter Website',
  'Professional Website',
  'Premium Website',
  'Landing Page',
  'Ecommerce Store',
  'AI Automation Suite',
];

const socialLinks = [
  { icon: Twitter,   href: 'https://twitter.com/nextwavedigital',                    label: 'Twitter' },
  { icon: Linkedin,  href: 'https://linkedin.com/company/nextwavedigitalsolutions',  label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/nextwavedigital',                  label: 'Instagram' },
  { icon: Facebook,  href: 'https://facebook.com/nextwavedigital',                   label: 'Facebook' },
];

export function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-[#F0F0EE] dark:bg-charcoal relative overflow-hidden">
      {/* Gold ruled line at top */}
      <div className="h-px bg-gold/25 w-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Col 1 — Brand + newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-1"
          >
            <BrandLogo className="mb-6" />
            <p className="font-sans text-[13px] text-obsidian/45 dark:text-cream/45 leading-relaxed mb-8 max-w-xs">
              Crafting digital experiences for ambitious South African businesses ready to lead.
            </p>

            {/* Newsletter */}
            <div>
              <div className="section-label mb-3">Newsletter</div>
              <div className="flex border-b border-obsidian/20 dark:border-cream/20 focus-within:border-gold transition-colors duration-400">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 bg-transparent font-sans text-[13px] text-obsidian dark:text-cream placeholder:text-obsidian/30 dark:placeholder:text-cream/25 py-2 outline-none"
                />
                <button
                  type="button"
                  className="text-gold/60 hover:text-gold transition-colors duration-400 pl-3"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Col 2 — Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-label mb-6">Navigation</div>
            <ul className="space-y-3">
              {navLinks.map((link, j) => (
                <motion.li
                  key={link.path}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.12 + j * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.path}
                    className="group relative font-sans text-[13px] text-obsidian/45 dark:text-cream/45 hover:text-gold transition-colors duration-400"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Col 3 — Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-label mb-6">Services</div>
            <ul className="space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="font-sans text-[13px] text-obsidian/45 dark:text-cream/45 hover:text-obsidian dark:hover:text-cream transition-colors duration-400"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Col 4 — Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-label mb-6">Get in Touch</div>
            <div className="space-y-3">
              <a
                href="tel:+27731531188"
                className="block font-serif font-semibold text-obsidian/80 dark:text-cream/80 hover:text-gold transition-colors duration-400"
                style={{ fontSize: '1.4rem' }}
              >
                073 153 1188
              </a>
              <a
                href="mailto:info@nextwavedigitalsolutions.co.za"
                className="block font-sans text-[13px] text-obsidian/45 dark:text-cream/45 hover:text-obsidian dark:hover:text-cream transition-colors duration-400 break-all"
              >
                info@nextwavedigitalsolutions.co.za
              </a>
              <a
                href="https://www.nextwavedigitalsolutions.co.za"
                target="_blank"
                rel="noreferrer"
                className="block font-sans text-[12px] text-obsidian/45 dark:text-cream/45 hover:text-gold transition-colors duration-400"
              >
                www.nextwavedigitalsolutions.co.za
              </a>
              <p className="font-sans text-[12px] text-obsidian/30 dark:text-cream/30 mt-1">
                270 Marshall Street
                <br />Johannesburg, South Africa
              </p>
            </div>

            {/* Social icons */}
            <div className="flex gap-4 mt-8">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-obsidian/25 dark:text-cream/25 hover:text-gold transition-colors duration-400"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-obsidian/6 dark:border-cream/6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[11px] text-obsidian/25 dark:text-cream/25 tracking-wide">
            &copy; {new Date().getFullYear()} NextWave Digital Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="font-sans text-[11px] text-obsidian/25 dark:text-cream/25 hover:text-obsidian/60 dark:hover:text-cream/60 transition-colors duration-400"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="font-sans text-[11px] text-obsidian/25 dark:text-cream/25 hover:text-obsidian/60 dark:hover:text-cream/60 transition-colors duration-400"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
