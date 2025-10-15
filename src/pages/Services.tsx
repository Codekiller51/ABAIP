import React from 'react';
import { Shield, Award, FileText, Lock, Scale, Briefcase, CheckCircle, ArrowRight, Star, Zap, Users, Target } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Shield,
      title: 'Patent Services',
      description: 'Comprehensive patent prosecution, portfolio management, and strategic IP development.',
      features: [
        'Utility Patent Applications',
        'Design Patent Protection',
        'Provisional Patent Filing',
        'Patent Portfolio Management',
        'Prior Art Searches',
        'Freedom to Operate Analysis'
      ],
      color: 'from-primary-500 to-primary-600',
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg'
    },
    {
      icon: Award,
      title: 'Trademark Services',
      description: 'Brand protection through strategic trademark registration and enforcement worldwide.',
      features: [
        'Trademark Search & Clearance',
        'Federal Trademark Registration',
        'International Trademark Filing',
        'Trademark Portfolio Management',
        'Brand Protection Strategy',
        'Trademark Enforcement'
      ],
      color: 'from-accent-500 to-accent-600',
      image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg'
    },
    {
      icon: FileText,
      title: 'Copyright Services',
      description: 'Protection for creative works including software, content, and artistic expressions.',
      features: [
        'Copyright Registration',
        'Software Copyright Protection',
        'DMCA Compliance',
        'Copyright Licensing',
        'Infringement Defense',
        'Work for Hire Agreements'
      ],
      color: 'from-primary-600 to-primary-700',
      image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg'
    },
    {
      icon: Lock,
      title: 'Trade Secrets',
      description: 'Confidential information protection and trade secret compliance programs.',
      features: [
        'Trade Secret Audits',
        'Protection Protocols',
        'Employee Training',
        'Non-Disclosure Agreements',
        'Misappropriation Defense',
        'Compliance Programs'
      ],
      color: 'from-accent-600 to-accent-700',
      image: 'https://images.pexels.com/photos/5668837/pexels-photo-5668837.jpeg'
    },
    {
      icon: Scale,
      title: 'IP Litigation',
      description: 'Aggressive representation in intellectual property disputes and enforcement actions.',
      features: [
        'Patent Infringement Litigation',
        'Trademark Disputes',
        'Copyright Enforcement',
        'Trade Secret Litigation',
        'IP Due Diligence',
        'Settlement Negotiations'
      ],
      color: 'from-primary-700 to-primary-800',
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg'
    },
    {
      icon: Briefcase,
      title: 'Licensing & Transactions',
      description: 'Strategic IP monetization through licensing agreements and technology transfers.',
      features: [
        'License Agreement Drafting',
        'Technology Transfer',
        'IP Valuation',
        'Due Diligence',
        'M&A IP Support',
        'Joint Venture Agreements'
      ],
      color: 'from-accent-700 to-accent-800',
      image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg'
    }
  ];

  const industries = [
    { name: 'Technology', image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg' },
    // { name: 'Biotechnology', image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg' },
    { name: 'Manufacturing', image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg' },
    { name: 'Entertainment', image: 'https://images.pexels.com/photos/5668837/pexels-photo-5668837.jpeg' },
    // { name: 'Healthcare', image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg' },
    // { name: 'Automotive', image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg' },
    // { name: 'Aerospace', image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg' },
    { name: 'Consumer Goods', image: 'https://images.pexels.com/photos/5668837/pexels-photo-5668837.jpeg' }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Consultation',
      description: 'Initial assessment of your IP needs and strategic objectives.',
      icon: Star
    },
    {
      step: '02',
      title: 'Strategy',
      description: 'Development of comprehensive IP protection and commercialization strategy.',
      icon: Zap
    },
    {
      step: '03',
      title: 'Implementation',
      description: 'Filing applications and executing protection measures across jurisdictions.',
      icon: Shield
    },
    {
      step: '04',
      title: 'Management',
      description: 'Ongoing portfolio management and strategic guidance for maximum value.',
      icon: Award
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section - Diagonal Split Layout */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 transform skew-y-6 origin-top-left scale-110"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
            <div className="text-white animate-slide-in-left">
              <div className="inline-flex items-center bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-6">
                <Shield className="h-4 w-4 text-white mr-2" />
                <span className="text-white text-sm font-medium">Comprehensive IP Solutions</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                Our
                <span className="block text-accent-200">
                  Services
                </span>
              </h1>
              
              <p className="text-xl mb-10 text-white/90 leading-relaxed max-w-lg">
                Comprehensive intellectual property services designed to protect, enforce, 
                and monetize your most valuable assets across all industries.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: '6', label: 'Core Services', icon: Target },
                  { number: '100+', label: 'Cases Won', icon: Award },
                  { number: '7+', label: 'Years Experience', icon: Users },
                  { number: '98%', label: 'Success Rate', icon: Star },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{stat.number}</div>
                        <div className="text-sm text-white/80">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/5668837/pexels-photo-5668837.jpeg"
                  alt="Legal services"
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                
                {/* Floating Service Badge */}
                <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-large animate-float">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">Full</div>
                    <div className="text-sm text-neutral-600">Service IP Firm</div>
                    <div className="flex justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-primary-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Our Expertise</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Complete IP Protection
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              From patents to trademarks, we provide end-to-end intellectual property services 
              tailored to your business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 border border-neutral-100 overflow-hidden transform hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors duration-300">
                      {service.title}
                    </h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-neutral-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center group/item">
                        <CheckCircle className="h-4 w-4 text-primary-500 mr-3 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200" />
                        <span className="text-neutral-700 group-hover/item:text-neutral-900 transition-colors duration-200">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-neutral-100">
                    <button className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 group-hover:translate-x-1 transition-all duration-300">
                      Learn More 
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <Briefcase className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Industry Expertise</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">Industries We Serve</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Our expertise spans across diverse industries, providing specialized IP solutions 
              tailored to your sector's unique challenges.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105 animate-scale-in overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={industry.image}
                    alt={industry.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-300">
                    {industry.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Our Methodology</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">Our Process</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              A systematic approach to intellectual property protection that ensures 
              comprehensive coverage and strategic value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((process, index) => (
              <div
                key={index}
                className="group text-center animate-scale-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative mb-6">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <process.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-accent-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {process.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                  {process.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-scale-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Protect Your Innovation?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Contact us today to discuss your intellectual property needs and develop 
              a customized protection strategy that drives your business forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/contact"
                className="group bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-100 transition-all duration-300 transform hover:scale-105 shadow-large"
              >
                <span className="flex items-center justify-center">
                  Schedule Consultation
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </a>
              <a
                href="/resources"
                className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-700 transition-all duration-300"
              >
                View Resources
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;