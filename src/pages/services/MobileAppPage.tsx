import React from 'react';
import { ServiceDetailPage } from '../../components/ServiceDetailPage';

export default function MobileAppPage() {
  return (
    <ServiceDetailPage
      seoTitle="Mobile App Development | NextWave Digital Solutions"
      seoDesc="Custom Android and iOS mobile app development for South African businesses. Scalable, modern, and built for real users."
      name="Mobile App Development"
      price="Custom Quote"
      badge="iOS & Android"
      tagline="Custom mobile applications built for your business, your users, and your goals."
      description="NextWave Digital Solutions builds custom mobile applications for businesses that need a powerful digital platform. Whether you need a customer-facing app, a staff management tool, a booking platform, or a full enterprise solution — we design and develop mobile apps that are intuitive, fast, and scalable."
      who="Best suited for businesses that need a dedicated mobile experience for their customers or staff — including delivery services, healthcare providers, hospitality businesses, retail brands, service companies, and startups building a digital product."
      features={[
        'Android and iOS compatible (React Native)',
        'Modern, custom UI/UX design',
        'User authentication and profiles',
        'Booking and appointment features',
        'Push notifications',
        'Payment gateway integration (if needed)',
        'Admin dashboard (if needed)',
        'Offline functionality (where applicable)',
        'API and backend integration',
        'App Store and Google Play submission',
        'Scalable app architecture',
        'Ongoing maintenance and updates',
      ]}
      benefits={[
        { title: 'Built for Your Users', desc: 'Custom design means the app is built around how your specific users think and behave — not a generic template.' },
        { title: 'One App, Two Platforms', desc: 'React Native technology lets us build one app that runs natively on both iOS and Android, reducing development cost.' },
        { title: 'Grows With Your Business', desc: 'Scalable architecture means new features can be added as your business grows and evolves.' },
      ]}
      timeline="4–12 Weeks (depending on complexity)"
      faqs={[
        { q: 'How much does a mobile app cost?', a: 'App development is priced based on features and complexity. Contact us for a free consultation and custom quote tailored to your specific requirements.' },
        { q: 'Will it work on both iPhone and Android?', a: 'Yes — we build using React Native, which allows a single app to run on both iOS and Android devices natively.' },
        { q: 'Do you help submit to the App Store and Google Play?', a: 'Yes — we handle the full submission process to both the Apple App Store and Google Play Store.' },
      ]}
      waMessage="Hi NextWave Digital Solutions, I am interested in Mobile App Development. Please contact me to discuss my project."
      relatedServices={[
        { name: 'Premium Website',  price: 'R5,500', href: '/services/premium-website' },
        { name: 'AI Automation',    price: 'R7,499', href: '/services/ai-automation' },
        { name: 'Ecommerce Website', price: 'R4,000', href: '/services/ecommerce' },
      ]}
    />
  );
}
