import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const TermsPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 px-6 lg:px-10 pb-20">
                <div className="mx-auto max-w-3xl prose prose-invert">
                    <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8">Terms of Service</h1>
                    <p className="text-[var(--text-secondary)]">Last updated: February 18, 2026</p>

                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-[var(--text-secondary)]">
                        By accessing and using Smart Gym, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>

                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">2. Provision of Services</h2>
                    <p className="text-[var(--text-secondary)]">
                        Smart Gym is constantly innovating in order to provide the best possible experience for its users. You acknowledge and agree that the form and nature of the Services which Smart Gym provides may change from time to time without prior notice to you.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};
