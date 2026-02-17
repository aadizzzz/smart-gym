import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { Admin } from './components/Admin';

import { Login } from './components/Login';

import { Members } from './components/Members';

import { Analytics } from './components/Analytics';
import { NotFound } from './components/NotFound';

const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        {/* Call to Action Section from original design - kept simple here */}
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

import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased selection:bg-primary selection:text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/members" element={<Members />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
