import React from 'react';
import { ServiceDetailPage } from '../../components/ServiceDetailPage';

export default function ProfessionalWebsitePage() {
  return (
    <ServiceDetailPage
      seoTitle="Professional Website Package — R3,500 | NextWave Digital Solutions"
      seoDesc="A comprehensive 10-page website with enhanced SEO, custom logo, Google Business optimization, and 3 months free hosting. R3,500 once-off."
      name="Professional Website Package"
      price="R3,500"
      badge="Best for Growing Businesses"
      tagline="A comprehensive website for growing businesses that want a stronger digital presence."
      description="The Professional Website Package is built for businesses that are ready to take their online presence seriously. With up to 10 pages, a custom logo, enhanced SEO, and Google Business optimization, this package positions your business as a credible, professional brand that clients can trust."
      who="Ideal for growing businesses, established SMEs, retail stores, restaurants, healthcare providers, and service businesses that want more than just a basic website — they want a strong digital identity that generates leads."
      features={[
        'Up to 10 custom pages',
        'Free .co.za domain (1 year)',
        'Free 3 months web hosting',
        'Unlimited business email accounts',
        'Enhanced SEO with keyword targeting',
        'Custom logo design included',
        'Google Business Profile optimization',
        'Mobile-responsive design',
        'Social media links integration',
        'Contact and enquiry form',
        'WhatsApp chat button',
        'Google Analytics integration',
        'SSL security certificate',
        'Fast loading performance',
      ]}
      benefits={[
        { title: 'Custom Brand Identity', desc: 'A professionally designed logo and website creates a consistent brand that clients remember.' },
        { title: 'More Google Visibility', desc: 'Enhanced SEO and Google Business optimization means more customers find you when they search.' },
        { title: 'Generate More Leads', desc: 'Contact forms, WhatsApp integration, and clear calls-to-action convert visitors into paying clients.' },
      ]}
      timeline="7–14 Business Days"
      faqs={[
        { q: 'Is the logo design really included?', a: 'Yes — a professional custom logo design is included at no extra cost with this package.' },
        { q: 'What is Google Business optimization?', a: 'We set up and optimize your Google Business Profile so your business appears in Google Maps and local search results.' },
        { q: 'Can I update the content myself?', a: 'Yes — we can set up a simple content management system so you can update text and images without needing a developer.' },
      ]}
      waMessage="Hi NextWave Digital Solutions, I would like to book the Professional Website Package for R3500."
      relatedServices={[
        { name: 'Starter Website',  price: 'R2,000', href: '/services/starter-website' },
        { name: 'Premium Website',  price: 'R5,500', href: '/services/premium-website' },
        { name: 'Ecommerce Website', price: 'R4,000', href: '/services/ecommerce' },
      ]}
    />
  );
}
