import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const HardwarePage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 px-6 lg:px-10 pb-20">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">Smart Gym Hardware</h1>
                        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">Seamlessly integrate access control and attendance hardware with your Smart Gym software.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                        <div>
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Biometric Access Control</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                                Replace traditional keycards with advanced biometric scanners. Your members can access the gym using their fingerprint or face recognition, ensuring only active members can enter.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                    Real-time sync with membership status
                                </li>
                                <li className="flex items-center gap-3 text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                    Anti-passback protection
                                </li>
                                <li className="flex items-center gap-3 text-[var(--text-primary)]">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                    Detailed entry logs
                                </li>
                            </ul>
                        </div>
                        <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)] flex items-center justify-center min-h-[300px]">
                            <span className="material-symbols-outlined text-9xl text-[var(--text-secondary)] opacity-20">fingerprint</span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
