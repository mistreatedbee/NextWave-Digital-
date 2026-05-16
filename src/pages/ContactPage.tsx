import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

const WA_NUMBER = '27731531188';

function buildWhatsAppUrl(form: {
  name: string; email: string; service: string; message: string;
}): string {
  const lines: string[] = ['Hi NextWave Digital Solutions!', ''];
  if (form.name)    lines.push(`Name: ${form.name}`);
  if (form.email)   lines.push(`Email: ${form.email}`);
  if (form.service) lines.push(`Service Interest: ${form.service}`);
  if (form.message) lines.push(`Message: ${form.message}`);
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

const inputClass =
  'w-full bg-transparent font-sans text-[14px] text-obsidian dark:text-cream placeholder:text-obsidian/25 dark:placeholder:text-cream/25 py-3 border-b border-obsidian/20 dark:border-cream/20 focus:border-gold outline-none transition-colors duration-400 resize-none';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' });
  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(buildWhatsAppUrl(form), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-ivory text-obsidian dark:bg-obsidian dark:text-cream min-h-screen">
      <SEO
        title="Contact — NextWave Digital Solutions"
        description="Get in touch with NextWave Digital Solutions. Start a project, ask a question, or just say hello."
      />

      <div
        className="max-w-5xl mx-auto px-6 lg:px-10"
        style={{ paddingTop: 'clamp(8rem, 15vw, 12rem)', paddingBottom: 'var(--section-pad)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-4">Let&apos;s Talk</div>
          <h1
            className="font-display font-bold leading-tight"
            style={{ fontSize: 'clamp(3rem, 7vw, 8rem)' }}
          >
            Start a Conversation
          </h1>
        </motion.div>

        {/* Ruled line */}
        <motion.div
          className="h-px bg-gold/20 mt-10 mb-16 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Contact links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-0 mb-16"
        >
          <a
            href="tel:+27731531188"
            className="flex items-center py-6 border-b border-obsidian/8 dark:border-cream/8 group"
          >
            <span className="section-label w-28 shrink-0">Phone</span>
            <span
              className="font-display font-semibold group-hover:text-gold transition-colors duration-400"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.8rem)' }}
            >
              073 153 1188
            </span>
          </a>

          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center py-6 border-b border-obsidian/8 dark:border-cream/8 group"
          >
            <span className="section-label w-28 shrink-0">WhatsApp</span>
            <span
              className="font-display font-semibold text-obsidian/70 dark:text-cream/70 group-hover:text-gold transition-colors duration-400"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}
            >
              WhatsApp Us →
            </span>
          </a>

          <a
            href="mailto:info@nextwavedigitalsolutions.co.za"
            className="flex items-center py-6 border-b border-obsidian/8 dark:border-cream/8 group"
          >
            <span className="section-label w-28 shrink-0">Email</span>
            <span className="font-sans text-base lg:text-lg text-obsidian/60 dark:text-cream/60 group-hover:text-obsidian dark:group-hover:text-cream transition-colors duration-400 break-all">
              info@nextwavedigitalsolutions.co.za
            </span>
          </a>

          <div className="flex items-center py-6 border-b border-obsidian/8 dark:border-cream/8">
            <span className="section-label w-28 shrink-0">Location</span>
            <span className="font-sans text-sm text-obsidian/35 dark:text-cream/35">
              270 Marshall Street, Johannesburg, South Africa
            </span>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-10">Send a Message</div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="section-label mb-3">Your Name *</div>
                <input type="text" value={form.name} onChange={set('name')} placeholder="Jane Smith" required className={inputClass} />
              </div>
              <div>
                <div className="section-label mb-3">Email Address *</div>
                <input type="email" value={form.email} onChange={set('email')} placeholder="jane@company.co.za" required className={inputClass} />
              </div>
            </div>

            <div>
              <div className="section-label mb-3">Service Interest</div>
              <select value={form.service} onChange={set('service')} className={inputClass + ' appearance-none'}>
                <option value="" className="bg-charcoal text-cream/50">Select a service…</option>
                <option value="Starter Website" className="bg-charcoal text-cream">Starter Website</option>
                <option value="Professional Website" className="bg-charcoal text-cream">Professional Website</option>
                <option value="Premium Website" className="bg-charcoal text-cream">Premium Website</option>
                <option value="Landing Page" className="bg-charcoal text-cream">Landing Page</option>
                <option value="Ecommerce Store" className="bg-charcoal text-cream">Ecommerce Store</option>
                <option value="AI Automation Suite" className="bg-charcoal text-cream">AI Automation Suite</option>
                <option value="Mobile App" className="bg-charcoal text-cream">Mobile App</option>
                <option value="Custom / Other" className="bg-charcoal text-cream">Custom / Other</option>
              </select>
            </div>

            <div>
              <div className="section-label mb-3">Your Message *</div>
              <textarea
                value={form.message}
                onChange={set('message')}
                placeholder="Tell us about your project, goals, and timeline…"
                required
                rows={5}
                className={inputClass}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gold text-obsidian font-sans text-[11px] font-bold tracking-[0.25em] uppercase px-10 py-5 min-h-[56px] hover:bg-gold/90 active:scale-[0.98] transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                Send Message on WhatsApp
              </button>
              <p className="font-sans text-[11px] text-obsidian/35 dark:text-cream/35 mt-3">
                Opens WhatsApp with your message pre-filled.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
