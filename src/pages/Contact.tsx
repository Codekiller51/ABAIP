import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Star, Shield, CheckCircle, MessageSquare, Calendar, Users, X } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Simulate form submission for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus({ 
        type: 'success', 
        message: 'Thank you for your message. We will contact you within 24 hours!' 
      });
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactStats = [
    { number: '24/7', label: 'Emergency Support', icon: Clock },
    { number: '<1hr', label: 'Response Time', icon: Send },
    { number: '98%', label: 'Client Satisfaction', icon: Star },
    { number: '100%', label: 'Confidential', icon: Shield },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      primary: '+255 713 447 706',
      secondary: 'Toll Free: +255 713 447 706',
      description: 'Speak directly with our legal team',
      color: 'from-primary-500 to-primary-600',
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg'
    },
    {
      icon: Mail,
      title: 'Email',
      primary: 'info@abaip.co.tz',
      secondary: 'angela@abaip.co.tz',
      description: 'Send us your questions anytime',
      color: 'from-accent-500 to-accent-600',
      image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      primary: 'Available 9 AM - 6 PM PST',
      secondary: 'Instant responses',
      description: 'Chat with our support team',
      color: 'from-primary-600 to-primary-700',
      image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg'
    }
  ];

  const offices = [
    {
      city: 'Dar-es-alaam',
      address: 'Tanzania \n .',
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg',
      hours: 'Mon-Fri: 8 AM - 6 PM PST'
    }
    // ,
    // {
    //   city: 'New York',
    //   address: '456 Wall Street\nNew York, NY 10005',
    //   image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg',
    //   hours: 'Mon-Fri: 9 AM - 7 PM EST'
    // },
    // {
    //   city: 'London',
    //   address: '789 Canary Wharf\nLondon, UK E14 5AB',
    //   image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
    //   hours: 'Mon-Fri: 9 AM - 5 PM GMT'
    // }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section - Vertical Split Layout */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
            <div className="text-white animate-slide-in-left">
              <div className="inline-flex items-center bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-6">
                <MessageSquare className="h-4 w-4 text-white mr-2" />
                <span className="text-white text-sm font-medium">Get In Touch</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                Contact
                <span className="block text-accent-200">
                  Us
                </span>
              </h1>
              
              <p className="text-xl mb-10 text-white/90 leading-relaxed max-w-lg">
                Ready to protect your intellectual property? Get in touch with our experienced 
                team for a free consultation and strategic guidance.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {contactStats.map((stat, index) => (
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
                  alt="Contact us"
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                
                {/* Floating Contact Badge */}
                <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-large animate-float">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">Free</div>
                    <div className="text-sm text-neutral-600">Consultation</div>
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

      {/* Contact Methods */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <Phone className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Multiple Ways to Connect</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">How to Reach Us</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Choose the communication method that works best for you. Our team is ready 
              to assist with your intellectual property needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 border border-neutral-100 overflow-hidden transform hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={method.image}
                    alt={method.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      <method.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {method.title}
                  </h3>
                  <p className="text-neutral-600 mb-4">{method.description}</p>
                  <div className="space-y-1">
                    <div className="font-semibold text-neutral-900">{method.primary}</div>
                    <div className="text-sm text-neutral-600">{method.secondary}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Office Info */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="animate-slide-in-left">
              <div className="bg-white rounded-2xl shadow-large p-8 border border-neutral-100">
                <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Free Consultation</span>
                </div>
                <h2 className="text-4xl font-bold text-neutral-900 mb-8">Schedule a Consultation</h2>
                
                {/* Status Messages */}
                {submitStatus.type && (
                  <div className={`mb-6 p-4 rounded-xl ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {submitStatus.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium">{submitStatus.message}</span>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-primary-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-primary-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-semibold text-neutral-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-primary-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-primary-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-primary-300"
                    >
                      <option value="">Select a service...</option>
                      <option value="patents">Patent Services</option>
                      <option value="trademarks">Trademark Services</option>
                      <option value="copyrights">Copyright Services</option>
                      <option value="trade-secrets">Trade Secrets</option>
                      <option value="litigation">IP Litigation</option>
                      <option value="licensing">Licensing & Transactions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your IP needs and any specific questions you have..."
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none hover:border-primary-300"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-orange transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className={`h-5 w-5 transition-transform duration-300 ${
                      isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-1'
                    }`} />
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>

                <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-primary-800 font-semibold mb-1">
                        Confidentiality Notice
                      </p>
                      <p className="text-sm text-primary-700">
                        All communications are strictly confidential and protected by attorney-client privilege.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Locations */}
            <div className="animate-slide-in-right">
              <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Office Locations</span>
              </div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-8">Visit Our Offices</h2>
              
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 relative overflow-hidden">
                        <img
                          src={office.image}
                          alt={office.city}
                          className="w-full h-32 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                          {office.city}
                        </h3>
                        <p className="text-neutral-600 whitespace-pre-line mb-2">{office.address}</p>
                        <p className="text-sm text-neutral-500">{office.hours}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <div className="bg-gradient-to-br from-neutral-100 to-primary-50 h-64 rounded-2xl flex items-center justify-center border border-neutral-200 hover:shadow-medium transition-shadow duration-300">
                  <div className="text-center text-neutral-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-primary-500" />
                    <p className="font-semibold text-neutral-700">Interactive Map</p>
                    <p className="text-sm">Find us worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-gradient-to-r from-accent-600 via-accent-700 to-primary-700 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-scale-in">
            <h2 className="text-4xl font-bold mb-6">Need Urgent Assistance?</h2>
            <p className="text-xl text-accent-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              For time-sensitive IP matters requiring immediate attention, our emergency hotline 
              is available 24/7 with experienced attorneys ready to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="tel:+255713447706"
                className="group bg-white text-accent-700 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-100 transition-all duration-300 transform hover:scale-105 shadow-large"
              >
                Emergency Hotline: +255 713 447 706
              </a>
              <a
                href="mailto:info@abaip.co.tz"
                className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-accent-700 transition-all duration-300"
              >
                Emergency Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;