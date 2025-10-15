import React from 'react';
import { Mail, Linkedin, Award, Users, Star, TrendingUp, Globe, MapPin, Calendar, Briefcase } from 'lucide-react';

const Team = () => {
  const attorneys = [
    {
      name: 'Angela M. Malando',
      title: 'Managing Partner',
      image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
      specialties: ['Patent Law', 'Technology Licensing', 'IP Strategy'],
      education: ['Masters in IP', 'Post-Graduate Diploma in Legal Practice', 'LLB'],
      experience: '10+ years',
      email: 'angela@abaip.co.tz',
      bio: 'Angela founded ABA IP with a vision to provide exceptional IP counsel to innovators worldwide. She has secured over 50 patents and has been recognized as a leading IP attorney by multiple publications.'
    }
    // ,
    // {
    //   name: 'Michael Rodriguez',
    //   title: 'Senior Partner',
    //   image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg',
    //   specialties: ['Trademark Law', 'Brand Protection', 'IP Litigation'],
    //   education: ['J.D., Harvard Law School', 'B.A., Business Administration, UC Berkeley'],
    //   experience: '20+ years',
    //   email: 'michael.rodriguez@aba-ip.com',
    //   bio: 'Michael leads our trademark and brand protection practice. He has successfully represented clients in complex trademark disputes and has extensive experience in international trademark law.'
    // },
    // {
    //   name: 'Dr. Emily Watson',
    //   title: 'Patent Attorney',
    //   image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg',
    //   specialties: ['Biotechnology Patents', 'Life Sciences', 'Patent Prosecution'],
    //   education: ['J.D., Yale Law School', 'Ph.D., Molecular Biology, UCSF'],
    //   experience: '15+ years',
    //   email: 'emily.watson@aba-ip.com',
    //   bio: 'Emily specializes in biotechnology and life sciences patents. Her scientific background enables her to understand complex technologies and craft strong patent applications.'
    // },
    // {
    //   name: 'James Park',
    //   title: 'Partner',
    //   image: 'https://images.pexels.com/photos/5668837/pexels-photo-5668837.jpeg',
    //   specialties: ['Copyright Law', 'Entertainment IP', 'Software Protection'],
    //   education: ['J.D., NYU School of Law', 'B.S., Computer Science, Carnegie Mellon'],
    //   experience: '12+ years',
    //   email: 'james.park@aba-ip.com',
    //   bio: 'James focuses on copyright law and entertainment IP. He has extensive experience protecting software, digital content, and creative works for both startups and established companies.'
    // },
    // {
    //   name: 'Lisa Thompson',
    //   title: 'Associate',
    //   image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg',
    //   specialties: ['Trade Secrets', 'IP Due Diligence', 'Contract Law'],
    //   education: ['J.D., Georgetown Law', 'B.A., Economics, Princeton'],
    //   experience: '8+ years',
    //   email: 'lisa.thompson@aba-ip.com',
    //   bio: 'Lisa specializes in trade secret protection and IP due diligence. She regularly advises clients on protecting confidential information and conducting IP audits.'
    // },
    // {
    //   name: 'David Kim',
    //   title: 'Associate',
    //   image: 'https://images.pexels.com/photos/5668837/pexels-photo-5668837.jpeg',
    //   specialties: ['Patent Analytics', 'IP Strategy', 'Technology Transfer'],
    //   education: ['J.D., Columbia Law School', 'M.S., Mechanical Engineering, Stanford'],
    //   experience: '6+ years',
    //   email: 'david.kim@aba-ip.com',
    //   bio: 'David combines legal expertise with technical knowledge to provide strategic IP counsel. He specializes in patent analytics and helping clients maximize the value of their IP portfolios.'
    // }
  ];

  const teamStats = [
    // { number: '15+', label: 'Legal Professionals', icon: Users },
    // { number: '10+', label: 'Years Combined Experience', icon: TrendingUp },
    // { number: '15+', label: 'Awards & Recognition', icon: Award },
    // { number: '30+', label: 'Countries Served Africa', icon: Globe },
  ];

  const offices = [
    {
      city: 'Silicon Valley',
      address: '123 Innovation Drive\nSilicon Valley, CA 94025',
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg',
      team: '12 Attorneys'
    },
    // {
    //   city: 'New York',
    //   address: '456 Wall Street\nNew York, NY 10005',
    //   image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg',
    //   team: '8 Attorneys'
    // },
    // {
    //   city: 'London',
    //   address: '789 Canary Wharf\nLondon, UK E14 5AB',
    //   image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
    //   team: '5 Attorneys'
    // }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section - Circular Layout */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white overflow-hidden">
        {/* Circular Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-white/5 rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-6">
              <Users className="h-4 w-4 text-white mr-2" />
              <span className="text-white text-sm font-medium">Expert Legal Team</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              Meet Our
              <span className="block text-accent-200">
                Team
              </span>
            </h1>
            
            <p className="text-xl mb-16 text-white/90 leading-relaxed max-w-3xl mx-auto">
              Meet the experienced attorneys and professionals who make up our 
              world-class intellectual property practice.
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {teamStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
                >
                  <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <Award className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Legal Experts</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Meet Our Attorneys
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Our team combines decades of experience with cutting-edge legal expertise 
              to deliver exceptional results for our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {attorneys.map((attorney, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 border border-neutral-100 overflow-hidden transform hover:scale-105"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 relative overflow-hidden">
                    <img
                      src={attorney.image}
                      alt={attorney.name}
                      className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-300">
                          {attorney.name}
                        </h3>
                        <p className="text-primary-600 font-semibold">{attorney.title}</p>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={`mailto:${attorney.email}`}
                          className="group/icon p-2 bg-neutral-100 rounded-lg hover:bg-primary-600 transition-colors duration-300"
                        >
                          <Mail className="h-4 w-4 text-neutral-600 group-hover/icon:text-white transition-colors duration-300" />
                        </a>
                        <a
                          href="#"
                          className="group/icon p-2 bg-neutral-100 rounded-lg hover:bg-primary-600 transition-colors duration-300"
                        >
                          <Linkedin className="h-4 w-4 text-neutral-600 group-hover/icon:text-white transition-colors duration-300" />
                        </a>
                      </div>
                    </div>

                    <p className="text-neutral-600 mb-6 leading-relaxed">{attorney.bio}</p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {attorney.specialties.map((specialty, idx) => (
                            <span
                              key={idx}
                              className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors duration-200"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-2">Education</h4>
                        <ul className="text-neutral-600 text-sm space-y-1">
                          {attorney.education.map((edu, idx) => (
                            <li key={idx} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                              {edu}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-1">Experience</h4>
                        <p className="text-neutral-600 text-sm font-medium">{attorney.experience}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      {/* <section className="py-24 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Global Presence</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">Our Offices</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Strategically located offices to serve clients worldwide with local expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden transform hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 200}ms` }}
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
                      {office.team}
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
      </section> */}

      {/* Support Staff */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Support Excellence</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">Our Team</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Our team has experienced staff ensures efficient case management and 
              exceptional client service at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                role: 'Patent Paralegals',
                count: '6',
                description: 'Specialized paralegals with extensive experience in patent prosecution and portfolio management.',
                color: 'from-primary-500 to-primary-600',
                image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg'
              },
              {
                role: 'Trademark Specialists',
                count: '4',
                description: 'Dedicated trademark specialists handling searches, applications, and maintenance worldwide.',
                color: 'from-accent-500 to-accent-600',
                image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg'
              },
              {
                role: 'Client Relations',
                count: '3',
                description: 'Client service professionals ensuring seamless communication and project coordination.',
                color: 'from-primary-600 to-primary-700',
                image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg'
              }
            ].map((team, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105 animate-scale-in overflow-hidden"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={team.image}
                    alt={team.role}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{team.count}</span>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                    {team.role}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">{team.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-scale-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Join Our Team</h2>
            <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              We're always looking for talented attorneys and professionals to join our 
              growing practice. Explore career opportunities with ABA IP and be part of 
              something extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/contact"
                className="group bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-100 transition-all duration-300 transform hover:scale-105 shadow-large"
              >
                View Opportunities
              </a>
              <a
                href="mailto:info@abaio.co.tz"
                className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-700 transition-all duration-300"
              >
                Send Your Resume
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;