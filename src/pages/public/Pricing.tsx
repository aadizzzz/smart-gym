import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const PricingPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 px-6 lg:px-10 pb-20">
                <div className="mx-auto max-w-7xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-16">No hidden fees. No long-term contracts. Just one simple plan to power your entire gym.</p>

                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* Starter Plan */}
                        <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)] relative overflow-hidden">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Starter</h3>
                            <div className="flex items-baseline justify-center gap-1 mb-6">
                                <span className="text-4xl font-bold text-[var(--text-primary)]">₹299</span>
                                <span className="text-[var(--text-secondary)]">/month</span>
                            </div>
                            <p className="text-[var(--text-secondary)] text-sm mb-8">Perfect for small gyms just getting started.</p>
                            <ul className="space-y-4 text-left mb-8">
                                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-green-500 text-xl">check</span>
                                    Up to 50 Members
                                </li>
                                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-green-500 text-xl">check</span>
                                    Basic Reporting
                                </li>
                                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-green-500 text-xl">check</span>
                                    Member App Access
                                </li>
                            </ul>
                            <button className="w-full py-3 rounded-xl border border-[var(--border)] text-[var(--text-primary)] font-bold hover:bg-[var(--surface-highlight)] transition-colors">Get Started</button>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-[var(--surface)] p-8 rounded-3xl border-2 border-primary relative overflow-hidden shadow-2xl shadow-primary/10 transform scale-105">
                            <div className="absolute top-0 right-0 bg-primary text-[#052e16] text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Pro</h3>
                            <div className="flex items-baseline justify-center gap-1 mb-6">
                                <span className="text-4xl font-bold text-[var(--text-primary)]">₹999</span>
                                <span className="text-[var(--text-secondary)]">/month</span>
                            </div>
                            <p className="text-[var(--text-secondary)] text-sm mb-8">For growing gyms that need more power.</p>
                            <ul className="space-y-4 text-left mb-8">
                                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-green-500 text-xl">check</span>
                                    Unlimited Members
                                </li>
                                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-green-500 text-xl">check</span>
                                    Advanced Analytics
                                </li>
                                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-green-500 text-xl">check</span>
                                    Trainer Portal
                                </li>
                                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-green-500 text-xl">check</span>
                                    Priority Support
                                </li>
                            </ul>
                            <button className="w-full py-3 rounded-xl bg-primary text-[#052e16] font-bold hover:bg-green-400 transition-colors">Start Free Trial</button>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)] relative overflow-hidden">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Enterprise</h3>
                            <div className="flex items-baseline justify-center gap-1 mb-6">
                                <span className="text-4xl font-bold text-[var(--text-primary)]">Custom</span>
                            </div>
                            <p className="text-[var(--text-secondary)] text-sm mb-8">For multi-location franchises.</p>
                            <ul className="space-y-4 text-left mb-8">
                                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-green-500 text-xl">check</span>
                                    Multi-branch Management
                                </li>
                                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-green-500 text-xl">check</span>
                                    Custom API Integration
                                </li>
                                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-green-500 text-xl">check</span>
                                    Dedicated Account Manager
                                </li>
                            </ul>
                            <button className="w-full py-3 rounded-xl border border-[var(--border)] text-[var(--text-primary)] font-bold hover:bg-[var(--surface-highlight)] transition-colors">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
