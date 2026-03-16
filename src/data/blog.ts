export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: 'getting-started-with-ai-automation',
    title: 'Getting Started with AI Automation in Your Business',
    excerpt:
      'Practical steps to identify automation opportunities and ship your first AI-powered workflow.',
    category: 'AI & Automation',
    author: 'Ashley Mashigo',
    date: '2025-11-01',
    readTime: '7 min read',
    tags: ['AI', 'Automation', 'Operations'],
  },
  {
    slug: 'designing-scalable-web-apps',
    title: 'Designing Scalable Web Applications for Growth',
    excerpt:
      'Architecture principles and trade-offs when building web apps that can handle real-world scale.',
    category: 'Engineering',
    author: 'Ashley Mashigo',
    date: '2025-11-15',
    readTime: '8 min read',
    tags: ['Architecture', 'Web Apps'],
  },
];

