import React, { useState } from 'react';
import { db } from '../lib/db';

export const Hero: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        await db.addLead(email);
        setStatus('success');
        setEmail('');
    };

    return (
        <section className="relative overflow-hidden px-6 py-16 lg:px-10 lg:py-24 bg-[var(--background)] transition-colors duration-300">
            {/* Background decorative elements */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute top-1/2 left-0 h-64 w-64 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl"></div>

            <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
                {/* Text Content */}
                <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-highlight)] px-3 py-1 transition-colors">
                        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">New: AI Retention Tool</span>
                    </div>
                    <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-[var(--text-primary)] sm:text-6xl xl:text-7xl transition-colors">
                        Run Your Gym <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">Like a Machine</span>
                    </h1>
                    <p className="mb-8 max-w-2xl text-lg text-[var(--text-secondary)] sm:text-xl transition-colors">
                        Smart Automation. Real Insights. Zero Chaos. The all-in-one OS designed to scale modern fitness centers without the headache.
                    </p>

                    <div className="flex flex-col w-full max-w-sm gap-4 mb-8">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'loading' || status === 'success'}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className="flex items-center justify-center rounded-lg bg-primary px-6 font-bold text-white transition-all hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                            >
                                {status === 'loading' ? '...' : status === 'success' ? 'Sent!' : 'Get Started'}
                            </button>
                        </form>
                        {status === 'success' && <p className="text-green-600 dark:text-green-400 text-sm">Thanks! We've added you to our database.</p>}
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-sm text-[var(--text-secondary)] transition-colors">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-[var(--background)] bg-[var(--surface-highlight)] overflow-hidden relative transition-colors">
                                    {/* Placeholder avatars since originals might expire */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-500 dark:to-gray-700"></div>
                                </div>
                            ))}
                        </div>
                        <p>Trusted by 500+ gym owners</p>
                    </div>
                </div>

                {/* Hero Image / Visual */}
                <div className="relative flex-1 w-full max-w-lg lg:max-w-none pt-10 px-4 sm:px-0">
                    <div className="relative aspect-square w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6 shadow-2xl backdrop-blur-sm lg:aspect-[4/3] overflow-visible transition-colors">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black opacity-80 overflow-hidden transition-colors"></div>

                        {/* Decorative Text */}
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--border)] font-bold text-4xl lg:text-5xl opacity-40 dark:opacity-20 rotate-[-12deg] select-none pointer-events-none transition-colors">
                            GYM OS
                        </div>

                        {/* Floating Stats Card - Positioned relative to container */}
                        <div className="absolute -bottom-12 left-4 right-4 sm:-bottom-10 sm:-left-10 sm:right-auto sm:w-[380px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl backdrop-blur-md z-20 transition-colors">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-secondary)]">Monthly Recovery</p>
                                    <h3 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">$42,500</h3>
                                </div>
                                <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-green-600 dark:text-green-400">
                                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                    <span className="text-xs font-bold">+25%</span>
                                </div>
                            </div>
                            {/* Chart SVG */}
                            <div className="h-32 w-full">
                                <svg className="h-full w-full overflow-visible" viewBox="0 0 380 120" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2"></stop>
                                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,100 C40,90 80,100 120,70 C160,40 200,60 240,40 C280,20 320,30 380,10 V120 H0 Z" fill="url(#gradient)"></path>
                                    <path d="M0,100 C40,90 80,100 120,70 C160,40 200,60 240,40 C280,20 320,30 380,10" fill="none" stroke="#22c55e" strokeLinecap="round" strokeWidth="3"></path>
                                    <circle cx="120" cy="70" fill="currentColor" className="text-white dark:text-[#111827]" r="4" stroke="#22c55e" strokeWidth="2"></circle>
                                    <circle cx="240" cy="40" fill="currentColor" className="text-white dark:text-[#111827]" r="4" stroke="#22c55e" strokeWidth="2"></circle>
                                    <circle cx="380" cy="10" fill="currentColor" className="text-white dark:text-[#111827]" r="4" stroke="#22c55e" strokeWidth="2"></circle>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
