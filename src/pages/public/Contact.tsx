import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const ContactPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 px-6 lg:px-10 pb-20">
                <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-16">
                    <div>
                        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-6">Get in Touch</h1>
                        <p className="text-lg text-[var(--text-secondary)] mb-8">
                            Have questions about Smart Gym? We're here to help. Reach out to our team directly.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-primary text-2xl mt-1">mail</span>
                                <div>
                                    <h3 className="font-bold text-[var(--text-primary)]">Email Us</h3>
                                    <a href="mailto:addhiman6@gmail.com" className="text-[var(--text-secondary)] hover:text-primary transition-colors">addhiman6@gmail.com</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-primary text-2xl mt-1">location_on</span>
                                <div>
                                    <h3 className="font-bold text-[var(--text-primary)]">Headquarters</h3>
                                    <p className="text-[var(--text-secondary)]">Kanpur, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)] space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">First Name</label>
                                <input type="text" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Last Name</label>
                                <input type="text" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email</label>
                            <input type="email" className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Message</label>
                            <textarea rows={4} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
                        </div>
                        <button className="w-full bg-primary text-[#052e16] font-bold py-3 rounded-xl hover:bg-green-400 transition-colors">Send Message</button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};
