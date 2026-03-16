import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { portfolioItems } from '../../data/portfolio';
import { GlassCard } from '../../components/ui/GlassCard';

export function FeaturedPortfolioSection() {
  const featured = portfolioItems.slice(0, 3);

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-950/10 to-transparent" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="px-6 lg:px-10 mb-12">
          <div className="section-tag">
            <TrendingUp className="w-3 h-3" /> Our Work
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
              Projects We&apos;re
              <br />
              <span className="text-gradient-primary">Proud Of</span>
            </h2>
            <Link to="/portfolio">
              <button className="group flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors font-medium">
                Full portfolio
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        <div className="px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item) => (
            <GlassCard key={item.id} hoverEffect>
              <div className="mb-4 text-xs font-semibold tracking-[0.18em] uppercase text-teal-400">
                {item.category}
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 mb-3">{item.shortDescription}</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-[0.16em]">
                {item.technologies.join(' • ')}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

