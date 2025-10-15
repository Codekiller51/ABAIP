import React from 'react';
import { Award, Users, Globe, Target, Star, TrendingUp, Shield, CheckCircle, Building, Calendar, MapPin } from 'lucide-react';
import ScrollAnimatedSection from '../components/ScrollAnimatedSection';
import { useStaggeredAnimation } from '../hooks/useScrollAnimation';

const About = () => {
  const { containerRef: valuesRef, visibleItems: valuesVisible } = useStaggeredAnimation(4, 200);
  const { containerRef: timelineRef, visibleItems: timelineVisible } = useStaggeredAnimation(4, 300);
  const { containerRef: officesRef, visibleItems: officesVisible } = useStaggeredAnimation(3, 150);
  const { containerRef: recognitionRef, visibleItems: recognitionVisible } = useStaggeredAnimation(3, 200);

  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in legal practice and client service.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Users,
      title: 'Client-Focused',
      description: 'Your success is our priority. We tailor our approach to your unique needs.',
      color: 'from-accent-500 to-accent-600'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'International capabilities with local expertise in IP protection worldwide.',
      color: 'from-primary-600 to-primary-700'
    },
    {
      icon: Target,
      title: 'Strategic',
      description: 'We develop comprehensive IP strategies aligned with your business goals.',
      color: 'from-accent-600 to-accent-700'
    }
  ];

  const achievements = [
    { number: '7+', label: 'Years of Excellence', icon: TrendingUp },
    { number: '50+', label: 'Patents Secured', icon: Shield },
    { number: '98%', label: 'Success Rate', icon: Star },
    { number: '100+', label: 'Happy Clients', icon: Globe },
  ];

  const timeline = [
    {
      year: '2015',
      title: 'Foundation',
      description: 'ABA IP founded with a vision to provide exceptional IP counsel.',
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg'
    },
    {
      year: '2018',
      title: 'Expansion',
      description: 'Opened international offices and expanded service offerings.',
      image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg'
    },
    {
      year: '2020',
      title: 'Recognition',
      description: 'Recognized as top IP firm by leading legal publications.',
      image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg'
    },
    {
      year: '2023 to Present',
      title: 'Innovation',
      description: 'Leading the industry with AI-powered IP analytics and strategy.',
      image: 'https://images.pexels.com/photos/5668837/pexels-photo-5668837.jpeg'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section - Split Layout */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
            {/* Left Content */}
            <div className="flex items-center px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
              <div className="w-full">
                <ScrollAnimatedSection animation="slide-right">
                  <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
                    <Building className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Established 2015</span>
                  </div>
                  
                  <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                    Our
                    <span className="block text-primary-600">
                      Legacy
                    </span>
                    <span className="block text-2xl lg:text-3xl font-normal text-neutral-600 mt-4">
                      7 Years of IP Excellence
                    </span>
                  </h1>
                  
                  <p className="text-xl mb-10 text-neutral-600 leading-relaxed">
                    A premier intellectual property law firm dedicated to protecting innovations 
                    and creative works for businesses and inventors worldwide since 2015.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-primary-50 to-accent-50 p-6 rounded-2xl border border-primary-100 hover:shadow-medium transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary-500 p-2 rounded-lg">
                            <achievement.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-neutral-900">{achievement.number}</div>
                            <div className="text-sm text-neutral-600">{achievement.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollAnimatedSection>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative lg:min-h-screen">
              <ScrollAnimatedSection animation="slide-left">
                <img
                  src="https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg"
                  alt="Law firm office"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Floating Achievement Badge */}
                <div className="absolute top-8 right-8 bg-white p-6 rounded-2xl shadow-large animate-float">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">Best</div>
                    <div className="text-sm text-neutral-600">Law Firm 2024</div>
                    <div className="flex justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-primary-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollAnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      

      {/* Our Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimatedSection animation="fade-up" className="text-center mb-20">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <Target className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Our Foundation</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">Our Values</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              The principles that guide our practice and define our commitment to clients.
            </p>
          </ScrollAnimatedSection>

          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-2xl shadow-soft hover:shadow-large transition-all duration-700 border border-neutral-100 text-center transform hover:scale-105 ${
                  valuesVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className={`bg-gradient-to-r ${value.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimatedSection animation="fade-up" className="text-center mb-20">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Leadership Team</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">Leadership</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Our leadership team brings decades of experience in intellectual property law 
              and business strategy.
            </p>
          </ScrollAnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimatedSection animation="slide-right">
              <div className="relative">
                <img
                  src="/angel.jpg"
                  alt="Managing Partner"
                  className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
              </div>
            </ScrollAnimatedSection>
            <ScrollAnimatedSection animation="slide-left">
              <h3 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
                Angela M. Malando
              </h3>
              <div className="space-y-6 text-lg text-neutral-600 leading-relaxed">
                <p>
                  Experienced legal professional with a robust background in intellectual property management, corporate liability, and environmental laws.
                </p>
                <p>
                  Demonstrates expertise in legal research, drafting, and analysis, with a strong focus on ,international law, alternative dispute resolution.
                </p>
              </div>
              
              <div className="mt-8 space-y-4">
                {[
                  // { label: 'Education', value: 'Masters Degree' },
                  { label: 'Specialties', value: 'Patent Law, Intellectual Property' },
                  // { label: 'Bar Admissions', value: 'CA, NY, USPTO' },
                ].map((detail, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    <span className="text-neutral-700">
                      <strong className="text-neutral-900">{detail.label}:</strong> {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollAnimatedSection>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimatedSection animation="fade-up" className="text-center mb-20">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Global Presence</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">Our Offices</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Strategically located offices to serve clients worldwide with local expertise.
            </p>
          </ScrollAnimatedSection>

          <div ref={officesRef} className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {[
              {
                city: 'Dar-es-salaam',
                address: 'Tanzania',
                image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg',
                type: 'Headquarters'
              }
              // ,
              // {
              //   city: 'New York',
              //   address: '456 Wall Street\nNew York, NY 10005',
              //   image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg',
              //   type: 'East Coast Office'
              // },
              // {
              //   city: 'London',
              //   address: '789 Canary Wharf\nLondon, UK E14 5AB',
              //   image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
              //   type: 'European Office'
              // }
            ].map((office, index) => (
              <div
                key={index}
                className={`group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-700 overflow-hidden transform hover:scale-105 ${
                  officesVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={office.image}
                    alt={office.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {office.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {office.city}
                  </h3>
                  <p className="text-neutral-600 whitespace-pre-line">{office.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Recognition & Awards</h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Our commitment to excellence has been recognized by leading legal publications 
              and industry organizations.
            </p>
          </ScrollAnimatedSection>

          <div ref={recognitionRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { award: 'Law Firms 2025', organization: 'Tanzania' },
              { award: 'Top IP Firm', organization: 'Chambers & Partners' },
              { award: 'Rising Star Firm', organization: 'Legal 500' },
            ].map((recognition, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center hover:bg-white/20 transition-all duration-700 transform hover:scale-105 ${
                  recognitionVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="text-white font-bold text-lg mb-2">{recognition.award}</div>
                <div className="text-primary-100">{recognition.organization}</div>
              </div>
            ))}
          </div>
        </div> */}
      </section>
    </div>
  );
};

export default About;