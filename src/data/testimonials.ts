export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarInitials: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'mbali-ops-director',
    name: 'Mbali N.',
    role: 'Operations Director',
    company: 'LogiTrans Group',
    quote:
      'NextWave helped us automate dispatch and paperwork. Our team finally has time to focus on exceptions instead of routine admin.',
    avatarInitials: 'MN',
  },
  {
    id: 'david-founder',
    name: 'David K.',
    role: 'Founder & CEO',
    company: 'HealthSync',
    quote:
      'From MVP to a production-ready mobile app serving thousands of users, the team has been an incredible partner.',
    avatarInitials: 'DK',
  },
  {
    id: 'lerato-cio',
    name: 'Lerato S.',
    role: 'CIO',
    company: 'BankCore',
    quote:
      'They modernised critical systems with zero downtime. The new platform is faster, safer, and easier to extend.',
    avatarInitials: 'LS',
  },
];

