import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { CookieBanner } from './components/CookieBanner';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { QuotePage } from './pages/QuotePage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import PortfolioPage from './pages/PortfolioPage';
import FaqPage from './pages/FaqPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import PricingPage from './pages/PricingPage';
import AiAutomationPage from './pages/AiAutomationPage';
import WebsitesAppsPage from './pages/WebsitesAppsPage';
import TaskSystemsPage from './pages/TaskSystemsPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './admin/auth/AuthContext';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminLayout } from './admin/layouts/AdminLayout';
import { AdminOverviewPage } from './admin/pages/AdminOverviewPage';
import { AdminPortfolioPage } from './admin/pages/content/AdminPortfolioPage';
import { AdminBlogPage } from './admin/pages/content/AdminBlogPage';
import { AdminServicesOffersPage } from './admin/pages/content/AdminServicesOffersPage';
import { AdminTestimonialsPage } from './admin/pages/content/AdminTestimonialsPage';
import { AdminFaqsPage } from './admin/pages/content/AdminFaqsPage';
import { AdminHomeFooterPage } from './admin/pages/content/AdminHomeFooterPage';
import { AdminLeadsPage } from './admin/pages/operations/AdminLeadsPage';
import { AdminClientsPage } from './admin/pages/operations/AdminClientsPage';
import { AdminProjectsPage } from './admin/pages/operations/AdminProjectsPage';
import { AdminTasksPage } from './admin/pages/operations/AdminTasksPage';
import { AdminSettingsPage } from './admin/pages/AdminSettingsPage';
import { RequireAuth } from './admin/routes/RequireAuth';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-obsidian text-cream font-sans selection:bg-gold/20 selection:text-cream">
          <Navigation />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/solutions" element={<SolutionsPage />} />
                <Route path="/industries" element={<IndustriesPage />} />
                <Route path="/quote" element={<QuotePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/ai-automation" element={<AiAutomationPage />} />
                <Route path="/websites-apps" element={<WebsitesAppsPage />} />
                <Route path="/task-systems" element={<TaskSystemsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />

                {/* Admin */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      <AdminLayout />
                    </RequireAuth>
                  }
                >
                  <Route index element={<AdminOverviewPage />} />
                  <Route path="content/portfolio" element={<AdminPortfolioPage />} />
                  <Route path="content/blog" element={<AdminBlogPage />} />
                  <Route path="content/services" element={<AdminServicesOffersPage />} />
                  <Route path="content/testimonials" element={<AdminTestimonialsPage />} />
                  <Route path="content/faqs" element={<AdminFaqsPage />} />
                  <Route path="content/home" element={<AdminHomeFooterPage />} />
                  <Route path="operations/leads" element={<AdminLeadsPage />} />
                  <Route path="operations/clients" element={<AdminClientsPage />} />
                  <Route path="operations/projects" element={<AdminProjectsPage />} />
                  <Route path="operations/tasks" element={<AdminTasksPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
          <FloatingActions />
          <CookieBanner />
        </div>
      </AuthProvider>
    </Router>
  );
}
