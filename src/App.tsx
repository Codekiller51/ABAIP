import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './dashboard/components/auth/AuthProvider';
import { ProtectedRoute } from './dashboard/components/auth/ProtectedRoute';
import { LoginForm } from './dashboard/components/auth/LoginForm';
import { Layout } from './dashboard/components/common/Layout';
import { Dashboard } from './dashboard/pages/Dashboard';
import { Insights } from './dashboard/pages/Insights';
import { Team as DashboardTeam } from './dashboard/pages/Team';
import { Services as DashboardServices } from './dashboard/pages/Services';
import { Media } from './dashboard/pages/Media';
import { Settings } from './dashboard/pages/Settings';
import { Users } from './dashboard/pages/Users';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Resources from './pages/Resources';
import InsightPost from './pages/InsightPost';
import TempRegister from './pages/TempRegister';

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

// Page transition wrapper for public pages
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only apply transitions to non-dashboard routes
    if (location.pathname.startsWith('/dashboard')) {
      setShowContent(true);
      return;
    }

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

  if (isPageLoading && !location.pathname.startsWith('/dashboard')) {
    return <Loader />;
  }

  return (
    <div className={`transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {children}
    </div>
  );
};


// Main app component
const App = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Initial app loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <>
                <Header />
                <main>
                  <PageWrapper><Home /></PageWrapper>
                </main>
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Header />
                <main>
                  <PageWrapper><About /></PageWrapper>
                </main>
                <Footer />
              </>
            } />
            <Route path="/services" element={
              <>
                <Header />
                <main>
                  <PageWrapper><Services /></PageWrapper>
                </main>
                <Footer />
              </>
            } />
            <Route path="/team" element={
              <>
                <Header />
                <main>
                  <PageWrapper><Team /></PageWrapper>
                </main>
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Header />
                <main>
                  <PageWrapper><Contact /></PageWrapper>
                </main>
                <Footer />
              </>
            } />
            <Route path="/resources" element={
              <>
                <Header />
                <main>
                  <PageWrapper><Resources /></PageWrapper>
                </main>
                <Footer />
              </>
            } />
            <Route path="/insights/:id" element={
              <>
                <Header />
                <main>
                  <PageWrapper><InsightPost /></PageWrapper>
                </main>
                <Footer />
              </>
            } />
            <Route path="/temp-register" element={
              <>
                <Header />
                <main>
                  <PageWrapper><TempRegister /></PageWrapper>
                </main>
                <Footer />
              </>
            } />

            {/* Dashboard routes */}
            <Route path="/dashboard/login" element={<LoginForm />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="insights" element={<Insights />} />
              <Route path="team" element={<DashboardTeam />} />
              <Route path="services" element={<DashboardServices />} />
              <Route path="media" element={<Media />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;