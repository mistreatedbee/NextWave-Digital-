import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blog';
import { Markdown } from '../utils/markdown';
import { SEO } from '../components/SEO';

const contentModules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const CONTENT: Record<string, string> = {
  'getting-started-with-ai-automation':
    contentModules['../content/blog/getting-started-with-ai-automation.md'],
  'designing-scalable-web-apps':
    contentModules['../content/blog/designing-scalable-web-apps.md'],
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post || !slug) {
    return (
      <div className="bg-ivory text-obsidian dark:bg-obsidian dark:text-cream min-h-screen pt-40 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="section-label mb-4">404</div>
          <h1 className="font-serif font-light text-cream text-5xl mb-6">Post Not Found</h1>
          <p className="font-sans text-[14px] text-cream/50 mb-8">
            The article you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link to="/blog" className="font-sans text-[10px] tracking-[0.28em] uppercase text-gold hover:text-cream transition-colors duration-400">
            View All Articles →
          </Link>
        </div>
      </div>
    );
  }

  const body = CONTENT[slug] ?? '';
  const related = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="bg-ivory text-obsidian dark:bg-obsidian dark:text-cream min-h-screen">
      <SEO title={`${post.title} — NextWave Journal`} description={post.excerpt} />

      {/* Hero */}
      <section className="pt-40 pb-16 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-label mb-4">{post.category}</div>
          <h1
            className="font-display font-semibold leading-tight mb-8 max-w-4xl"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 5.5rem)' }}
          >
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 font-sans text-[11px] text-cream/30 mb-12">
            <span>{post.author}</span>
            <span className="w-1 h-1 rounded-full bg-cream/20" />
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-cream/20" />
            <span>{post.readTime}</span>
          </div>

          {/* Ruled line */}
          <motion.div
            className="h-px bg-gold/20 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      </section>

      {/* Article body */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto px-6 lg:px-10 pb-24"
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '17px',
          lineHeight: '1.9',
          color: 'rgba(244,239,230,0.65)',
        }}
      >
        <Markdown content={body} />

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 pt-16 border-t border-cream/8">
            <div className="section-label mb-8">More Articles</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="group block p-6 border border-cream/8 hover:border-gold/30 transition-colors duration-400"
                >
                  <div className="section-label text-cream/30 mb-2">{p.category}</div>
                  <h3 className="font-serif font-light text-cream text-xl group-hover:text-gold transition-colors duration-400 leading-snug">
                    {p.title}
                  </h3>
                  <p className="font-sans text-[12px] text-cream/35 mt-2 line-clamp-2">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <Link
            to="/blog"
            className="group flex items-center gap-3 font-sans text-[10px] tracking-[0.28em] uppercase text-cream/35 hover:text-cream transition-colors duration-400"
          >
            <span className="block h-px w-6 bg-current" />
            Back to Journal
          </Link>
        </div>
      </motion.article>
    </div>
  );
}
