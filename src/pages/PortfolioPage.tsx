import React, { useState } from 'react';
import { portfolioItems, PortfolioCategory, PortfolioItem } from '../data/portfolio';
import { GlassCard } from '../components/ui/GlassCard';
import { LightboxModal } from '../components/LightboxModal';

const CATEGORIES: (PortfolioCategory | 'All')[] = [
  'All',
  'Websites',
  'Mobile Apps',
  'AI Systems',
  'Task Management',
  'E-commerce',
];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const filtered =
    selectedCategory === 'All'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Portfolio & Case Studies
          </h1>
          <p className="text-slate-400 max-w-2xl">
            A selection of platforms, systems, and digital products we&apos;ve delivered for
            clients across industries.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  isActive
                    ? 'bg-teal-500 text-white border-teal-400'
                    : 'bg-slate-900/40 text-slate-300 border-white/10 hover:border-teal-400/60 hover:text-teal-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <GlassCard
              key={item.id}
              hoverEffect
              onClick={() => setActiveItem(item)}
              className="flex flex-col h-full"
            >
              <div className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-teal-400">
                {item.category}
              </div>
              <h2 className="font-display text-lg font-bold text-white mb-2">{item.title}</h2>
              <p className="text-sm text-slate-400 mb-3 flex-1">{item.shortDescription}</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-[0.16em]">
                {item.technologies.join(' • ')}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      <LightboxModal
        isOpen={!!activeItem}
        onClose={() => setActiveItem(null)}
        title={activeItem?.title ?? ''}
        category={activeItem?.category}
        description={activeItem?.longDescription ?? activeItem?.shortDescription}
        technologies={activeItem?.technologies}
      />
    </div>
  );
}

