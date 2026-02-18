import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const PrivacyPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 px-6 lg:px-10 pb-20">
                <div className="mx-auto max-w-3xl prose prose-invert">
                    <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8">Privacy Policy</h1>
                    <p className="text-[var(--text-secondary)]">Last updated: February 18, 2026</p>

                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">1. Introduction</h2>
                    <p className="text-[var(--text-secondary)]">
                        Welcome to Smart Gym. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data and tell you about your privacy rights and how the law protects you.
                    </p>

                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">2. Data We Collect</h2>
                    <p className="text-[var(--text-secondary)]">
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2 mt-4">
                        <li>Identity Data includes first name, last name, username or similar identifier.</li>
                        <li>Contact Data includes billing address, delivery address, email address and telephone numbers.</li>
                        <li>Financial Data includes bank account and payment card details (processed securely via Stripe/Razorpay).</li>
                        <li>Transaction Data includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                    </ul>

                    {/* Add more sections as needed */}
                </div>
            </main>
            <Footer />
        </div>
    );
};
