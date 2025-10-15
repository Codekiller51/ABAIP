import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DashboardApp } from './dashboard/DashboardApp';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Resources from './pages/Resources';
import InsightPost from './pages/InsightPost';

// Check if we're in dashboard mode
const isDashboard = window.location.pathname.startsWith('/dashboard');

// If dashboard, render dashboard app
if (isDashboard) {
  const DashboardRoot = () => <DashboardApp />;
  export default DashboardRoot;
}

// Initial Loading Component (renamed from InitialLoader)
const Loader = () => (
  <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
    <div className="relative">
      {/* Outer ring */}
      <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin"></div>
      {/* Inner ring */}
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary-600 rounded-full animate-pulse"></div>
    </div>
  </div>
);

// Page transition wrapper
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Start page transition
    setIsPageLoading(true);
    setShowContent(false);
    
    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    // Show loading for 800ms, then show content
    const loadingTimer = setTimeout(() => {
      setIsPageLoading(false);
      // Small delay before showing content to ensure smooth transition
      setTimeout(() => {
        setShowContent(true);
      }, 100);
    }, 800);

    return () => clearTimeout(loadingTimer);
  }, [location.pathname]);

  if (isPageLoading) {
    return <Loader />; // Use the single Loader component
  }

  return (
    <div className={`transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {children}
    </div>
  );
};

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Initial app loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return <Loader />; // Use the single Loader component
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <PageWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/insights/:id" element={<InsightPost />} />
            </Routes>
          </PageWrapper>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;