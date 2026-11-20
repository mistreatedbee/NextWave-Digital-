import React from 'react';
import { ServiceDetailPage } from '../../components/ServiceDetailPage';

export default function LandingPagePage() {
  return (
    <ServiceDetailPage
      seoTitle="Landing Page — R3,000 Once-Off | NextWave Digital Solutions"
      seoDesc="One page. Everything your business needs. Modern landing page with chatbot, booking, appointments, gallery and terms page — R3,000 once-off, no monthly fees."
      name="Landing Page"
      price="R3,000"
      badge="Once-Off · No Monthly Fees"
      tagline="One page. Everything your business needs."
      description="A fast, professional and affordable website — a modern landing page built to help your business grow and turn visitors into loyal customers. It includes everything needed to showcase your services, display your terms, take bookings, manage appointments and chat with clients — once-off, with no monthly fees."
      who="Ideal for new businesses launching quickly, event planners, coaches, therapists, salons, restaurants, freelancers, and any business that needs a strong single-page presence to drive enquiries and bookings."
      features={[
        'Modern and professional design',
        'Chatbot integration',
        'Business services section',
        'Contracts / terms page',
        'Gallery / portfolio section',
        'Customer booking system',
        'Appointments management',
        'Mobile responsive',
        'Fast loading and SEO optimised',
        'Easy to edit and manage',
        'WhatsApp chat button',
        'Contact and enquiry form',
      ]}
      benefits={[
        { title: 'Quick to Launch', desc: 'Go live in days, not weeks. Get your business online fast and start attracting customers immediately.' },
        { title: 'Converts Visitors', desc: 'Every element is designed to guide visitors toward making contact, booking an appointment, or buying.' },
        { title: 'No Monthly Fees', desc: 'At R3,000 once-off, it is a cost-effective way to establish a professional online presence with no ongoing monthly fees.' },
      ]}
      timeline="3–5 Business Days"
      faqs={[
        { q: 'Is this a one-page website?', a: 'Yes — a landing page is a single scrollable page with all your key business information presented in a clean, focused layout.' },
        { q: 'What is the chatbot?', a: 'We integrate a basic AI chatbot that can answer common questions from visitors and capture their contact details automatically.' },
        { q: 'Can I upgrade later?', a: 'Absolutely — you can upgrade to any of our multi-page website packages at any time.' },
      ]}
      waMessage="Hi NextWave Digital Solutions, I would like to book the Landing Page for R3000."
      relatedServices={[
        { name: 'Starter Website',      price: 'R3,500', href: '/services/starter-website' },
        { name: 'Professional Website', price: 'R5,000', href: '/services/professional-website' },
        { name: 'Ecommerce Website',    price: 'R5,500', href: '/services/ecommerce' },
      ]}
    />
  );
}
