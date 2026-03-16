export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  badge: string;
  expiresAt?: string;
}

export const specialOffers: SpecialOffer[] = [
  {
    id: 'launch-website',
    title: 'Launch-Ready Website Bundle',
    description:
      'Up to 5 pages, contact forms, basic SEO, and launch support for growing businesses.',
    badge: 'Perfect for SMEs',
    expiresAt: undefined,
  },
  {
    id: 'ai-starter',
    title: 'AI Automation Starter',
    description:
      'Discovery workshop plus a pilot automation (bot or workflow) delivered in 4–6 weeks.',
    badge: 'AI Pilot',
  },
  {
    id: 'ops-suite',
    title: 'Operations Suite Discount',
    description:
      'Preferential rate when combining task management, dashboards, and reporting in one project.',
    badge: 'Bundle & Save',
  },
];

