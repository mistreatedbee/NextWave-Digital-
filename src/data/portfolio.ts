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
    id: 'safe-cloud-africa',
    title: 'Safe Cloud Africa',
    category: 'Websites',
    thumbnail: '/safe cloud africa.png',
    technologies: ['React', 'Node.js', 'Supabase', 'TypeScript'],
    shortDescription: 'Cloud security and data compliance platform for African enterprises.',
    longDescription: 'A full-scale cloud security management system built for African enterprises needing POPIA compliance, data sovereignty, and enterprise-grade access controls.',
    href: 'https://safecloudafrica.co.za',
  },
  {
    id: 'kagie-app',
    title: 'Kagie App',
    category: 'Mobile Apps',
    thumbnail: '/kagie app.png',
    technologies: ['React Native', 'Firebase', 'Expo', 'Node.js'],
    shortDescription: 'Community-driven mobile platform connecting local South African communities.',
    longDescription: 'A mobile-first community platform enabling local commerce, events, and service discovery optimised for low-bandwidth environments.',
    href: 'https://kagie-app.vercel.app',
  },
  {
    id: 'kagie-app-v2',
    title: 'Kagie App V2',
    category: 'Mobile Apps',
    thumbnail: '/kagie app.png',
    technologies: ['React Native', 'Firebase', 'Expo', 'Node.js'],
    shortDescription: 'Second generation of the Kagie community platform with enhanced features.',
    longDescription: 'The upgraded version of the Kagie community app featuring improved UX, richer local commerce tools, and expanded community engagement features.',
    href: 'https://kagie-app-v2.vercel.app',
  },
  {
    id: 'nvm-frontend',
    title: 'NVM Frontend',
    category: 'Websites',
    thumbnail: '/nvm .png',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
    shortDescription: 'Enterprise frontend dashboard for a financial services management platform.',
    longDescription: 'A sophisticated data-dense dashboard system featuring real-time analytics, multi-level user roles, document management, and workflow approvals.',
    href: 'https://nvm-frontend.vercel.app',
  },
  {
    id: 'autovital',
    title: 'AutoVital',
    category: 'Websites',
    thumbnail: '/autovital.png',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe', 'Supabase'],
    shortDescription: 'Automotive diagnostics and maintenance tracking SaaS for South African car owners.',
    longDescription: 'A subscription-based automotive platform offering vehicle health tracking, service reminders, and mechanic booking across South Africa.',
    href: 'https://autovital.vercel.app',
  },
  {
    id: 'nextwave-digital',
    title: 'NextWave Digital',
    category: 'Websites',
    thumbnail: '/logo.jpeg',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
    shortDescription: 'Our own agency website — a showcase of cinematic editorial design and premium UX.',
    longDescription: 'The NextWave Digital Solutions website itself — a premium luxury editorial experience with Lenis smooth scroll, Clash Display typography, and full CMS integration.',
    href: 'https://next-wave-digital.vercel.app',
  },
  {
    id: '3ds-sawmill',
    title: "3D's Sawmill",
    category: 'E-commerce',
    thumbnail: '/3d sawmill.png',
    technologies: ['WordPress', 'WooCommerce', 'PHP', 'MySQL'],
    shortDescription: 'E-commerce website for a timber and sawmill business in Mpumalanga.',
    longDescription: 'A full-featured e-commerce platform for a regional timber supplier with volume pricing, quote requests, and an integrated stock management dashboard.',
    href: 'https://3-d-s-sawmill.vercel.app',
  },
  {
    id: 'communityhub2',
    title: 'CommunityHub2',
    category: 'Websites',
    thumbnail: '/communityhub.png',
    technologies: ['React', 'Supabase', 'Tailwind CSS', 'Node.js'],
    shortDescription: 'Second-generation community management platform with events and resource sharing.',
    longDescription: 'An upgraded community management system for residential estates and business parks featuring visitor management, maintenance ticketing, and document library.',
    href: 'https://communityhub2.vercel.app',
  },
  {
    id: 'mzansi-prolife',
    title: 'Mzansi Prolife',
    category: 'Websites',
    thumbnail: '/mzansi profile.png',
    technologies: ['React', 'Supabase', 'CMS', 'Email Integration'],
    shortDescription: 'Non-profit organisation website for a South African pro-life advocacy group.',
    longDescription: 'A purpose-built advocacy website featuring petition and supporter registration, donation flows, event management, and a multimedia resource library.',
    href: 'https://mzansiprolife.vercel.app',
  },
  {
    id: 'mzansi-prolife-2',
    title: 'Mzansi Prolife 2',
    category: 'Websites',
    thumbnail: '/mzansi profile.png',
    technologies: ['React', 'Supabase', 'CMS'],
    shortDescription: 'Second version of the Mzansi Prolife advocacy platform with enhanced features.',
    href: 'https://mzansiprolife2.vercel.app',
  },
  {
    id: 'mzansi-prolife-3',
    title: 'Mzansi Prolife 3',
    category: 'Websites',
    thumbnail: '/mzansi profile.png',
    technologies: ['React', 'Supabase', 'CMS'],
    shortDescription: 'Latest iteration of the Mzansi Prolife platform with improved UX and performance.',
    href: 'https://mzansiprolife3.vercel.app',
  },
  {
    id: 'mzansi-prolife-12',
    title: 'Mzansi Prolife 1.2',
    category: 'Websites',
    thumbnail: '/mzansi profile.png',
    technologies: ['React', 'CMS'],
    shortDescription: 'Updated 1.2 release of the Mzansi Prolife digital advocacy platform.',
    href: 'https://mzansiprolife12.vercel.app',
  },
  {
    id: 'christian-leadership-movement',
    title: 'Christian Leadership Movement',
    category: 'Websites',
    thumbnail: '/christianleadershipmovement.png',
    technologies: ['React', 'CMS', 'Email Integration', 'Stripe'],
    shortDescription: 'Ministry and leadership development website with event management and donation flows.',
    longDescription: 'A comprehensive digital presence for a pan-African ministry with sermon library, event registration, leadership programme enrolments, and online giving.',
    href: 'https://www.christianleadershipmovement.co.za',
  },
  {
    id: 'mobilehealth-v3',
    title: 'MobileHealth V3',
    category: 'Mobile Apps',
    thumbnail: '/mobile health app.png',
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'HL7', 'Expo'],
    shortDescription: 'Third-generation mobile health platform with telehealth and patient record management.',
    longDescription: 'A comprehensive mobile health solution with real-time video consultations, AI symptom checking, multi-facility record sharing, and full HIPAA/POPIA compliance.',
    href: 'https://mobilehealth-v3.vercel.app',
  },
  {
    id: 'ashley-mash-portfolio',
    title: 'Ashley Mash Portfolio',
    category: 'Websites',
    thumbnail: '/ashley portfolio.png',
    technologies: ['React', 'Framer Motion', 'GSAP', 'Tailwind CSS'],
    shortDescription: 'Creative portfolio website for a visual artist and digital creator.',
    longDescription: 'A visually immersive personal portfolio with cinematic scroll experiences, smooth page transitions, a masonry gallery, and an integrated commission booking system.',
    href: 'https://ashley-mash-portfolio-zeta.vercel.app',
  },
];
