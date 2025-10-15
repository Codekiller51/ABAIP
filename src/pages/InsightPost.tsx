import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { insights } from '../data/insights';
import { ArrowLeft } from 'lucide-react';

const InsightPost = () => {
  const { id } = useParams<{ id: string }>();
  const insight = insights.find(i => i.id === id);

  if (!insight) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-600">
        <h1 className="text-4xl font-bold mb-4">Insight Not Found</h1>
        <p className="text-lg mb-8">The insight you are looking for does not exist.</p>
        <Link to="/resources" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Resources
        </Link>
      </div>
    );
  }

  // Filter out the current insight for related insights
  const relatedInsights = insights.filter(i => i.id !== id).slice(0, 3); // Get up to 3 related insights

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(/path/to/subtle-pattern.png)' }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/resources" className="inline-flex items-center text-primary-100 hover:text-white font-medium mb-6 group transition-colors duration-200">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Resources
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
            {insight.title}
          </h1>
          <p className="text-lg md:text-xl text-primary-200 animate-fade-in-up animation-delay-200">
            By {insight.author} on {insight.date}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg lg:prose-xl text-neutral-800 leading-relaxed space-y-6">
            <div dangerouslySetInnerHTML={{ __html: insight.content }} />
            {/* Add more content paragraphs or sections here as needed */}
            <p>This section can be expanded with more detailed analysis, case studies, or legal precedents related to the insight. The goal is to provide comprehensive information to the reader, making the post a valuable resource.</p>
            <p>Further discussions could include the practical implications of the legal concepts, how businesses can apply these insights, and future outlooks in the field of intellectual property.</p>
          </div>
        </div>
      </section>

      {/* Related Insights Section */}
      {relatedInsights.length > 0 && (
        <section className="bg-neutral-50 py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-neutral-800 mb-8 text-center">Related Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedInsights.map(related => (
                <Link to={`/insights/${related.id}`} key={related.id} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                  <img src={related.image} alt={related.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors duration-300 mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                      {related.summary}
                    </p>
                    <div className="flex items-center justify-between text-sm text-neutral-500">
                      <span>{related.author}</span>
                      <span>{related.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default InsightPost;