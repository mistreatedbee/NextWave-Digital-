export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Services' | 'Pricing' | 'Projects';
}

export const faqs: FaqItem[] = [
  {
    id: 'general-timeline',
    category: 'General',
    question: 'How long does a typical project take?',
    answer:
      'Most website and smaller app projects take 4–8 weeks. Larger platforms, AI systems, or multi-phase engagements can range from 3–6 months.',
  },
  {
    id: 'services-tech-stack',
    category: 'Services',
    question: 'What technologies do you specialise in?',
    answer:
      'We focus on modern JavaScript/TypeScript stacks (React, Node.js, Next.js), cloud platforms, and AI/automation tooling.',
  },
  {
    id: 'pricing-budget',
    category: 'Pricing',
    question: 'Do you work with fixed budgets?',
    answer:
      'Yes. We can provide fixed-price proposals for clearly scoped projects, or flexible retainers for ongoing product development.',
  },
  {
    id: 'projects-process',
    category: 'Projects',
    question: 'What does your delivery process look like?',
    answer:
      'We start with discovery, then move into design, implementation, testing, and launch. You get clear milestones, demos, and progress updates throughout.',
  },
];

