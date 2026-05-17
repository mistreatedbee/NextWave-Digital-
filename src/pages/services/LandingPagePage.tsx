import React from 'react';
import { ServiceDetailPage } from '../../components/ServiceDetailPage';

export default function LandingPagePage() {
  return (
    <ServiceDetailPage
      seoTitle="Landing Page Special — R750 | NextWave Digital Solutions"
      seoDesc="High-converting landing page with chatbot, booking, gallery, and mobile-friendly design for only R750. Limited time offer."
      name="Landing Page Special"
      price="R750"
      originalPrice="R1,500"
      badge="Limited Offer — 50% Off"
      tagline="A modern, high-converting landing page built for results — at an unbeatable price."
      description="Our Landing Page Special is a focused, single-page website designed to convert visitors into customers. Perfect for businesses that need a quick, professional online presence, this package includes everything needed to capture leads, showcase services, take bookings, and communicate with clients — all for an incredible price."
      who="Ideal for new businesses launching quickly, event planners, coaches, therapists, salons, restaurants, freelancers, and any business that needs a strong single-page presence to drive enquiries and bookings."
      features={[
        'Modern luxury landing page',
        'Mobile-friendly responsive design',
        'Business services section',
        'Photo gallery section',
        'Contact and enquiry form',
        'AI chatbot integration',
        'Online appointment booking system',
        'WhatsApp chat button',
        'Fast loading performance',
        'SEO-ready setup',
        'Social media links',
        'Google Maps integration',
      ]}
      benefits={[
        { title: 'Quick to Launch', desc: 'Go live in days, not weeks. Get your business online fast and start attracting customers immediately.' },
        { title: 'Converts Visitors', desc: 'Every element is designed to guide visitors toward making contact, booking an appointment, or buying.' },
        { title: 'Affordable Entry Point', desc: 'At R750, it is the most cost-effective way to establish a professional online presence for your business.' },
      ]}
      timeline="3–5 Business Days"
      faqs={[
        { q: 'Is this a one-page website?', a: 'Yes — a landing page is a single scrollable page with all your key business information presented in a clean, focused layout.' },
        { q: 'What is the chatbot?', a: 'We integrate a basic AI chatbot that can answer common questions from visitors and capture their contact details automatically.' },
        { q: 'Can I upgrade later?', a: 'Absolutely — you can upgrade to any of our multi-page website packages at any time.' },
      ]}
      waMessage="Hi NextWave Digital Solutions, I would like to book the Landing Page Special for R750."
      relatedServices={[
        { name: 'Starter Website',      price: 'R2,000', href: '/services/starter-website' },
        { name: 'Professional Website', price: 'R3,500', href: '/services/professional-website' },
        { name: 'Ecommerce Website',    price: 'R4,000', href: '/services/ecommerce' },
      ]}
    />
  );
}
