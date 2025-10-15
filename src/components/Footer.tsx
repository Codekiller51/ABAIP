import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <img src="logo-white.png" alt="ABA IP Consultants Logo" className="h-12" />
                <div className="absolute inset-0 bg-primary-400 opacity-20 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
              </div>
              <div>
                
                <span className="text-2xl font-bold group-hover:text-primary-300 transition-colors duration-300">
                  ABA IP
                </span>
                <div className="text-xs text-neutral-400 font-medium tracking-wide">
                  Consultancy
                </div>
              </div>
            </Link>
            <p className="text-neutral-300 mb-6 max-w-md leading-relaxed">
              ABA IP is a premier Tanzania-based law firm specializing exclusively in intellectual property (IP) across Africa. We operate directly and through partnerships with regional organizations such as OAPI and  ARIPO. 
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Facebook, href: '#', label: 'Facebook' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="group relative p-3 bg-neutral-800 rounded-lg hover:bg-primary-600 transition-all duration-300 transform hover:scale-110"
                >
                  <social.icon className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors duration-300" />
                  <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-300">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Services', href: '/services' },
                { name: 'Our Team', href: '/team' },
                { name: 'Resources', href: '/resources' },
                { name: 'Case Studies', href: '#' },
                { name: 'Blog', href: '#' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-neutral-300 hover:text-primary-300 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-300">Contact Info</h3>
            <div className="space-y-4">
              {[
                { icon: Phone, text: '+255 713 447 706', href: 'tel:+255713447706' },
                { icon: Mail, text: 'info@abaip.co.tz', href: 'mailto:info@abaip.co.tz' },
              ].map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="flex items-center space-x-3 text-neutral-300 hover:text-primary-300 transition-colors duration-300 group"
                >
                  <div className="p-2 bg-neutral-800 rounded-lg group-hover:bg-primary-600 transition-colors duration-300">
                    <contact.icon className="h-4 w-4" />
                  </div>
                  <span>{contact.text}</span>
                </a>
              ))}
              <div className="flex items-start space-x-3 text-neutral-300">
                <div className="p-2 bg-neutral-800 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>
                  Dar es Salaam<br />
                  Tanzania
                </span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-6 p-4 bg-gradient-to-r from-accent-600/20 to-primary-600/20 rounded-lg border border-accent-500/30">
              <h4 className="font-semibold text-accent-300 mb-2">Whatsapp</h4>
              <a 
                href="tel:+18005550123"
                className="text-white hover:text-accent-300 transition-colors duration-300 font-medium"
              >
                +255 713 447 706
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-neutral-400">
              <p>© 2025 ABA IP Consultants Law Firm. All rights reserved.</p>
              <div className="flex space-x-4">
                <Link to="#" className="hover:text-primary-300 transition-colors duration-300">Privacy Policy</Link>
                <Link to="#" className="hover:text-primary-300 transition-colors duration-300">Terms of Service</Link>
                <span>Attorney Advertising</span>
              </div>
            </div>
            
            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="group flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <ArrowUp className="h-4 w-4 group-hover:animate-bounce-subtle" />
              <span className="text-sm font-medium">Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;