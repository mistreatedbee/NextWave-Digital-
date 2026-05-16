import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitLead } from '../api/leads';
import { SEO } from '../components/SEO';

const inputClass =
  'w-full bg-transparent font-sans text-[14px] text-cream placeholder:text-cream/25 py-3 border-b border-cream/20 focus:border-gold outline-none transition-colors duration-400 resize-none';

export function ContactPage() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [service,  setService]  = useState('');
  const [message,  setMessage]  = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success,  setSuccess]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitLead({
        name,
        email,
        service_interest: service,
        message,
        source_page: '/contact',
      });
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-obsidian text-cream min-h-screen">
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
            className="font-serif font-light text-cream leading-tight"
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

        {/* Contact details — large text links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-0 mb-16"
        >
          <a
            href="tel:+27731531188"
            className="flex items-center py-6 border-b border-cream/8 group"
          >
            <span className="section-label w-28 shrink-0">Phone</span>
            <span
              className="font-serif font-light text-cream group-hover:text-gold transition-colors duration-400"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.8rem)' }}
            >
              073 153 1188
            </span>
          </a>

          <a
            href="https://wa.me/27731531188"
            target="_blank"
            rel="noreferrer"
            className="flex items-center py-6 border-b border-cream/8 group"
          >
            <span className="section-label w-28 shrink-0">WhatsApp</span>
            <span
              className="font-serif font-light text-cream/70 group-hover:text-gold transition-colors duration-400"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}
            >
              WhatsApp Us →
            </span>
          </a>

          <a
            href="mailto:info@nextwavedigitalsolutions.co.za"
            className="flex items-center py-6 border-b border-cream/8 group"
          >
            <span className="section-label w-28 shrink-0">Email</span>
            <span className="font-sans text-base lg:text-lg text-cream/60 group-hover:text-cream transition-colors duration-400 break-all">
              info@nextwavedigitalsolutions.co.za
            </span>
          </a>

          <div className="flex items-center py-6 border-b border-cream/8">
            <span className="section-label w-28 shrink-0">Location</span>
            <span className="font-sans text-sm text-cream/35">
              Nelspruit, Mpumalanga, South Africa
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

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center"
              >
                <div className="w-12 h-12 border border-gold/40 flex items-center justify-center mx-auto mb-8">
                  <span className="text-gold text-xl">✓</span>
                </div>
                <h2
                  className="font-serif font-light text-cream mb-4"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
                >
                  Thank You
                </h2>
                <p className="font-sans text-[14px] text-cream/45 mb-10">
                  We&apos;ll be in touch within 24 hours.
                </p>
                <button
                  onClick={() => { setSuccess(false); setName(''); setEmail(''); setService(''); setMessage(''); }}
                  className="font-sans text-[10px] tracking-[0.28em] uppercase text-cream/40 hover:text-cream transition-colors duration-400"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-10"
                initial={{ opacity: 1 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <div className="section-label mb-3">Your Name</div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <div className="section-label mb-3">Email Address</div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.co.za"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <div className="section-label mb-3">Service Interest</div>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="" className="bg-charcoal text-cream/50">Select a service…</option>
                    <option value="Starter Website" className="bg-charcoal text-cream">Starter Website</option>
                    <option value="Professional Website" className="bg-charcoal text-cream">Professional Website</option>
                    <option value="Premium Website" className="bg-charcoal text-cream">Premium Website</option>
                    <option value="Landing Page" className="bg-charcoal text-cream">Landing Page</option>
                    <option value="Ecommerce Store" className="bg-charcoal text-cream">Ecommerce Store</option>
                    <option value="AI Automation Suite" className="bg-charcoal text-cream">AI Automation Suite</option>
                    <option value="Custom / Other" className="bg-charcoal text-cream">Custom / Other</option>
                  </select>
                </div>

                <div>
                  <div className="section-label mb-3">Your Message</div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project, goals, and timeline…"
                    required
                    rows={5}
                    className={inputClass}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="font-sans text-[11px] tracking-[0.28em] uppercase px-10 py-4 border border-gold/40 hover:border-gold text-cream/70 hover:text-cream hover:bg-gold/5 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending…' : 'Send Message →'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
