import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlogList } from '../hooks/usePublicContent';

export default function BlogListPage() {
  const { data: blogPosts } = useBlogList();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(blogPosts.map((p) => (p as { category?: string }).category || 'Blog').filter(Boolean)))],
    [blogPosts],
  );

  const filtered = blogPosts.filter((post) => {
    const p = post as { category?: string };
    const matchesCategory = category === 'All' || (p.category || 'Blog') === category;
    const matchesQuery =
      !query.trim() ||
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const recent = filtered.slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Insights &amp; Blog
          </h1>
          <p className="text-slate-400">
            Practical articles on AI, product engineering, and digital transformation from the NextWave team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.2fr)] gap-10">
          <div>
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              <input
                type="text"
                placeholder="Search articles..."
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

            <div className="space-y-5">
              {filtered.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 hover:border-teal-500/40 transition-colors"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
                    {(post as { category?: string }).category || 'Blog'}
                  </p>
                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-lg md:text-xl font-bold text-white mb-1">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-slate-500 mb-2">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'} • NextWave Team
                  </p>
                  <p className="text-sm text-slate-300 mb-3">{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xs font-semibold text-teal-400 hover:text-teal-300"
                  >
                    Read article →
                  </Link>
                </article>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-slate-500">
                  No articles match your search just yet.
                </p>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <h3 className="text-sm font-semibold text-white mb-3">
                Recent Posts
              </h3>
              <ul className="space-y-3 text-sm">
                {recent.map((post) => (
                  <li key={post.slug}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-slate-300 hover:text-teal-300"
                    >
                      {post.title}
                    </Link>
                    <p className="text-[11px] text-slate-500">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

