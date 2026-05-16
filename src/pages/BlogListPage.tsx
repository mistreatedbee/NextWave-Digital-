import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlogList } from '../hooks/usePublicContent';
import { SEO } from '../components/SEO';

export default function BlogListPage() {
  const { data: blogPosts } = useBlogList();
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState<string>('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(
      blogPosts.map((p) => (p as { category?: string }).category || 'Blog').filter(Boolean)
    ))],
    [blogPosts],
  );

  const filtered = blogPosts.filter((post) => {
    const p = post as { category?: string; title?: string; excerpt?: string };
    const matchesCategory = category === 'All' || (p.category || 'Blog') === category;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.excerpt || '').toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="bg-ivory text-obsidian dark:bg-obsidian dark:text-cream min-h-screen">
      <SEO
        title="Journal — NextWave Digital Solutions"
        description="Insights on web development, AI automation, digital transformation, and business technology from the NextWave team."
      />

      {/* Hero */}
      <section className="pt-40 pb-16 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-4">Insights &amp; Ideas</div>
          <h1
            className="font-display font-semibold leading-tight mb-8"
            style={{ fontSize: 'clamp(3rem, 7vw, 8rem)' }}
          >
            Journal
          </h1>

          {/* Search */}
          <div className="flex border-b border-cream/20 focus-within:border-gold transition-colors duration-400 max-w-sm">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="flex-1 bg-transparent font-sans text-[13px] text-cream placeholder:text-cream/25 py-3 outline-none"
            />
          </div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Category tabs */}
        <motion.div
          className="flex gap-8 border-b border-cream/8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`relative font-sans text-[10px] tracking-[0.22em] uppercase pb-4 transition-colors duration-400 ${
                category === cat ? 'text-cream' : 'text-cream/35 hover:text-cream/70'
              }`}
            >
              {cat}
              {category === cat && (
                <motion.span
                  layoutId="blog-tab"
                  className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Article list */}
        {filtered.length === 0 ? (
          <p className="font-sans text-[13px] text-cream/35 py-20 text-center">No articles found.</p>
        ) : (
          <div className="space-y-0">
            {filtered.map((post: any, i: number) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="ruled-line" />
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-16 py-10 -mx-6 lg:-mx-10 px-6 lg:px-10 hover:bg-gold/[0.015] transition-colors duration-300"
                >
                  {/* Meta left */}
                  <div className="lg:w-48 shrink-0">
                    <span className="section-label text-cream/35 block mb-1">
                      {post.category || 'Blog'}
                    </span>
                    <span className="font-sans text-[11px] text-cream/25">
                      {post.date || ''} &middot; {post.readTime || ''}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2
                      className="font-serif font-light text-cream group-hover:text-gold transition-colors duration-400 leading-tight mb-3"
                      style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}
                    >
                      {post.title}
                    </h2>
                    <p className="font-sans text-[13px] text-cream/45 leading-relaxed max-w-xl">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="font-sans text-[10px] tracking-[0.22em] uppercase text-cream/25 group-hover:text-gold transition-colors duration-400 shrink-0 self-start lg:self-center">
                    Read →
                  </div>
                </Link>
              </motion.div>
            ))}
            <div className="ruled-line" />
          </div>
        )}

        <div className="py-24" />
      </div>
    </div>
  );
}
