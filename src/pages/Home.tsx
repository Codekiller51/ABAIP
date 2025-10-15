import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Users, CheckCircle, ArrowRight, Star, TrendingUp, Globe, Clock, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import ScrollAnimatedSection from '../components/ScrollAnimatedSection';
import { useStaggeredAnimation, useCountAnimation } from '../hooks/useScrollAnimation';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedBenefit, setExpandedBenefit] = useState<number | null>(null);

  // Staggered animations for stats
  const { containerRef: statsRef, visibleItems: statsVisible } = useStaggeredAnimation(4, 150);
  
  // Staggered animations for services
  const { containerRef: servicesRef, visibleItems: servicesVisible } = useStaggeredAnimation(3, 200);
  
  // Staggered animations for testimonials
  const { containerRef: testimonialsRef, visibleItems: testimonialsVisible } = useStaggeredAnimation(3, 150);

  // Count animations for stats
  const { elementRef: stat1Ref, count: count1 } = useCountAnimation(100, 2000);
  const { elementRef: stat2Ref, count: count2 } = useCountAnimation(10, 2000);
  const { elementRef: stat3Ref, count: count3 } = useCountAnimation(98, 2000);
  const { elementRef: stat4Ref, count: count4 } = useCountAnimation(100, 2000);

  const slides = [
    {
      title: "Tanzania's Premier Intellectual Property Experts",
      subtitle: "Expert IP Legal Services",
      description: "Comprehensive patent, trademark, and copyright protection for businesses and inventors worldwide.",
      image: "https://images.pexels.com/photos/5668837/pexels-photo-5668837.jpeg",
      cta: "Get Free Consultation",
      ctaLink: "/contact"
    },
    {
      title: "Patent Excellence",
      subtitle: "50+ Patents Filled",
      description: "Our experienced team has successfully secured patents across diverse industries and technologies.",
      image: "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg",
      cta: "View Our Services",
      ctaLink: "/services"
    },
    {
      title: "Global IP Protection",
      subtitle: "Worldwide Coverage",
      description: "International patent and trademark filing capabilities with local expertise.",
      image: "https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg",
      cta: "Learn More",
      ctaLink: "/about"
    },
    {
      title: "Expert Legal Team",
      subtitle: "7+ Years Experience",
      description: "Award-winning attorneys with deep technical expertise and proven track record of success.",
      image: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg",
      cta: "Meet Our Team",
      ctaLink: "/team"
    }
  ];

  const benefits = [
    {
      title: 'Experienced Professionals',
      description: 'Leveraging over a decade of specialized intellectual property experience, our team delivers strategic insights and robust solutions to proactively safeguard your intellectual assets and maximize their commercial value.'
    },
    {
      title: 'Proven track record with 98% success rate',
      description: 'We have successfully secured over 50 patents, registered hundreds of trademarks, and won numerous IP litigation cases. Our high success rate is built on thorough preparation, strategic thinking, and deep understanding of IP law. We measure success not just by approvals, but by the long-term value we create for our clients.'
    },
    {
      title: 'Comprehensive IP portfolio management',
      description: 'Beyond filing applications, we provide ongoing portfolio management services including maintenance, renewal tracking, competitive monitoring, and strategic guidance. We help you build and maintain a robust IP portfolio that supports your business objectives and provides maximum protection for your innovations.'
    },
    {
      title: 'Strategic counsel tailored to your business',
      description: 'We don\'t believe in one-size-fits-all solutions. Our approach involves understanding your business model, competitive landscape, and growth plans to develop customized IP strategies. Whether you\'re a startup or Fortune 20 company, we align our services with your specific needs and budget.'
    },
    {
      title: 'Global patent and trademark filing capabilities',
      description: 'With offices in key jurisdictions and partnerships worldwide, we can protect your IP in over 50 countries. We handle PCT applications, Madrid Protocol filings, and direct national phase entries. Our global network ensures consistent quality and coordinated strategies across all jurisdictions.'
    },
    {
      title: 'Responsive client service and communication',
      description: 'We pride ourselves on clear, timely communication. You\'ll have direct access to your attorney, regular status updates, and transparent billing. Our client portal provides 24/7 access to your case information, and we respond to inquiries within hours, not days.'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleBenefit = (index: number) => {
    setExpandedBenefit(expandedBenefit === index ? null : index);
  };

  const services = [
    {
      title: 'Patent Protection',
      description: 'Comprehensive patent prosecution and portfolio management for your innovations.',
      icon: Shield,
      features: ['Utility Patents', 'Design Patents', 'International Filing'],
      color: 'from-primary-500 to-primary-600',
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg'
    },
    {
      title: 'Trademark Services',
      description: 'Brand protection through strategic trademark registration and enforcement.',
      icon: Award,
      features: ['Brand Registration', 'Global Protection', 'Enforcement'],
      color: 'from-accent-500 to-accent-600',
      image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg'
    },
    {
      title: 'Copyright Law',
      description: 'Creative work protection and licensing for authors, artists, and businesses.',
      icon: Users,
      features: ['Creative Protection', 'Licensing', 'Enforcement'],
      color: 'from-primary-600 to-primary-700',
      image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg'
    },
  ];

  const stats = [
    { number: '50+', label: 'Patents Filled', icon: TrendingUp, count: count1, ref: stat1Ref },
    { number: '7+', label: 'Years Experience', icon: Clock, count: count2, ref: stat2Ref },
    { number: '98%', label: 'Success Rate', icon: Star, count: count3, ref: stat3Ref },
    { number: '200+', label: 'Happy Clients', icon: Globe, count: count4, ref: stat4Ref },
  ];

  const testimonials = [
    {
      quote: "Their trademark expertise saved our brand from a costly dispute. Exceptional service and results.",
      author: "Joseph Mshana",
      title: "Founder, Kilimanjaro Tech Solutions",
      rating: 5,
      image: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg"
    },
    {
      quote: "ABA IP helped us secure crucial patents that became the foundation of our $50M funding round.",
      author: "Wilson Aldfred",
      title: "Entrepreneur, Dar es Salaam",
      rating: 5,
      image: "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg"
    },
    {
      quote: "Professional, responsive, and incredibly knowledgeable. They're our go-to IP firm.",
      author: "James Juma",
      title: "Managing Director, Swahili Fashion Hub",
      rating: 5,
      image: "https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg"
    }
  ];

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Slideshow Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-neutral-900/60 to-neutral-900/40"></div>
              
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-3xl">
                    <div className={`inline-flex items-center bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-2 mb-6 transition-all duration-700 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`} style={{ transitionDelay: index === currentSlide ? '200ms' : '0ms' }}>
                      <Star className="h-4 w-4 text-primary-400 mr-2" />
                      <span className="text-primary-300 text-sm font-medium">{slide.subtitle}</span>
                    </div>
                    
                    <h1 className={`text-5xl lg:text-7xl font-bold mb-8 leading-tight text-white transition-all duration-700 ${
                      index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                    }`} style={{ transitionDelay: index === currentSlide ? '400ms' : '0ms' }}>
                      {slide.title.split(' ').map((word, idx) => (
                        <span key={idx} className={idx === slide.title.split(' ').length - 1 ? 
                          "block bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent" : ""
                        }>
                          {word}{idx < slide.title.split(' ').length - 1 ? ' ' : ''}
                        </span>
                      ))}
                    </h1>
                    
                    <p className={`text-xl mb-10 text-neutral-300 leading-relaxed max-w-2xl transition-all duration-700 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`} style={{ transitionDelay: index === currentSlide ? '600ms' : '0ms' }}>
                      {slide.description}
                    </p>
                    
                    <Link
                      to={slide.ctaLink}
                      className={`group relative bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-700 hover:shadow-orange transform hover:scale-105 inline-flex items-center ${
                        index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                      style={{ transitionDelay: index === currentSlide ? '800ms' : '0ms' }}
                    >
                      <span className="relative z-10 flex items-center">
                        {slide.cta}
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows - Hidden on Mobile */}
        <button
          onClick={prevSlide}
          className="hidden md:block absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="hidden md:block absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-primary-500 scale-125' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center group transition-all duration-700 ${
                  statsVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 transform group-hover:scale-105">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div ref={stat.ref} className="text-3xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {index === 0 ? `${stat.count}+` : index === 1 ? `${stat.count}+` : index === 2 ? `${stat.count}%` : `${stat.count}+`}
                  </div>
                  <div className="text-neutral-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimatedSection animation="fade-up" className="text-center mb-20">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Our Core Services</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Comprehensive IP Protection
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              At ABA IP, we specialize in providing expert protection for your intellectual property assets 
              across Africa. With over 7 years of experience, our team offers a comprehensive suite of services 
              tailored to your unique needs, ensuring your intellectual property is safeguarded and your business thrives
            </p>
          </ScrollAnimatedSection>

          <div ref={servicesRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-700 border border-neutral-100 overflow-hidden transform hover:scale-105 ${
                  servicesVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-neutral-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-neutral-700">
                        <CheckCircle className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    to="/services"
                    className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 group-hover:translate-x-1 transition-all duration-300"
                  >
                    Learn More 
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <ScrollAnimatedSection animation="fade-up" className="text-center">
            <Link
              to="/services"
              className="inline-flex items-center bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-orange transition-all duration-300 transform hover:scale-105"
            >
              View All Services
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </ScrollAnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about our services.
            </p>
          </ScrollAnimatedSection>

          <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-700 transform hover:scale-105 ${
                  testimonialsVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="flex items-center mb-6">
                  {/* <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  /> */}
                  <div>
                    <div className="font-semibold text-neutral-900">{testimonial.author}</div>
                    <div className="text-sm text-neutral-600">{testimonial.title}</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-primary-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-neutral-700 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollAnimatedSection animation="slide-right">
              <h2 className="text-4xl lg:text-5xl font-bold mb-8">
                Why Choose 
                <span className="block bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  ABA IP?
                </span>
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="group border border-neutral-700 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleBenefit(index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-800/50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary-500 p-2 rounded-lg group-hover:bg-primary-400 transition-colors duration-300">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-neutral-300 group-hover:text-white transition-colors duration-300 font-medium">
                          {benefit.title}
                        </span>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-neutral-400 transition-transform duration-300 ${
                        expandedBenefit === index ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ${
                      expandedBenefit === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="px-6 pb-6">
                        <p className="text-neutral-400 leading-relaxed pl-12">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollAnimatedSection>
            
            <ScrollAnimatedSection animation="slide-left">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg"
                  alt="Legal team"
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </ScrollAnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">Our Associations & Memberships</h2>
          <p className="text-xl text-gray-600 mb-12">We are proud to be associated with leading legal and intellectual property organizations.</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-20">
            <img src="EALS.png" alt="Association Logo 1" className="h-27 object-contain" />
            <img src="TWLS.png" alt="Association Logo 2" className="h-27 object-contain" />
            <img src="TLS.png" alt="Association Logo 3" className="h-27 object-contain" />
            <img src="aripo.png" alt="Association Logo 3" className="h-20 object-contain" />
            <img src="wipo.png" alt="Association Logo 3" className="h-20 object-contain" />

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollAnimatedSection animation="scale-in">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Protect Your IP?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Schedule a consultation with our experienced IP attorneys to discuss 
              your protection strategy and take the first step toward securing your innovations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="group bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-100 transition-all duration-300 transform hover:scale-105 shadow-large"
              >
                <span className="flex items-center justify-center">
                  Schedule Free Consultation
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
              <Link
                to="/services"
                className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-700 transition-all duration-300"
              >
                Explore Our Services
              </Link>
            </div>
          </ScrollAnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;