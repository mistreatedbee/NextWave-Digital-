import React from 'react';
import { ServiceDetailPage } from '../../components/ServiceDetailPage';

export default function PremiumWebsitePage() {
  return (
    <ServiceDetailPage
      seoTitle="Premium Website Package — R5,500 | NextWave Digital Solutions"
      seoDesc="Unlimited pages, 12 months hosting, ecommerce ready, custom logo, advanced SEO, and ongoing support. The most powerful website package from NextWave."
      name="Premium Website Package"
      price="R5,500"
      badge="Most Powerful"
      tagline="The complete package for established businesses that demand the best."
      description="The Premium Website Package is our flagship offering — a comprehensive, fully-featured website built for businesses that are serious about their online presence. With unlimited pages, 12 months free hosting, advanced SEO, ecommerce capability, and ongoing maintenance, this package delivers everything you need to dominate your market online."
      who="Perfect for established businesses, medium to large enterprises, ecommerce retailers, professional service firms, real estate agencies, and any business that needs a powerful, scalable online platform with long-term support."
      features={[
        'Unlimited custom pages',
        'Free .co.za domain (1 year)',
        'Free 12 months web hosting',
        'Unlimited business email accounts',
        'Advanced SEO strategy and setup',
        'Custom premium logo design',
        'Ecommerce integration (if needed)',
        'Monthly maintenance and updates',
        'Priority support',
        'Mobile-responsive design',
        'Social media integration',
        'Google Analytics and Search Console',
        'WhatsApp chat button',
        'SSL security certificate',
        'Performance optimization',
        'Contact and enquiry forms',
      ]}
      benefits={[
        { title: 'Complete Solution', desc: 'Everything included — hosting, domain, logo, SEO, maintenance — nothing extra to pay for a full year.' },
        { title: 'Scales With You', desc: 'Unlimited pages means your website grows with your business without any rebuild costs.' },
        { title: 'Ongoing Support', desc: 'Monthly maintenance keeps your website updated, secure, and performing at its best.' },
      ]}
      timeline="14–21 Business Days"
      faqs={[
        { q: 'What does monthly maintenance include?', a: 'Monthly maintenance includes content updates, security patches, performance checks, and minor design adjustments.' },
        { q: 'Can I add an online store?', a: 'Yes — ecommerce integration is included if needed, allowing you to sell products or services directly from your website.' },
        { q: 'How long does the free hosting last?', a: 'Free hosting is included for 12 full months. After that, we offer affordable hosting renewal options.' },
      ]}
      waMessage="Hi NextWave Digital Solutions, I would like to book the Premium Website Package for R5500."
      relatedServices={[
        { name: 'Professional Website', price: 'R3,500', href: '/services/professional-website' },
        { name: 'Ecommerce Website',    price: 'R4,000', href: '/services/ecommerce' },
        { name: 'AI Automation',        price: 'R7,499', href: '/services/ai-automation' },
      ]}
    />
  );
}
