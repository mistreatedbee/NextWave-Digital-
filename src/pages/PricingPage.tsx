import React, { useState } from 'react';
import { Tabs } from '../components/ui/Tabs';
import { specialOffers } from '../data/offers';
import { GlassCard } from '../components/ui/GlassCard';
import { Link } from 'react-router-dom';

type Tier = 'starter' | 'business' | 'enterprise';

interface PricingPlan {
  id: Tier;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const CATEGORIES = ['websites', 'apps', 'ai', 'tasks'] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_LABEL: Record<Category, string> = {
  websites: 'Websites',
  apps: 'Apps',
  ai: 'AI',
  tasks: 'Task Systems',
};

const PLANS: Record<Category, PricingPlan[]> = {
  websites: [
    {
      id: 'starter',
      name: 'Starter Site',
      price: 'From R9,500',
      description: 'Brochure-style website ideal for new businesses and campaigns.',
      features: ['Up to 5 pages', 'Mobile responsive', 'Contact forms', 'Basic analytics'],
    },
    {
      id: 'business',
      name: 'Business Website',
      price: 'From R18,500',
      description: 'A more advanced marketing site with extra sections and integrations.',
      features: ['Up to 10 pages', 'Blog & resources', 'Lead capture forms', 'On-page SEO setup'],
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Web Presence',
      price: 'From R35,000',
      description: 'For organisations needing multiple sections, portals, or custom layouts.',
      features: ['Unlimited pages', 'Multi-language support', 'Custom components', 'Performance optimisation'],
    },
  ],
  apps: [
    {
      id: 'starter',
      name: 'MVP App',
      price: 'From R45,000',
      description: 'Validate your idea with a focused, high-quality MVP.',
      features: ['Core feature set', 'Modern UI', 'Basic auth', 'Analytics events'],
    },
    {
      id: 'business',
      name: 'Growth App',
      price: 'From R80,000',
      description: 'A scalable app with additional flows and integrations.',
      features: ['Role-based access', '3rd-party integrations', 'Error monitoring', 'Staging environment'],
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Platform',
      price: 'Custom',
      description: 'Complex, multi-module platforms with strict SLAs.',
      features: ['Custom architecture', 'Security review', 'SLAs & support', 'Dedicated team'],
    },
  ],
  ai: [
    {
      id: 'starter',
      name: 'AI Pilot',
      price: 'From R25,000',
      description: 'One focused AI workflow or chatbot to prove value quickly.',
      features: ['Discovery workshop', 'One automation or bot', 'Iteration round', 'Handover session'],
    },
    {
      id: 'business',
      name: 'Automation Suite',
      price: 'From R55,000',
      description: 'Multiple automations or agents across your operations.',
      features: ['Up to 3 workflows', 'Monitoring dashboard', 'Prompt & model tuning', 'Training for your team'],
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'AI Transformation',
      price: 'Custom',
      description: 'Strategic AI roadmap and implementation at scale.',
      features: ['Roadmap & architecture', 'Multiple pilots', 'Governance & security', 'Ongoing optimisation'],
    },
  ],
  tasks: [
    {
      id: 'starter',
      name: 'Team Tracker',
      price: 'From R30,000',
      description: 'Simple task and worker tracking for smaller teams.',
      features: ['Task boards', 'Basic reporting', 'Email notifications', 'Permissions'],
    },
    {
      id: 'business',
      name: 'Ops Control',
      price: 'From R60,000',
      description: 'Robust task & workforce system for operations teams.',
      features: ['Advanced workflows', 'Shift scheduling', 'Custom reports', 'API access'],
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Operations Suite',
      price: 'Custom',
      description: 'End-to-end operations platform tailored to your processes.',
      features: ['Multi-location support', 'SLAs & escalations', 'Integrations', 'Dedicated success manager'],
    },
  ],
};

export default function PricingPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('websites');

  const tabs = CATEGORIES.map((id) => ({ id, label: CATEGORY_LABEL[id] }));
  const plans = PLANS[activeCategory];

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Pricing & Packages
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Transparent starting points for typical projects. We&apos;ll refine a proposal around
            your exact requirements.
          </p>
          <div className="mt-6">
            <Tabs tabs={tabs} activeId={activeCategory} onChange={(id) => setActiveCategory(id as Category)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <GlassCard
              key={plan.id}
              hoverEffect
              className={plan.highlighted ? 'border-teal-500/40 bg-slate-900/60' : ''}
            >
              <div className="flex flex-col h-full">
                <div className="mb-3">
                  <h2 className="text-lg font-bold text-white">{plan.name}</h2>
                  <p className="text-sm text-slate-400">{plan.description}</p>
                </div>
                <div className="mb-4">
                  <p className="text-xl font-semibold text-teal-400">{plan.price}</p>
                  {plan.highlighted && (
                    <p className="inline-flex mt-1 rounded-full bg-teal-500/10 px-2 py-0.5 text-[11px] font-semibold text-teal-300">
                      Most Popular
                    </p>
                  )}
                </div>
                <ul className="space-y-2 text-sm text-slate-300 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/quote" className="mt-auto">
                  <button className="w-full rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2.5 text-sm transition-colors">
                    Request a Detailed Quote
                  </button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="border-t border-white/5 pt-10">
          <h2 className="text-xl font-bold text-white mb-4">Current Specials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialOffers.map((offer) => (
              <GlassCard key={offer.id} hoverEffect>
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
                  {offer.badge}
                </p>
                <h3 className="text-base font-bold text-white mb-2">{offer.title}</h3>
                <p className="text-sm text-slate-300">{offer.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

