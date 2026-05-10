'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gse-charcoal text-white">
      {/* Gold accent line */}
      <div className="h-1 bg-gradient-to-r from-gse-gold-dark via-gse-gold to-gse-gold-dark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* School Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo.png"
                  alt="Govt. HSS Excellence Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-gse-gold font-bold text-sm leading-tight">
                  Govt. HSS Excellence
                </h3>
                <p className="text-gray-400 text-xs">Subhash Nagar, Bhopal</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              A Government School of Excellence under the Department of School Education, Madhya Pradesh. Committed to nurturing tomorrow&apos;s leaders through quality education and holistic development.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-gse-green flex items-center justify-center hover:bg-gse-green-light transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gse-green flex items-center justify-center hover:bg-gse-green-light transition-colors" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gse-green flex items-center justify-center hover:bg-gse-green-light transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gse-green flex items-center justify-center hover:bg-gse-green-light transition-colors" aria-label="YouTube">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gse-gold font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/#about' },
                { name: 'Academics', href: '/#academics' },
                { name: 'Activities', href: '/activities' },
                { name: 'Hostel', href: '/hostel' },
                { name: 'Faculty', href: '/teachers' },
                { name: "Principal's Message", href: '/principal' },
                { name: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-gse-gold transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-gse-gold rounded-full shrink-0" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gse-gold font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gse-gold shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Subhash Shivaji Nagar, Bhopal,<br />
                  Madhya Pradesh - 462016
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gse-gold shrink-0" />
                <span className="text-gray-400 text-sm">+91 755-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gse-gold shrink-0" />
                <span className="text-gray-400 text-sm">info@gsehssbpl.mp.gov.in</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-gse-gold shrink-0" />
                <span className="text-gray-400 text-sm">Mon-Sat: 8:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Map Placeholder */}
          <div>
            <h3 className="text-gse-gold font-bold text-lg mb-4">Find Us</h3>
            <div className="w-full h-40 bg-gse-green/20 rounded-lg border border-gse-green/30 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="text-gse-gold mx-auto mb-2" />
                <p className="text-gray-400 text-xs">Subhash Shivaji Nagar</p>
                <p className="text-gray-500 text-xs">Bhopal, MP 462016</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} Govt. Higher Secondary School for Excellence, Subhash Shivaji Nagar, Bhopal. All Rights Reserved.
          </p>
          <p className="text-gray-500 text-xs">
            UDISE Code: <span className="text-gse-gold">23320301711</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
