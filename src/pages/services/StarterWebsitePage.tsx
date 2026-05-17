import React from 'react';
import { ServiceDetailPage } from '../../components/ServiceDetailPage';

export default function StarterWebsitePage() {
  return (
    <ServiceDetailPage
      seoTitle="Starter Website Package — R2,000 | NextWave Digital Solutions"
      seoDesc="Get a professional 5-page website for your business starting at R2,000. Includes free domain, hosting, SEO, and mobile-friendly design."
      name="Starter Website Package"
      price="R2,000"
      badge="Most Affordable"
      tagline="A clean, professional 5-page website to establish your online presence fast."
      description="The Starter Website Package is designed for startups, freelancers, and small businesses that need a polished, professional online presence without breaking the bank. You get a complete, mobile-friendly website with everything you need to start attracting clients online — built and delivered quickly."
      who="This package is perfect for brand-new businesses, sole traders, freelancers, service providers, and small businesses that are just getting started online and need a credible, professional website at an affordable price."
      features={[
        'Up to 5 custom pages',
        'Free .co.za domain (1 year)',
        'Free 1 month web hosting',
        'Unlimited business email accounts',
        'Basic SEO setup',
        'Mobile-responsive design',
        'Social media links integration',
        'Contact form',
        'WhatsApp chat button',
        'Google Maps integration',
        'Fast loading pages',
        'SSL security certificate',
      ]}
      benefits={[
        { title: 'Professional First Impression', desc: 'A polished, modern website builds instant trust and credibility with potential clients.' },
        { title: 'Found Online', desc: 'Basic SEO setup helps your business appear in Google search results in your area.' },
        { title: 'Ready in Days', desc: 'Fast turnaround means your business is live online and attracting customers quickly.' },
      ]}
      timeline="5–7 Business Days"
      faqs={[
        { q: 'Can I add more pages later?', a: 'Yes — you can upgrade to a Professional or Premium package at any time to expand your website.' },
        { q: 'Do I own the website?', a: 'Absolutely. Once delivered and paid, the website is 100% yours.' },
        { q: 'What do I need to provide?', a: 'We just need your business name, logo (if you have one), contact details, services, and any text or images you want included.' },
      ]}
      waMessage="Hi NextWave Digital Solutions, I would like to book the Starter Website Package for R2000."
      relatedServices={[
        { name: 'Professional Website', price: 'R3,500', href: '/services/professional-website' },
        { name: 'Premium Website',      price: 'R5,500', href: '/services/premium-website' },
        { name: 'Landing Page Special', price: 'R750',   href: '/services/landing-page' },
      ]}
    />
  );
}
