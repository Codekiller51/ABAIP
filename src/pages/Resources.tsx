import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Download, BookOpen, FileText, Star, TrendingUp, Zap, Play, Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Resources = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      const formattedArticles = (data || []).map(insight => ({
        title: insight.title,
        excerpt: insight.summary,
        author: insight.author,
        date: new Date(insight.published_at || insight.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        category: insight.categories?.[0] || 'Insight',
        readTime: `${Math.ceil(insight.content.length / 1000)} min read`,
        featured: insight.featured,
        image: insight.image_url || 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg',
        id: insight.slug,
      }));

      setArticles(formattedArticles);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const resources = [
    {
      title: 'Patent Application Checklist',
      description: 'Comprehensive checklist to ensure your patent application is complete and well-prepared.',
      type: 'PDF',
      icon: FileText,
      color: 'from-primary-500 to-primary-600',
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg'
    },
    {
      title: 'Trademark Search Guide',
      description: 'Step-by-step guide to conducting preliminary trademark searches.',
      type: 'PDF',
      icon: BookOpen,
      color: 'from-accent-500 to-accent-600',
      image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg'
    },
    {
      title: 'IP Due Diligence Checklist',
      description: 'Essential checklist for evaluating intellectual property in M&A transactions.',
      type: 'PDF',
      icon: FileText,
      color: 'from-primary-600 to-primary-700',
      image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg'
    },
    {
      title: 'Trade Secret Audit Template',
      description: 'Template for conducting comprehensive trade secret audits in your organization.',
      type: 'PDF',
      icon: BookOpen,
      color: 'from-accent-600 to-accent-700',
      image: 'https://images.pexels.com/photos/5668837/pexels-photo-5668837.jpeg'
    }
  ];

  const webinars = [
    {
      title: 'Patent Prosecution Best Practices',
      date: 'April 15, 2025',
      duration: '45 min',
      presenter: 'Angela Malando',
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg',
      type: 'Live Webinar'
    },
    {
      title: 'Trademark Portfolio Management',
      date: 'April 22, 2025',
      duration: '60 min',
      presenter: 'Angela Malando',
      image: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg',
      type: 'Recorded'
    },
    {
      title: 'IP Strategy for Tech Startups',
      date: 'May 1, 2025',
      duration: '50 min',
      presenter: 'Dr. Emily Watson',
      image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
      type: 'Upcoming'
    }
  ];

  const stats = [
    // { number: '50+', label: 'Expert Articles', icon: BookOpen },
    // { number: '25+', label: 'Free Resources', icon: Download },
    // { number: '1K+', label: 'Monthly Readers', icon: TrendingUp },
    // { number: '5★', label: 'Average Rating', icon: Star },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section - Asymmetric Layout */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-screen">
            {/* Left Content - 2/3 width */}
            <div className="lg:col-span-2 flex items-center px-4 sm:px-6 lg:px-8 py-24 lg:py-32 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
              <div className="w-full animate-slide-in-left">
                <div className="inline-flex items-center bg-white/20 border border-white/30 rounded-full px-4 py-2 mb-6">
                  <BookOpen className="h-4 w-4 text-white mr-2" />
                  <span className="text-white text-sm font-medium">Knowledge Hub</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                  Resources &
                  <span className="block text-accent-200">
                    Insights
                  </span>
                </h1>
                
                <p className="text-xl mb-10 text-white/90 leading-relaxed max-w-2xl">
                  Stay informed with the latest developments in intellectual property law 
                  and access helpful resources for protecting your innovations.
                </p>
                
                <div className="grid grid-cols-2 gap-6 max-w-lg">
                  {stats.map((stat, index) => (
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
            </div>
            
            {/* Right Image - 1/3 width */}
            <div className="relative lg:min-h-screen animate-slide-in-right">
              <img
                src="https://images.pexels.com/photos/5668837/pexels-photo-5668837.jpeg"
                alt="Resources and insights"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Floating Resource Badge */}
              <div className="absolute top-8 left-8 bg-white p-6 rounded-2xl shadow-large animate-float">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">Free</div>
                  <div className="text-sm text-neutral-600">Resources</div>
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
      </section>

      {/* Featured Article */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-8 lg:p-16 mb-20 animate-slide-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Featured Article
                  </span>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    Patents
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
                  Patent Strategy for Startups: What Every Entrepreneur Should Know
                </h2>
                <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                  Essential guidance for protecting your innovations while managing costs in the early stages 
                  of business development. Learn how to build a strong patent portfolio without breaking the bank.
                </p>
                <div className="flex items-center space-x-6 text-sm text-neutral-500 mb-8">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Angela M Malando</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>March 15, 2024</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>8 min read</span>
                  </div>
                </div>
                <button className="group bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-orange transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                  <span>Read Full Article</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
              <div>
                <img
                  src="https://images.pexels.com/photos/5668837/pexels-photo-5668837.jpeg"
                  alt="Featured article"
                  className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16 animate-slide-up">
            <div>
              <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-4">
                <Zap className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Latest Content</span>
              </div>
              <h2 className="text-4xl font-bold text-neutral-900">Latest Articles</h2>
            </div>
            <div className="flex space-x-4">
              <select className="border border-neutral-300 rounded-xl px-4 py-3 bg-white shadow-soft focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
                <option>All Categories</option>
                <option>Patents</option>
                <option>Trademarks</option>
                <option>Copyright</option>
                <option>Trade Secrets</option>
                <option>Technology</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.filter(article => !article.featured).map((article, index) => (
              <article
                key={index}
                className="group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 border border-neutral-100 overflow-hidden transform hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <Link to={`/insights/${article.id}`} className="block">
                    <h3 className="text-xl font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors duration-300 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center text-primary-600 hover:text-primary-700 font-semibold group">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Webinars Section */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <Play className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Educational Content</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">Webinars & Events</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Join our expert attorneys for live webinars and educational events covering 
              the latest trends in intellectual property law.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {webinars.map((webinar, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden transform hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={webinar.image}
                    alt={webinar.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      webinar.type === 'Live Webinar' ? 'bg-red-500 text-white' :
                      webinar.type === 'Upcoming' ? 'bg-primary-500 text-white' :
                      'bg-neutral-500 text-white'
                    }`}>
                      {webinar.type}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {webinar.title}
                  </h3>
                  <div className="space-y-2 text-sm text-neutral-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{webinar.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{webinar.presenter}</span>
                    </div>
                  </div>
                  <button className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-300">
                    {webinar.type === 'Upcoming' ? 'Register Now' : 'Watch Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-6">
              <Download className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Free Downloads</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">Downloadable Resources</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Access our collection of helpful guides, checklists, and templates to support 
              your intellectual property efforts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 border border-neutral-100 overflow-hidden transform hover:scale-105"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 relative overflow-hidden">
                    <img
                      src={resource.image}
                      alt={resource.title}
                      className="w-full h-48 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <resource.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                      {resource.title}
                    </h3>
                    <p className="text-neutral-600 mb-6 leading-relaxed">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full font-medium">
                        {resource.type}
                      </span>
                      <button className="group/btn bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-orange transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                        <Download className="h-4 w-4 group-hover/btn:animate-bounce-subtle" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-scale-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Subscribe to our newsletter for the latest IP insights, case studies, 
              and regulatory updates delivered to your inbox monthly.
            </p>
            <div className="max-w-md mx-auto flex space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-large"
              />
              <button className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-100 transition-all duration-300 transform hover:scale-105 shadow-large">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-primary-200 mt-6">
              No spam, unsubscribe at any time. Privacy policy applies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;