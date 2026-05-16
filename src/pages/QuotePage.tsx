import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

const WA_NUMBER = '27731531188';

function buildWhatsAppUrl(form: {
  name: string; company: string; email: string; phone: string;
  service: string; budget: string; timeline: string; description: string;
}): string {
  const lines: string[] = [
    'Hi NextWave Digital Solutions, I would like to request a quote.',
    '',
  ];
  if (form.name)        lines.push(`Name: ${form.name}`);
  if (form.phone)       lines.push(`Phone: ${form.phone}`);
  if (form.email)       lines.push(`Email: ${form.email}`);
  if (form.company)     lines.push(`Business Name: ${form.company}`);
  if (form.service)     lines.push(`Service Needed: ${form.service}`);
  if (form.budget)      lines.push(`Budget: ${form.budget}`);
  if (form.timeline)    lines.push(`Timeline: ${form.timeline}`);
  if (form.description) lines.push(`Project Details: ${form.description}`);

  const message = lines.join('\n');
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

const inputClass =
  'w-full bg-transparent font-sans text-[14px] text-obsidian dark:text-cream placeholder:text-obsidian/25 dark:placeholder:text-cream/25 py-3 border-b border-obsidian/20 dark:border-cream/20 focus:border-gold outline-none transition-colors duration-400 appearance-none resize-none';

export function QuotePage() {
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    service: '', budget: '', timeline: '', description: '',
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildWhatsAppUrl(form);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-ivory text-obsidian dark:bg-obsidian dark:text-cream min-h-screen">
      <SEO
        title="Get a Quote — NextWave Digital Solutions"
        description="Tell us about your project and get a quote from NextWave Digital Solutions via WhatsApp."
      />

      <div
        className="max-w-4xl mx-auto px-6 lg:px-10"
        style={{ paddingTop: 'clamp(8rem, 15vw, 12rem)', paddingBottom: 'var(--section-pad)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-4">Project Brief</div>
          <h1
            className="font-display font-bold leading-tight mb-2"
            style={{ fontSize: 'clamp(3rem, 7vw, 8rem)' }}
          >
            Tell Us About
          </h1>
          <h1
            className="font-display font-bold italic text-gold leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 7rem)' }}
          >
            Your Project.
          </h1>
          <p className="font-sans text-sm text-obsidian/50 dark:text-cream/50 mt-4 max-w-md">
            Fill in the form and we'll send everything directly to our WhatsApp — no backend, instant response.
          </p>
        </motion.div>

        <motion.div
          className="h-px bg-gold/20 mt-10 mb-16 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-10"
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
              <div className="section-label mb-3">Business Name</div>
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
              <div className="section-label mb-3">Phone Number *</div>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="073 000 0000" required className={inputClass} />
            </div>
          </div>

          {/* Service */}
          <div>
            <div className="section-label mb-3">Service Required</div>
            <select value={form.service} onChange={set('service')} className={inputClass}>
              <option value="" className="bg-charcoal text-cream/50">Select a service…</option>
              <option value="Starter Website (R2,000)" className="bg-charcoal text-cream">Starter Website — R2,000</option>
              <option value="Professional Website (R3,500)" className="bg-charcoal text-cream">Professional Website — R3,500</option>
              <option value="Premium Website (R5,500)" className="bg-charcoal text-cream">Premium Website — R5,500</option>
              <option value="Landing Page (R750)" className="bg-charcoal text-cream">Landing Page — R750 Special</option>
              <option value="Ecommerce Store (R4,000)" className="bg-charcoal text-cream">Ecommerce Store — R4,000</option>
              <option value="AI Automation Suite (R7,499)" className="bg-charcoal text-cream">AI Automation Suite — R7,499</option>
              <option value="Mobile App Development" className="bg-charcoal text-cream">Mobile App Development</option>
              <option value="Custom Software" className="bg-charcoal text-cream">Custom Software</option>
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
              <div className="section-label mb-3">Preferred Deadline</div>
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
            <div className="section-label mb-3">Project Details</div>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Tell us about your project goals, current challenges, and what success looks like…"
              rows={5}
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gold text-obsidian font-sans text-[11px] font-bold tracking-[0.25em] uppercase px-10 py-5 min-h-[56px] hover:bg-gold/90 active:scale-[0.98] transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              Send Quote Request on WhatsApp
            </button>
            <p className="font-sans text-[11px] text-obsidian/35 dark:text-cream/35 mt-3">
              Opens WhatsApp with your details pre-filled. We'll respond within 2 hours.
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
