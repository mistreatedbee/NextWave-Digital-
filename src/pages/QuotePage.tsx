import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitLead } from '../api/leads';
import { SEO } from '../components/SEO';

const inputClass =
  'w-full bg-transparent font-sans text-[14px] text-cream placeholder:text-cream/25 py-3 border-b border-cream/20 focus:border-gold outline-none transition-colors duration-400 appearance-none resize-none';

export function QuotePage() {
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [form,       setForm]       = useState({
    name:        '',
    company:     '',
    email:       '',
    phone:       '',
    service:     '',
    budget:      '',
    timeline:    '',
    description: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const message = [
        form.company && `Company: ${form.company}`,
        form.timeline && `Timeline: ${form.timeline}`,
        form.description,
      ].filter(Boolean).join('\n\n');

      await submitLead({
        name:             form.name,
        email:            form.email,
        phone:            form.phone || undefined,
        service_interest: form.service || undefined,
        budget_range:     form.budget || undefined,
        message:          message || undefined,
        source_page:      '/quote',
      });
      setSuccess(true);
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-obsidian text-cream min-h-screen">
      <SEO
        title="Get a Quote — NextWave Digital Solutions"
        description="Tell us about your project and get a detailed quote from the NextWave team."
      />

      <div
        className="max-w-4xl mx-auto px-6 lg:px-10"
        style={{ paddingTop: 'clamp(8rem, 15vw, 12rem)', paddingBottom: 'var(--section-pad)' }}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <div className="w-14 h-14 border border-gold/40 flex items-center justify-center mx-auto mb-10">
                <span className="text-gold text-2xl">✓</span>
              </div>
              <div className="section-label mb-4 mx-auto">Request Received</div>
              <h1
                className="font-serif font-light text-cream mb-6 leading-tight"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
              >
                We&apos;ll Be in Touch
              </h1>
              <p className="font-sans text-[14px] text-cream/45 mb-12 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. We&apos;ll review your project details and respond within 24 hours with a preliminary quote.
              </p>
              <button
                onClick={() => { setSuccess(false); setForm({ name:'', company:'', email:'', phone:'', service:'', budget:'', timeline:'', description:'' }); }}
                className="font-sans text-[10px] tracking-[0.28em] uppercase text-cream/35 hover:text-cream transition-colors duration-400"
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="section-label mb-4">Project Brief</div>
                <h1
                  className="font-serif font-light text-cream leading-tight mb-2"
                  style={{ fontSize: 'clamp(3rem, 7vw, 8rem)' }}
                >
                  Tell Us About
                </h1>
                <h1
                  className="font-serif font-light italic text-gold leading-tight"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 7rem)' }}
                >
                  Your Project.
                </h1>
              </motion.div>

              <motion.div
                className="h-px bg-gold/20 mt-10 mb-16 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />

              <motion.form
                onSubmit={handleSubmit}
                className="space-y-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Name + Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <div className="section-label mb-3">Your Name *</div>
                    <input type="text" value={form.name} onChange={set('name')} placeholder="Jane Smith" required className={inputClass} />
                  </div>
                  <div>
                    <div className="section-label mb-3">Company</div>
                    <input type="text" value={form.company} onChange={set('company')} placeholder="Acme Ltd." className={inputClass} />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <div className="section-label mb-3">Email Address *</div>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="jane@company.co.za" required className={inputClass} />
                  </div>
                  <div>
                    <div className="section-label mb-3">Phone Number</div>
                    <input type="tel" value={form.phone} onChange={set('phone')} placeholder="073 000 0000" className={inputClass} />
                  </div>
                </div>

                {/* Service */}
                <div>
                  <div className="section-label mb-3">Service Required</div>
                  <select value={form.service} onChange={set('service')} className={inputClass}>
                    <option value="" className="bg-charcoal text-cream/50">Select a service…</option>
                    <option value="Starter Website" className="bg-charcoal text-cream">Starter Website</option>
                    <option value="Professional Website" className="bg-charcoal text-cream">Professional Website</option>
                    <option value="Premium Website" className="bg-charcoal text-cream">Premium Website</option>
                    <option value="Landing Page" className="bg-charcoal text-cream">Landing Page</option>
                    <option value="Ecommerce Store" className="bg-charcoal text-cream">Ecommerce Store</option>
                    <option value="AI Automation Suite" className="bg-charcoal text-cream">AI Automation Suite</option>
                    <option value="Custom Software" className="bg-charcoal text-cream">Custom Software</option>
                    <option value="Mobile App" className="bg-charcoal text-cream">Mobile App</option>
                    <option value="Other" className="bg-charcoal text-cream">Other</option>
                  </select>
                </div>

                {/* Budget + Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <div className="section-label mb-3">Budget Range</div>
                    <select value={form.budget} onChange={set('budget')} className={inputClass}>
                      <option value="" className="bg-charcoal text-cream/50">Select a range…</option>
                      <option value="Under R5,000" className="bg-charcoal text-cream">Under R5,000</option>
                      <option value="R5,000 – R15,000" className="bg-charcoal text-cream">R5,000 – R15,000</option>
                      <option value="R15,000 – R50,000" className="bg-charcoal text-cream">R15,000 – R50,000</option>
                      <option value="R50,000+" className="bg-charcoal text-cream">R50,000+</option>
                      <option value="Flexible" className="bg-charcoal text-cream">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <div className="section-label mb-3">Timeline</div>
                    <select value={form.timeline} onChange={set('timeline')} className={inputClass}>
                      <option value="" className="bg-charcoal text-cream/50">Select a timeline…</option>
                      <option value="ASAP" className="bg-charcoal text-cream">ASAP</option>
                      <option value="1 – 2 months" className="bg-charcoal text-cream">1 – 2 months</option>
                      <option value="3 – 6 months" className="bg-charcoal text-cream">3 – 6 months</option>
                      <option value="Flexible" className="bg-charcoal text-cream">Flexible</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="section-label mb-3">Project Description</div>
                  <textarea
                    value={form.description}
                    onChange={set('description')}
                    placeholder="Tell us about your project goals, current challenges, and what success looks like for you…"
                    rows={6}
                    className={inputClass}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="font-sans text-[11px] tracking-[0.28em] uppercase px-10 py-4 border border-gold/40 hover:border-gold text-cream/70 hover:text-cream hover:bg-gold/5 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting…' : 'Submit Request →'}
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
