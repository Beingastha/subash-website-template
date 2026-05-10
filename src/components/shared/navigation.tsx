'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavigationProps {
  activePage: string;
}

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/#about' },
  { name: 'Academics', href: '/#academics' },
  { name: 'Activities', href: '/activities' },
  { name: 'Hostel', href: '/hostel' },
  { name: 'Teachers', href: '/teachers' },
  { name: 'Principal', href: '/principal' },
  { name: 'Contact', href: '/contact' },
];

export default function Navigation({ activePage }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return activePage === 'home';
    return activePage === href.replace('/', '');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'nav-solid' : 'nav-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Name */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/images/logo.png"
                alt="Govt. HSS Excellence Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1
                className={`text-sm md:text-base font-bold leading-tight transition-colors duration-300 ${
                  scrolled ? 'text-gse-charcoal' : 'text-white'
                }`}
              >
                Govt. HSS Excellence
              </h1>
              <p
                className={`text-xs transition-colors duration-300 ${
                  scrolled ? 'text-gse-gray' : 'text-gse-gold-light'
                }`}
              >
                Subhash Nagar, Bhopal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`nav-link px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:bg-gse-green/10 ${
                  isActive(link.href)
                    ? scrolled
                      ? 'text-gse-green font-semibold'
                      : 'text-gse-gold font-semibold'
                    : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-3 px-5 py-2 bg-gse-gold text-gse-charcoal text-sm font-semibold rounded-md hover:bg-gse-gold-light transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors ${
              scrolled ? 'text-gse-charcoal' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white shadow-xl border-t border-gse-border">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.href)
                    ? 'text-gse-green bg-gse-green/5 font-semibold'
                    : 'text-gse-charcoal hover:bg-gse-cream'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block mt-3 px-4 py-3 bg-gse-gold text-gse-charcoal text-sm font-semibold rounded-md text-center hover:bg-gse-gold-light transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
