import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { GlassCard } from '../components/ui/GlassCard';
export function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    }, 1500);
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
              <Input label="Full Name" placeholder="John Doe" required />
              <Input label="Company Name" placeholder="Your Company Ltd" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required />

              <Input
                label="Phone / WhatsApp"
                type="tel"
                placeholder="+27 82 123 4567" />

            </div>

            <Select
              label="Type of Service"
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
              required
              className="min-h-[150px]" />


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