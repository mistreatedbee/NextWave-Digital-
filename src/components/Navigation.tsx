import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandLogo } from './BrandLogo';
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  const navLinks = [
  {
    name: 'Home',
    path: '/'
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
    name: 'About',
    path: '/about'
  }];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <BrandLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) =>
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-cyan-400 ${location.pathname === link.path ? 'text-cyan-400' : 'text-slate-300'}`}>

                  {link.name}
                </Link>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Link to="/contact">
                <Button variant="ghost" size="sm">
                  Contact
                </Button>
              </Link>
              <Link to="/quote">
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ChevronRight className="w-4 h-4" />}>

                  Get Quote
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu">

            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          exit={{
            opacity: 0,
            height: 0
          }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 overflow-hidden">

            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) =>
            <Link
              key={link.path}
              to={link.path}
              className={`block text-lg font-medium py-2 ${location.pathname === link.path ? 'text-cyan-400' : 'text-slate-300'}`}>

                  {link.name}
                </Link>
            )}
              <div className="pt-4 flex flex-col gap-3">
                <Link to="/contact" className="w-full">
                  <Button variant="outline" className="w-full justify-center">
                    Contact Us
                  </Button>
                </Link>
                <Link to="/quote" className="w-full">
                  <Button variant="primary" className="w-full justify-center">
                    Get a Quote
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </nav>);

}