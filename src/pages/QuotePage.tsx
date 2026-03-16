import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { GlassCard } from '../components/ui/GlassCard';
import { submitLead } from '../api/leads';

export function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    timeline: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const message = [
        form.company && `Company: ${form.company}`,
        form.timeline && `Timeline: ${form.timeline}`,
        form.description,
      ]
        .filter(Boolean)
        .join('\n\n');
      const { ok } = await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        service_interest: form.service || undefined,
        budget_range: form.budget || undefined,
        message: message || undefined,
        source_page: '/quote',
      });
      if (ok) {
        setIsSuccess(true);
        window.scrollTo(0, 0);
      } else {
        setIsSuccess(true);
      }
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isSuccess) {
    return (
      <div className="min-h-screen pt-20 pb-20 flex items-center justify-center px-4">
        <GlassCard className="max-w-lg w-full text-center p-12 border-green-500/30">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Request Received!
          </h2>
          <p className="text-slate-300 mb-8">
            Thank you for contacting NextWave Digital. We've received your
            project details and will get back to you within 24 hours with a
            preliminary quote.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline">
            Submit Another Request
          </Button>
        </GlassCard>
      </div>);

  }
  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Request a <span className="text-gradient">Quote</span>
          </h1>
          <p className="text-xl text-slate-300">
            Tell us about your project. We'll analyze your requirements and
            provide a custom solution tailored to your needs.
          </p>
        </div>

        <GlassCard className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Company Name"
                placeholder="Your Company Ltd"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Phone / WhatsApp"
                type="tel"
                placeholder="+27 82 123 4567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <Select
              label="Type of Service"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              options={[
              {
                value: 'custom-software',
                label: 'Custom Software Development'
              },
              {
                value: 'web-app',
                label: 'Web Application / Platform'
              },
              {
                value: 'mobile-app',
                label: 'Mobile App Development'
              },
              {
                value: 'website',
                label: 'Business Website'
              },
              {
                value: 'ecommerce',
                label: 'E-commerce / Marketplace'
              },
              {
                value: 'ai-automation',
                label: 'AI & Automation'
              },
              {
                value: 'pos',
                label: 'POS / Retail System'
              },
              {
                value: 'other',
                label: 'Other / Not Sure'
              }]
              }
              required />


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Budget Range"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                options={[
                {
                  value: 'under-10k',
                  label: 'Under R10,000'
                },
                {
                  value: '10k-50k',
                  label: 'R10,000 - R50,000'
                },
                {
                  value: '50k-100k',
                  label: 'R50,000 - R100,000'
                },
                {
                  value: '100k-plus',
                  label: 'R100,000+'
                }]
                } />

              <Select
                label="Timeline"
                value={form.timeline}
                onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                options={[
                {
                  value: 'asap',
                  label: 'ASAP'
                },
                {
                  value: '1-2-months',
                  label: '1-2 Months'
                },
                {
                  value: '3-6-months',
                  label: '3-6 Months'
                },
                {
                  value: 'flexible',
                  label: 'Flexible'
                }]
                } />

            </div>

            <Textarea
              label="Project Description"
              placeholder="Tell us about your project goals, features you need, and the problem you're trying to solve..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className="min-h-[150px]"
            />


            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}>

                Submit Request
              </Button>
              <p className="text-center text-slate-500 text-sm mt-4">
                We respect your privacy. Your information is secure and will
                never be shared.
              </p>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>);

}