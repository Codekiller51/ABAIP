import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scale, Phone, Mail, ArrowRight } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'The Firm', href: '/about' },
    { name: 'Services', href: '/services' },
    // { name: 'Our People', href: '/team' },
    { name: 'Resources', href: '/resources' },
    { name: 'Connect', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menuButton = document.querySelector('.mobile-menu-button');
      const menuPanel = document.querySelector('.mobile-menu-panel');
      
      if (
        isMenuOpen &&
        !menuButton?.contains(event.target as Node) &&
        !menuPanel?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-neutral-900 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span>+255 713 447 706</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span>info@abaip.co.tz</span>
              </div>
            </div>
            <div className="text-neutral-300">
              Consultation Available 24/7
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-medium' 
          : 'bg-white shadow-soft'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            
            <Link to="/" className="flex items-center space-x-3 group z-50 relative">
              <div className="relative">
                <img src="logot.png" alt="ABA IP Consultants Logo" className="h-16" />
                {/* <Scale className="h-10 w-10 text-primary-600 group-hover:text-primary-700 transition-colors duration-300" /> */}
                <div className="absolute inset-0 bg-primary-600 opacity-20 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-300">
                  {/* ABA IP */}
                </span>
                <div className="text-xs text-neutral-600 font-medium tracking-wide">
                  {/* Consultants */}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {item.name}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary-600 transition-all duration-300 ${
                    isActive(item.href) ? 'w-6' : 'w-0 group-hover:w-6'
                  }`}></div>
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link
                to="/contact"
                className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold overflow-hidden group transition-all duration-300 hover:shadow-orange transform hover:scale-105"
              >
                <span className="relative z-10">Free Consultation</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden relative p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200 z-50 mobile-menu-button"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <div className="relative w-6 h-6">
                <Menu className={`absolute inset-0 h-6 w-6 text-neutral-700 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                }`} />
                <X className={`absolute inset-0 h-6 w-6 text-neutral-700 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                }`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div className={`lg:hidden fixed inset-0 z-30 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 mobile-menu-panel ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Menu Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white pt-20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Navigation</h3>
                <p className="text-primary-100 text-sm">Explore our services</p>
              </div>
            </div>
          </div>

          {/* Menu Content */}
          <div className="p-6 h-full overflow-y-auto">
            {/* Navigation Links - FIRST */}
            <nav className="space-y-2 mb-8">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center justify-between p-4 rounded-xl font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                      : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: isMenuOpen ? 'slideInRight 0.3s ease-out forwards' : 'none'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.name}</span>
                  <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${
                    isActive(item.href) ? 'text-primary-600' : 'text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* CTA Button - SECOND */}
            <Link
              to="/contact"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 rounded-xl font-semibold text-center hover:from-primary-700 hover:to-primary-800 transition-all duration-300 flex items-center justify-center space-x-2 group mb-8"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Free Consultation</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            {/* Contact Info - THIRD */}
            <div className="mb-8 p-4 bg-neutral-50 rounded-xl">
              <h4 className="font-semibold text-neutral-900 mb-3">Quick Contact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-neutral-600">
                  <Phone className="h-4 w-4 text-primary-600" />
                  <span>+255 713 447 706</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-600">
                  <Mail className="h-4 w-4 text-primary-600" />
                  <span>info@abaip.co.tz</span>
                </div>
              </div>
            </div>

            {/* Emergency Notice - FOURTH */}
            <div className="p-4 bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl border border-primary-200">
              <h4 className="font-semibold text-accent-700 mb-1">24/7 Emergency</h4>
              <p className="text-sm text-neutral-600 mb-2">Urgent IP matters? We're here to help.</p>
              <a 
                href="tel:+18005550123"
                className="text-accent-600 hover:text-accent-700 font-medium text-sm"
              >
                (800) 555-0123
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;