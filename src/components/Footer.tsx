import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowRight } from
'lucide-react';
import { BrandLogo } from './BrandLogo';
export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <BrandLogo className="mb-6" />
            <p className="text-slate-400 mb-6 leading-relaxed">
              Next-generation digital solutions studio. We build custom
              software, platforms, and AI systems that help businesses scale.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) =>
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all">

                  <Icon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
              {
                name: 'Home',
                path: '/'
              },
              {
                name: 'About Us',
                path: '/about'
              },
              {
                name: 'Services',
                path: '/services'
              },
              {
                name: 'Solutions',
                path: '/solutions'
              },
              {
                name: 'Industries',
                path: '/industries'
              },
              {
                name: 'Get a Quote',
                path: '/quote'
              }].
              map((link) =>
              <li key={link.name}>
                  <Link
                  to={link.path}
                  className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">

                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                    {link.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Our Services
            </h3>
            <ul className="space-y-3">
              {[
              'Custom Software',
              'Web Applications',
              'Mobile Apps',
              'AI & Automation',
              'Business Systems',
              'E-commerce'].
              map((service) =>
              <li key={service}>
                  <Link
                  to="/services"
                  className="text-slate-400 hover:text-cyan-400 transition-colors">

                    {service}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-cyan-500 shrink-0 mt-1" />
                <span>
                  Nelspruit, South Africa
                  <br />
                  (Serving Global Clients)
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-5 h-5 text-cyan-500 shrink-0" />
                <span>+27 73 153 1188</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-5 h-5 text-cyan-500 shrink-0" />
                <span>nextwavedigitalsolutionsza@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} NextWave Digital. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>);

}
