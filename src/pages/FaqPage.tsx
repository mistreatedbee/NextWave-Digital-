import React, { useMemo, useState } from 'react';
import { faqs } from '../data/faqs';
import { Accordion } from '../components/ui/Accordion';
import { Link } from 'react-router-dom';

export default function FaqPage() {
  const [category, setCategory] = useState<string>('All');
  const [query, setQuery] = useState('');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(faqs.map((f) => f.category)))],
    [],
  );

  const filtered = faqs.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesQuery =
      !query.trim() ||
      item.question.toLowerCase().includes(query.toLowerCase()) ||
      item.answer.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-400 mb-6">
          Answers to common questions about working with NextWave Digital.
        </p>

        <div className="flex flex-wrap gap-3 items-center mb-6">
          <input
            type="text"
            placeholder="Search questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-64 rounded-xl bg-slate-900/70 border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    active
                      ? 'bg-teal-500 text-white border-teal-400'
                      : 'bg-slate-900/50 text-slate-300 border-white/10 hover:border-teal-400/60 hover:text-teal-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <Accordion
          items={filtered.map((f) => ({
            title: f.question,
            content: f.answer,
          }))}
        />

        <div className="mt-8 text-sm text-slate-400">
          Still have questions?{' '}
          <Link to="/contact" className="text-teal-400 hover:text-teal-300">
            Reach out to us →
          </Link>
        </div>
      </div>
    </div>
  );
}

