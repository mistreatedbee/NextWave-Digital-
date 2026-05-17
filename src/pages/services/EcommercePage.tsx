import React from 'react';
import { ServiceDetailPage } from '../../components/ServiceDetailPage';

export default function EcommercePage() {
  return (
    <ServiceDetailPage
      seoTitle="Ecommerce Website Package — R4,000 | NextWave Digital Solutions"
      seoDesc="Complete online store with unlimited products, secure payments, admin dashboard, training, hosting, and domain included. R4,000 once-off."
      name="Ecommerce Website Package"
      price="R4,000"
      badge="Sell Online"
      tagline="A complete, professional online store built to sell your products around the clock."
      description="The Ecommerce Website Package gives you everything you need to sell products online in South Africa and beyond. From unlimited product listings to secure payment processing, order management, and a customer-friendly shopping experience — this package sets your business up to generate revenue online 24/7."
      who="Perfect for retailers, boutiques, handmade goods sellers, clothing stores, beauty brands, food businesses, and any business that wants to sell products directly to customers online."
      features={[
        'Unlimited product listings',
        'Product categories and filters',
        'Secure payment gateway integration (Payfast / Peach Payments)',
        'Secure checkout process',
        'Order management dashboard',
        'Admin control panel',
        'Mobile-friendly shopping experience',
        'Product image galleries',
        'Stock management',
        'Customer accounts and order history',
        'Free hosting and domain included',
        'WhatsApp support button',
        'Training session included',
        'SSL security certificate',
      ]}
      benefits={[
        { title: 'Sell 24/7', desc: 'Your online store works around the clock — taking orders and payments even while you sleep.' },
        { title: 'Full Control', desc: 'The admin dashboard lets you manage products, orders, and stock without needing a developer.' },
        { title: 'Trusted Payments', desc: 'Integrated with trusted South African payment gateways so customers can pay with confidence.' },
      ]}
      timeline="10–14 Business Days"
      faqs={[
        { q: 'What payment methods are supported?', a: 'We integrate Payfast or Peach Payments, which supports EFT, credit cards, debit cards, and more South African payment methods.' },
        { q: 'Is training included?', a: 'Yes — we include a training session to walk you through managing your products, orders, and store settings.' },
        { q: 'Can I add more products over time?', a: 'Yes — you have unlimited product listings and can add, edit, or remove products at any time from your admin dashboard.' },
      ]}
      waMessage="Hi NextWave Digital Solutions, I would like to book the Ecommerce Website Package for R4000."
      relatedServices={[
        { name: 'Premium Website',  price: 'R5,500', href: '/services/premium-website' },
        { name: 'AI Automation',    price: 'R7,499', href: '/services/ai-automation' },
        { name: 'Landing Page',     price: 'R750',   href: '/services/landing-page' },
      ]}
    />
  );
}
