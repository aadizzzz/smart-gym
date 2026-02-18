import React from 'react';
import { Hero } from '../../components/Hero';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const FeaturesPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 px-6 lg:px-10 pb-20">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">Powerful Features for Modern Gyms</h1>
                        <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">Everything you need to manage your fitness business, from member check-ins to financial reporting.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Member Management */}
                        <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)]">
                            <div className="size-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl">groups</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Member Management</h3>
                            <p className="text-[var(--text-secondary)]">Effortlessly manage member profiles, subscriptions, and renewals. Get notified of expiring memberships automatically.</p>
                        </div>

                        {/* Analytics */}
                        <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)]">
                            <div className="size-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl">monitoring</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Real-time Analytics</h3>
                            <p className="text-[var(--text-secondary)]">Track revenue, active members, and attendance trends with beautiful, easy-to-understand charts.</p>
                        </div>

                        {/* Automated Billing */}
                        <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)]">
                            <div className="size-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl">payments</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Smart Payments</h3>
                            <p className="text-[var(--text-secondary)]">Accept payments online, track cash transactions, and generate professional invoices instantly.</p>
                        </div>

                        {/* Attendance Tracking */}
                        <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)]">
                            <div className="size-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl">fingerprint</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Biometric Attendance</h3>
                            <p className="text-[var(--text-secondary)]">Seamless check-ins via fingerprint, QR code, or face recognition hardware integration.</p>
                        </div>

                        {/* Trainer Portal */}
                        <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)]">
                            <div className="size-12 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl">fitness_center</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Trainer Dashboard</h3>
                            <p className="text-[var(--text-secondary)]">Empower your trainers to manage their clients, schedule sessions, and track workout progress.</p>
                        </div>

                        {/* Member App */}
                        <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)]">
                            <div className="size-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl">smartphone</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Member App</h3>
                            <p className="text-[var(--text-secondary)]">Give your members a dedicated portal to view their plans, track workouts, and stay engaged.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
