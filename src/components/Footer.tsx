import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-[var(--border)] bg-[var(--background)] py-12 px-6 lg:px-10 mt-auto transition-colors duration-300">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2 lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                            <span className="material-symbols-outlined text-primary">fitness_center</span>
                            <span className="text-xl font-bold">Smart Gym</span>
                        </Link>
                        <p className="max-w-xs text-sm text-[var(--text-secondary)]">The operating system for the modern fitness industry. Built for growth, designed for people.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">Product</h4>
                        <Link to="/features" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">Features</Link>
                        <Link to="/pricing" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">Pricing</Link>
                        <Link to="/hardware" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">Hardware</Link>
                        <Link to="/api" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">API</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">Company</h4>
                        <Link to="/about" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">About</Link>
                        <Link to="/careers" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">Careers</Link>
                        <Link to="/blog" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">Blog</Link>
                        <Link to="/contact" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">Contact</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-[var(--text-primary)]">Legal</h4>
                        <Link to="/privacy" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">Privacy</Link>
                        <Link to="/terms" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">Terms</Link>
                        <Link to="/security" className="text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">Security</Link>
                    </div>
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-[var(--border)] pt-8 md:flex-row">
                    <p className="text-sm text-[var(--text-secondary)]">© 2024 Smart Gym Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-[var(--text-secondary)] hover:text-primary transition-colors"><span className="sr-only">Twitter</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
