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
    shortDescription:
      'Cloud security and data compliance platform for African enterprises.',
    longDescription:
      'A full-scale cloud security management system built for African enterprises needing POPIA compliance, data sovereignty, and enterprise-grade access controls. The platform provides real-time threat monitoring, audit trails, and compliance reporting tailored to South African regulatory requirements.',
    href: '#',
  },
  {
    id: 'kagie-app',
    title: 'Kagie App',
    category: 'Mobile Apps',
    thumbnail: '/kagie app.png',
    technologies: ['React Native', 'Firebase', 'Expo', 'Node.js'],
    shortDescription:
      'Community-driven mobile platform connecting local South African communities.',
    longDescription:
      'A mobile-first community platform that connects township and rural communities, enabling local commerce, events, and service discovery. Features include in-app messaging, local business listings, event management, and a community noticeboard — all optimised for low-bandwidth environments.',
    href: '#',
  },
  {
    id: 'nvm-frontend',
    title: 'NVM Frontend',
    category: 'Websites',
    thumbnail: '/nvm .png',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
    shortDescription:
      'Enterprise frontend dashboard for a financial services management platform.',
    longDescription:
      'A sophisticated, data-dense dashboard system for a financial services firm, featuring real-time analytics, multi-level user roles, document management, and workflow approvals. Built with performance and accessibility as core priorities.',
    href: '#',
  },
  {
    id: 'autovital',
    title: 'AutoVital',
    category: 'Websites',
    thumbnail: '/autovital.png',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe', 'Supabase'],
    shortDescription:
      'Automotive diagnostics and maintenance tracking SaaS for South African car owners.',
    longDescription:
      'A subscription-based automotive platform offering vehicle health tracking, service reminders, mechanic booking, and digital service records. Integrated with South African parts suppliers and insurance providers to provide a complete vehicle ownership experience.',
    href: '#',
  },
  {
    id: 'nextwave-digital',
    title: 'NextWave Digital',
    category: 'Websites',
    thumbnail: '/logo.jpeg',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
    shortDescription:
      'Our own agency website — a showcase of cinematic editorial design and premium UX.',
    longDescription:
      'The NextWave Digital Solutions website itself — designed as a premium luxury editorial experience that communicates the quality and sophistication of our work. Features include smooth parallax, editorial typography with Cormorant Garamond, an admin CMS, and lead capture integration.',
    href: '#',
  },
  {
    id: '3ds-sawmill',
    title: "3D's Sawmill",
    category: 'E-commerce',
    thumbnail: '/3d sawmill.png',
    technologies: ['WordPress', 'WooCommerce', 'PHP', 'MySQL'],
    shortDescription:
      'E-commerce website for a timber and sawmill business in Mpumalanga.',
    longDescription:
      'A full-featured e-commerce platform for a regional timber supplier, featuring product catalogue with volume pricing, quote request system, delivery zone calculator, and an integrated stock management dashboard for the business owner.',
    href: '#',
  },
  {
    id: 'communityhub2',
    title: 'CommunityHub2',
    category: 'Websites',
    thumbnail: '/communityhub.png',
    technologies: ['React', 'Supabase', 'Tailwind CSS', 'Node.js'],
    shortDescription:
      'Second-generation community management platform with events and resource sharing.',
    longDescription:
      'An upgraded community management system serving residential estates and business parks. Features include visitor management, maintenance ticketing, resident communications, event booking, and a document library — all in a clean, accessible interface.',
    href: '#',
  },
  {
    id: 'mzansi-prolife',
    title: 'Mzansi Prolife',
    category: 'Websites',
    thumbnail: '/mzansi profile.png',
    technologies: ['React', 'Supabase', 'CMS', 'Email Integration'],
    shortDescription:
      'Non-profit organisation website for a South African pro-life advocacy group.',
    longDescription:
      'A purpose-built advocacy website featuring a content management system, petition and supporter registration, donation flows, event management, and a multimedia resource library. Designed to engage and mobilise supporters across South Africa.',
    href: '#',
  },
  {
    id: 'christian-leadership-movement',
    title: 'Christian Leadership Movement',
    category: 'Websites',
    thumbnail: '/christianleadershipmovement.png',
    technologies: ['React', 'CMS', 'Email Integration', 'Stripe'],
    shortDescription:
      'Ministry and leadership development website with event management and donation flows.',
    longDescription:
      'A comprehensive digital presence for a pan-African ministry organisation. Features sermon media library, event registration, leadership programme enrolments, online giving with recurring donations, and a member portal — all managed through a custom admin dashboard.',
    href: '#',
  },
  {
    id: 'mobilehealth-v3',
    title: 'MobileHealth V3',
    category: 'Mobile Apps',
    thumbnail: '/mobile health app.png',
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'HL7', 'Expo'],
    shortDescription:
      'Third-generation mobile health platform with telehealth and patient record management.',
    longDescription:
      'A comprehensive mobile health solution supporting telehealth consultations, patient records, medication tracking, and integration with South African health information systems. The V3 rebuild introduced real-time video consultations, AI symptom checking, and multi-facility record sharing with full HIPAA and POPIA compliance.',
    href: '#',
  },
  {
    id: 'ashley-mash-portfolio',
    title: 'Ashley Mash Portfolio',
    category: 'Websites',
    thumbnail: '/ashley portfolio.png',
    technologies: ['React', 'Framer Motion', 'GSAP', 'Tailwind CSS'],
    shortDescription:
      'Creative portfolio website for a visual artist and digital creator.',
    longDescription:
      'A visually immersive personal portfolio site for a South African digital artist. Features cinematic scroll experiences, smooth page transitions, a masonry gallery with lightbox, and an integrated contact and commission booking system.',
    href: '#',
  },
];
