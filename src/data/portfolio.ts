export type PortfolioCategory =
  | 'Websites'
  | 'Mobile Apps'
  | 'AI Systems'
  | 'Task Management'
  | 'E-commerce';

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  thumbnail: string;
  technologies: string[];
  shortDescription: string;
  longDescription?: string;
  href?: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'nexus-automation-hub',
    title: 'Nexus Automation Hub',
    category: 'AI Systems',
    thumbnail: '/images/portfolio/nexus-automation.jpg',
    technologies: ['Node.js', 'React', 'PostgreSQL', 'OpenAI'],
    shortDescription:
      'End-to-end workflow automation reducing manual operations by 80% for a logistics group.',
    longDescription:
      'We designed an orchestration layer that connects CRM, inventory, and finance systems, automating multi-step workflows and approvals.',
  },
  {
    id: 'fleetview-erp',
    title: 'FleetView ERP',
    category: 'Task Management',
    thumbnail: '/images/portfolio/fleetview-erp.jpg',
    technologies: ['React', 'NestJS', 'PostgreSQL', 'Redis'],
    shortDescription:
      'Real-time fleet management and dispatch system for 200+ commercial vehicles.',
  },
  {
    id: 'healthsync-pro',
    title: 'HealthSync Pro',
    category: 'Mobile Apps',
    thumbnail: '/images/portfolio/healthsync-pro.jpg',
    technologies: ['React Native', 'Firebase'],
    shortDescription:
      'Cross-platform health tracking app with secure data syncing and offline support.',
  },
  {
    id: 'retailpulse-pos',
    title: 'RetailPulse POS',
    category: 'E-commerce',
    thumbnail: '/images/portfolio/retailpulse-pos.jpg',
    technologies: ['Electron', 'React', 'SQLite'],
    shortDescription:
      'Multi-location point-of-sale with live inventory and unified reporting.',
  },
  {
    id: 'bankcore-modernisation',
    title: 'BankCore Modernisation',
    category: 'Websites',
    thumbnail: '/images/portfolio/bankcore-modernisation.jpg',
    technologies: ['Next.js', 'Azure', 'SQL Server'],
    shortDescription:
      'Digitisation of legacy banking portals into a modern, secure online platform.',
  },
];

