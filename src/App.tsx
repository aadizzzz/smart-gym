import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Payments } from './pages/Payments';
import { Trainers } from './pages/Trainers';
import { Attendance } from './pages/Attendance';
import { Analytics } from './pages/Analytics';
import { GymManagement } from './pages/GymManagement';
import { Leads } from './pages/Leads';
import { Automation } from './pages/Automation';
import { Settings } from './pages/Settings';
import { ChooseGym } from './components/ChooseGym';
import { ChoosePlan } from './components/ChoosePlan';
import { ChooseGoals } from './components/ChooseGoals';
import { MemberProfile } from './pages/MemberProfile';
import { MemberHome } from './pages/MemberHome';
import { MemberExercises } from './pages/MemberExercises';
import { MemberLayout } from './components/MemberLayout';
import { TrainerDashboard } from './components/TrainerDashboard';
import { PlatformAdmin } from './components/PlatformAdmin';
import { NotFound } from './components/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/DashboardLayout';
import { FeaturesPage } from './pages/public/Features';
import { PricingPage } from './pages/public/Pricing';
import { HardwarePage } from './pages/public/Hardware';
import { APIPage } from './pages/public/API';
import { AboutPage } from './pages/public/About';
import { CareersPage } from './pages/public/Careers';
import { BlogPage } from './pages/public/Blog';
import { ContactPage } from './pages/public/Contact';
import { PrivacyPage } from './pages/public/Privacy';
import { TermsPage } from './pages/public/Terms';
import { SecurityPage } from './pages/public/Security';
import { ResourcesPage } from './pages/public/Resources';

const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <section className="py-20 px-6 lg:px-10">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary relative">
            <div className="absolute inset-0 bg-black opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 flex flex-col items-center justify-between gap-8 px-8 py-16 text-center lg:flex-row lg:text-left lg:px-16">
              <div className="flex-1">
                <h2 className="mb-4 text-3xl font-extrabold text-white md:text-4xl">Ready to upgrade your gym?</h2>
                <p className="text-lg text-blue-100">Join 500+ gym owners streamlining their operations today.</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-bold text-primary transition-transform hover:scale-105 active:scale-95">
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[var(--background)] text-[var(--text-primary)] font-display antialiased selection:bg-primary selection:text-white transition-colors duration-300">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Public Pages */}
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/hardware" element={<HardwarePage />} />
          <Route path="/api" element={<APIPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/resources" element={<ResourcesPage />} />

          {/* SaaS Core Flows */}
          <Route element={<ProtectedRoute allowedRoles={['gym_admin', 'member', 'trainer', 'super_admin', 'platform_admin']} />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/choose-gym" element={<ChooseGym />} />
            <Route path="/choose-plan" element={<ChoosePlan />} />
            <Route path="/choose-goals" element={<ChooseGoals />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['gym_admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/members" element={<Members />} />
              <Route path="/admin/payments" element={<Payments />} />
              <Route path="/admin/trainers" element={<Trainers />} />
              <Route path="/admin/attendance" element={<Attendance />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/management" element={<GymManagement />} />
              <Route path="/admin/leads" element={<Leads />} />
              <Route path="/admin/automation" element={<Automation />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Protected Member Routes */}
          <Route element={<ProtectedRoute allowedRoles={['member']} />}>
            <Route element={<MemberLayout />}>
              <Route path="/member/home" element={<MemberHome />} />
              <Route path="/member/exercises" element={<MemberExercises />} />
              <Route path="/member/profile" element={<MemberProfile />} />
              <Route path="/dashboard" element={<MemberHome />} />
            </Route>
          </Route>

          {/* Protected Trainer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['trainer']} />}>
            <Route path="/trainer" element={<TrainerDashboard />} />
          </Route>

          {/* Protected Platform Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['platform_admin', 'super_admin']} />}>
            <Route path="/platform-admin" element={<PlatformAdmin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </Router>
  );
}

export default App;
