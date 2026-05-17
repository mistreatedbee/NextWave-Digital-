import React from 'react';
import { ServiceDetailPage } from '../../components/ServiceDetailPage';

export default function AiAutomationServicePage() {
  return (
    <ServiceDetailPage
      seoTitle="AI Automation Package — R7,499 | NextWave Digital Solutions"
      seoDesc="Automate your customer support, emails, follow-ups, bookings, leads, and workflows with AI. R7,499 once-off. NextWave Digital Solutions."
      name="AI Automation Suite"
      price="R7,499"
      badge="Work Smarter"
      tagline="Let AI handle the repetitive work while you focus on growing your business."
      description="The AI Automation Suite is a comprehensive business automation setup that connects your systems, automates your repetitive tasks, and helps your business run more efficiently around the clock. From intelligent chatbots to automated email campaigns, CRM workflows, and sales funnels — we build automation systems that generate leads, support customers, and reduce admin work significantly."
      who="Ideal for businesses that receive high volumes of enquiries, appointments, or customer support requests — including real estate agencies, medical practices, retail businesses, service companies, and any SME that wants to scale operations without adding staff."
      features={[
        'AI chatbot (website and WhatsApp)',
        'Automated email response system',
        'Customer follow-up automation',
        'Lead capture automation',
        'Online appointment scheduling automation',
        'CRM integration and automation',
        'Customer support automation',
        'Business workflow automation',
        'Reporting and analytics automation',
        'Social media automation',
        'Sales funnel automation',
        'Integration with existing tools',
      ]}
      benefits={[
        { title: 'Save Hours Every Week', desc: 'Automation handles repetitive tasks so your team focuses on high-value work that grows the business.' },
        { title: 'Never Miss a Lead', desc: 'Automated follow-ups and lead capture systems ensure every potential client is contacted promptly.' },
        { title: 'Scale Without Staff', desc: 'Handle more customers, more enquiries, and more bookings without increasing your headcount.' },
      ]}
      timeline="14–21 Business Days"
      faqs={[
        { q: 'What is an AI chatbot?', a: 'An AI chatbot is a smart automated assistant on your website or WhatsApp that answers common customer questions, captures leads, and books appointments — 24/7, without human involvement.' },
        { q: 'Do I need technical knowledge to use the automation?', a: 'No — we set everything up and train you on how to manage it. Most automations run independently once set up.' },
        { q: 'Can you integrate with my existing software?', a: 'Yes — we can integrate with most popular CRMs, email platforms, booking systems, and business tools.' },
      ]}
      waMessage="Hi NextWave Digital Solutions, I would like to book the AI Automation Package for R7499."
      relatedServices={[
        { name: 'Premium Website',   price: 'R5,500', href: '/services/premium-website' },
        { name: 'Ecommerce Website', price: 'R4,000', href: '/services/ecommerce' },
        { name: 'Mobile App',        price: 'Custom', href: '/services/mobile-app' },
      ]}
    />
  );
}
