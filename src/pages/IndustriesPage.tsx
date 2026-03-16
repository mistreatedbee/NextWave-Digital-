import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Store,
  Rocket,
  HeartHandshake,
  Church,
  Briefcase,
  GraduationCap } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
export function IndustriesPage() {
  const industries = [
  {
    icon: <Rocket className="w-8 h-8 text-cyan-400" />,
    title: 'Startups',
    desc: 'MVP development, scalable tech stacks, and rapid iteration for high-growth startups.'
  },
  {
    icon: <Briefcase className="w-8 h-8 text-blue-400" />,
    title: 'SMEs',
    desc: 'Digital transformation solutions to help small and medium businesses compete with giants.'
  },
  {
    icon: <Building2 className="w-8 h-8 text-violet-400" />,
    title: 'Corporates',
    desc: 'Enterprise-grade systems, secure internal tools, and legacy system modernization.'
  },
  {
    icon: <Store className="w-8 h-8 text-pink-400" />,
    title: 'Retail & Restaurants',
    desc: 'POS systems, inventory management, online ordering, and loyalty programs.'
  },
  {
    icon: <Church className="w-8 h-8 text-emerald-400" />,
    title: 'Churches & Institutions',
    desc: 'Member management systems, donation platforms, and communication tools.'
  },
  {
    icon: <HeartHandshake className="w-8 h-8 text-red-400" />,
    title: 'NGOs & Non-Profits',
    desc: 'Impact tracking, donor management, and awareness platforms.'
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-yellow-400" />,
    title: 'Education',
    desc: 'Learning management systems (LMS), student portals, and administrative tools.'
  }];

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Industries We <span className="text-gradient">Serve</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We understand the unique challenges of different sectors and build
            tailored solutions to address them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) =>
          <GlassCard key={index} hoverEffect>
              <div className="mb-4 p-3 rounded-lg bg-white/5 w-fit">
                {industry.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {industry.title}
              </h3>
              <p className="text-slate-400">{industry.desc}</p>
            </GlassCard>
          )}
        </div>

        <div className="mt-20 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-3xl p-12 text-center border border-white/5">
          <h2 className="text-3xl font-bold text-white mb-6">
            Don't see your industry?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Technology is universal. We adapt our expertise to solve problems in
            any sector.
          </p>
          <Link to="/contact">
            <Button size="lg">Let's Discuss Your Project</Button>
          </Link>
        </div>
      </div>
    </div>);

}