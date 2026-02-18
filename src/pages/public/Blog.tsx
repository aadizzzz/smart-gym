import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const BlogPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 px-6 lg:px-10 pb-20">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">The Gym Owner's Playbook</h1>
                        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">Tips, strategies, and insights for growing your fitness business.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <article className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden hover:border-primary transition-colors cursor-pointer group">
                            <div className="h-48 bg-zinc-800"></div>
                            <div className="p-6">
                                <span className="text-xs text-primary font-bold uppercase tracking-wide">Growth</span>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mt-2 mb-3 group-hover:text-primary transition-colors">5 Strategies to Increase Member Retention</h3>
                                <p className="text-[var(--text-secondary)] text-sm line-clamp-3">Learn how top gyms keep their members engaged and coming back month after month.</p>
                            </div>
                        </article>
                        <article className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden hover:border-primary transition-colors cursor-pointer group">
                            <div className="h-48 bg-zinc-800"></div>
                            <div className="p-6">
                                <span className="text-xs text-primary font-bold uppercase tracking-wide">Technology</span>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mt-2 mb-3 group-hover:text-primary transition-colors">Why Your Gym Needs Biometric Access</h3>
                                <p className="text-[var(--text-secondary)] text-sm line-clamp-3">Say goodbye to lost keycards and unauthorized entry. See why biometrics are the future.</p>
                            </div>
                        </article>
                        <article className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden hover:border-primary transition-colors cursor-pointer group">
                            <div className="h-48 bg-zinc-800"></div>
                            <div className="p-6">
                                <span className="text-xs text-primary font-bold uppercase tracking-wide">Marketing</span>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mt-2 mb-3 group-hover:text-primary transition-colors">How to Run a Successful Challenge</h3>
                                <p className="text-[var(--text-secondary)] text-sm line-clamp-3">Boost engagement and revenue with a well-planned 6-week fitness challenge.</p>
                            </div>
                        </article>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
