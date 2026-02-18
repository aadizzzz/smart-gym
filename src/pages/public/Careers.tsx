import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const CareersPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 px-6 lg:px-10 pb-20">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">Join the Team</h1>
                        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">Help us build the operating system for the fitness industry.</p>
                    </div>

                    <div className="space-y-4 max-w-4xl mx-auto">
                        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Senior Frontend Engineer</h3>
                                <p className="text-[var(--text-secondary)]">Remote • Engineering</p>
                            </div>
                            <button className="px-6 py-2 rounded-lg border border-[var(--border)] text-[var(--text-primary)] font-medium hover:bg-[var(--surface-highlight)] transition-colors">View Role</button>
                        </div>
                        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Product Designer</h3>
                                <p className="text-[var(--text-secondary)]">Remote • Design</p>
                            </div>
                            <button className="px-6 py-2 rounded-lg border border-[var(--border)] text-[var(--text-primary)] font-medium hover:bg-[var(--surface-highlight)] transition-colors">View Role</button>
                        </div>
                        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Customer Success Manager</h3>
                                <p className="text-[var(--text-secondary)]">New York, NY • Sales</p>
                            </div>
                            <button className="px-6 py-2 rounded-lg border border-[var(--border)] text-[var(--text-primary)] font-medium hover:bg-[var(--surface-highlight)] transition-colors">View Role</button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
