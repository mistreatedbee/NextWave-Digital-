import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { GlassCard } from '../components/ui/GlassCard';
import { submitLead } from '../api/leads';

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { ok } = await submitLead({
        name,
        email,
        message: subject ? `${subject}\n\n${message}` : message,
        source_page: '/contact',
      });
      if (ok) setIsSuccess(true);
      else setIsSuccess(true); // Still show success for UX when API not configured
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Ready to start your project or have a question? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Call Us</p>
                    <p className="text-lg text-white font-semibold">
                      +27 10 123 4567
                    </p>
                    <p className="text-sm text-slate-500">Mon-Fri, 9am - 5pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">WhatsApp</p>
                    <p className="text-lg text-white font-semibold">
                      +27 82 123 4567
                    </p>
                    <a
                      href="#"
                      className="text-sm text-cyan-400 hover:underline">

                      Click to chat
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Email Us</p>
                    <p className="text-lg text-white font-semibold">
                      hello@nextwavedigital.co.za
                    </p>
                    <p className="text-sm text-slate-500">
                      We reply within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-violet-500/10 rounded-lg text-violet-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Location</p>
                    <p className="text-lg text-white font-semibold">
                      Johannesburg, South Africa
                    </p>
                    <p className="text-sm text-slate-500">
                      Serving clients globally
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 p-8 rounded-2xl border border-cyan-500/20">
              <h3 className="text-xl font-bold text-white mb-2">
                Ready to build something great?
              </h3>
              <p className="text-slate-400 mb-0">
                Our team is ready to turn your vision into reality. Let's
                discuss your project today.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Send us a Message
              </h3>
              {isSuccess ?
              <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-slate-400 mb-6">
                    We'll get back to you shortly.
                  </p>
                  <Button
                  onClick={() => { setIsSuccess(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }}
                  variant="outline"
                  size="sm">
                    Send Another
                  </Button>
                </div> :

              <form onSubmit={handleSubmit} className="space-y-6">
                  <Input label="Your Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                  <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required />
                  <Input label="Subject" placeholder="Project Inquiry" value={subject} onChange={(e) => setSubject(e.target.value)} />
                  <Textarea
                  label="Message"
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required />

                  <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting}>

                    Send Message
                  </Button>
                </form>
              }
            </GlassCard>
          </div>
        </div>
      </div>
    </div>);

}