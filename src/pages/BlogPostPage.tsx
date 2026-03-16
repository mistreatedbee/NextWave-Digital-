import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blog';
import { Markdown } from '../utils/markdown';

const contentModules = import.meta.glob('../content/blog/*.md', {
  as: 'raw',
  eager: true,
});

const CONTENT: Record<string, string> = {
  'getting-started-with-ai-automation':
    contentModules['../content/blog/getting-started-with-ai-automation.md'] as string,
  'designing-scalable-web-apps':
    contentModules['../content/blog/designing-scalable-web-apps.md'] as string,
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post || !slug) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Post not found
          </h1>
          <p className="text-slate-400 mb-4">
            The article you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link to="/blog" className="text-teal-400 hover:text-teal-300 text-sm">
            View all articles →
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
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-teal-400 mb-2">
          {post.category}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          {post.title}
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          {post.date} • {post.readTime} • {post.author}
        </p>
        <div className="prose prose-invert max-w-none">
          <Markdown content={body} />
        </div>

        {related.length > 0 && (
          <div className="mt-10 border-t border-white/10 pt-6">
            <h2 className="text-sm font-semibold text-white mb-3">
              Related articles
            </h2>
            <ul className="space-y-2 text-sm">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="text-slate-300 hover:text-teal-300"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

