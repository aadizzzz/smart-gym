import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const AboutPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 px-6 lg:px-10 pb-20">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-8 text-center">We're on a mission to modernize fitness.</h1>

                    <div className="prose prose-lg prose-invert mx-auto text-[var(--text-secondary)]">
                        <p className="lead text-xl text-[var(--text-primary)] mb-8">
                            Smart Gym was born from a simple frustration: gym software sucks. It's clunky, outdated, and hard to use. We knew there had to be a better way.
                        </p>
                        <p className="mb-6">
                            We are a team of fitness enthusiasts and software engineers dedicated to building tools that help gym owners thrive. We believe that technology should be invisible—it should work so smoothly that you forget it's there.
                        </p>
                        <p className="mb-6">
                            Our platform is designed to give you time back. Time to focus on your members, your culture, and your growth. Whether you run a small boutique studio or a large commercial gym, Smart Gym is built to scale with you.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 my-16 not-prose">
                            <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)]">
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">500+</h3>
                                <p className="text-[var(--text-secondary)]">Gyms Powered</p>
                            </div>
                            <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)]">
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">1M+</h3>
                                <p className="text-[var(--text-secondary)]">Active Members</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
