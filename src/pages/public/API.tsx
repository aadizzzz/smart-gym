import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const APIPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 px-6 lg:px-10 pb-20">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">DEVELOPER PREVIEW</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">Smart Gym API</h1>
                        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">Build custom integrations and extend the power of Smart Gym.</p>
                    </div>

                    <div className="bg-[var(--surface)] p-12 rounded-3xl border border-[var(--border)] text-center max-w-3xl mx-auto">
                        <div className="size-20 bg-[var(--background)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--border)]">
                            <span className="material-symbols-outlined text-4xl text-[var(--text-secondary)]">code_blocks</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Coming Soon</h2>
                        <p className="text-[var(--text-secondary)] mb-8">
                            We are currently finalizing our public API documentation. Sign up for the waiting list to get early access and start building custom solutions for your gym.
                        </p>
                        <form className="flex gap-4 max-w-md mx-auto">
                            <input type="email" placeholder="Enter your email" className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors" />
                            <button className="bg-primary text-[#052e16] font-bold px-6 py-3 rounded-xl hover:bg-green-400 transition-colors">Notify Me</button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
