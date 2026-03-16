import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Globe,
  Smartphone,
  ShoppingCart,
  Calendar,
  LayoutDashboard,
  Store,
  MessageSquare,
  Server,
  Wrench,
  Zap } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
export function ServicesPage() {
  const services = [
  {
    icon: <Globe className="w-8 h-8 text-cyan-400" />,
    title: 'Custom Website Development',
    desc: 'High-performance business websites that go beyond simple brochures. We build functional, interactive platforms.'
  },
  {
    icon: <Code2 className="w-8 h-8 text-blue-400" />,
    title: 'Web Applications & Platforms',
    desc: 'Complex web-based software, client portals, and SaaS products built with modern technologies.'
  },
  {
    icon: <Smartphone className="w-8 h-8 text-violet-400" />,
    title: 'Mobile App Development',
    desc: 'Native Android & iOS apps or cross-platform solutions using React Native and Flutter.'
  },
  {
    icon: <ShoppingCart className="w-8 h-8 text-pink-400" />,
    title: 'E-commerce & Marketplaces',
    desc: 'Custom online stores and multi-vendor marketplaces with secure payment integrations.'
  },
  {
    icon: <Calendar className="w-8 h-8 text-orange-400" />,
    title: 'Booking & Appointment Systems',
    desc: 'Automated scheduling tools for service businesses, clinics, and consultants.'
  },
  {
    icon: <LayoutDashboard className="w-8 h-8 text-emerald-400" />,
    title: 'Admin Dashboards',
    desc: 'Centralized control panels to manage data, users, and business metrics in real-time.'
  },
  {
    icon: <Store className="w-8 h-8 text-yellow-400" />,
    title: 'POS & Retail Systems',
    desc: 'Point of sale solutions with inventory tracking and sales analytics.'
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-indigo-400" />,
    title: 'Communication Systems',
    desc: 'Integrated chat, SMS, and email notification systems for internal or customer use.'
  },
  {
    icon: <Zap className="w-8 h-8 text-red-400" />,
    title: 'API Integrations',
    desc: 'Connect your systems with third-party services like payment gateways, CRMs, and maps.'
  },
  {
    icon: <Server className="w-8 h-8 text-slate-400" />,
    title: 'Hosting & Server Setup',
    desc: 'Secure cloud infrastructure setup on AWS, DigitalOcean, or Azure.'
  },
  {
    icon: <Wrench className="w-8 h-8 text-teal-400" />,
    title: 'Maintenance & Support',
    desc: 'Ongoing technical support, security updates, and feature enhancements.'
  }];

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive digital solutions tailored to your business needs. We
            build everything from simple websites to complex enterprise systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) =>
          <GlassCard key={index} hoverEffect className="flex flex-col h-full">
              <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit border border-white/10">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {service.title}
              </h3>
              <p className="text-slate-400 mb-6 flex-grow">{service.desc}</p>
              <Link to="/quote" className="mt-auto">
                <Button variant="outline" className="w-full">
                  Request This Service
                </Button>
              </Link>
            </GlassCard>
          )}
        </div>

        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Don't see what you need?
          </h2>
          <p className="text-slate-400 mb-6">
            We specialize in custom development. If you can imagine it, we can
            build it.
          </p>
          <Link to="/contact">
            <Button>Contact Us for a Custom Solution</Button>
          </Link>
        </div>
      </div>
    </div>);

}