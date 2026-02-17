import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionLink = motion(Link);

export const NotFound: React.FC = () => {
    return (
        <div className="bg-[var(--background)] text-[var(--text-primary)] font-display overflow-x-hidden min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border)] px-10 py-3 bg-[var(--surface)]">
                <div className="flex items-center gap-4 text-[var(--text-primary)]">
                    <div className="size-8 text-primary">
                        <span className="material-symbols-outlined text-[32px]">fitness_center</span>
                    </div>
                    <h2 className="text-[var(--text-primary)] text-lg font-bold leading-tight tracking-[-0.015em]">Smart Gym</h2>
                </div>
                <div className="hidden md:flex flex-1 justify-end gap-8">
                    <div className="flex items-center gap-9">
                        <Link className="text-[var(--text-primary)] text-sm font-medium leading-normal hover:text-primary transition-colors" to="/admin">Dashboard</Link>
                        <Link className="text-[var(--text-primary)] text-sm font-medium leading-normal hover:text-primary transition-colors" to="/admin/members">Members</Link>
                        <Link className="text-[var(--text-primary)] text-sm font-medium leading-normal hover:text-primary transition-colors" to="/admin/analytics">Analytics</Link>
                        <Link className="text-[var(--text-primary)] text-sm font-medium leading-normal hover:text-primary transition-colors" to="#">Settings</Link>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[var(--surface-highlight)] text-[var(--text-primary)] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-gray-200 dark:hover:bg-[#3e4856] transition-colors">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                        </button>
                        <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[var(--surface-highlight)] text-[var(--text-primary)] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-gray-200 dark:hover:bg-[#3e4856] transition-colors">
                            <span className="material-symbols-outlined text-[20px]">help</span>
                        </button>
                    </div>
                    {/* Replaced external image with a placeholder or generic avatar */}
                    <div className="flex items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-full size-10">
                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">person</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
                {/* Abstract background elements for depth */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="flex flex-col items-center max-w-2xl w-full text-center space-y-8 animate-fade-in-up">
                    {/* Illustration Area */}
                    <div className="relative w-full max-w-[400px] aspect-video flex items-center justify-center mb-4 text-[var(--text-tertiary)] opacity-80">
                        {/* Custom SVG for Empty Gym Rack (Minimalist Line Art) */}
                        <svg height="240" viewBox="0 0 240 240" width="240" xmlns="http://www.w3.org/2000/svg" fill="none">
                            {/* Rack Structure */}
                            <rect height="160" rx="2" stroke="currentColor" strokeWidth="2" width="10" x="60" y="40"></rect>
                            <rect height="160" rx="2" stroke="currentColor" strokeWidth="2" width="10" x="170" y="40"></rect>
                            {/* Top Bar */}
                            <path d="M65 50 H175" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                            {/* Base */}
                            <path d="M40 200 H80" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                            <path d="M160 200 H200" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                            {/* Barbell Hooks (Empty) */}
                            <path d="M70 100 H75 V90" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                            <path d="M165 100 H170 V90" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                            {/* Bench (Empty) */}
                            <rect height="10" rx="2" stroke="currentColor" strokeWidth="2" width="60" x="90" y="140"></rect>
                            <path d="M100 150 V200" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                            <path d="M140 150 V200" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                            {/* Floor Line */}
                            <path d="M30 200 H210" opacity="0.5" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1"></path>
                        </svg>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-[120px] font-extrabold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-secondary)] opacity-20 select-none">
                            404
                        </h1>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                            Looks like this rep doesn't exist.
                        </h2>
                        <p className="text-[var(--text-secondary)] max-w-md mx-auto text-base">
                            The page you are looking for might have been moved, deleted, or possibly never existed in our training plan.
                        </p>
                    </div>

                    <div className="pt-4">
                        <MotionLink
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-primary transition-all duration-200 bg-transparent border-2 border-primary/30 rounded-lg hover:bg-primary hover:text-white hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-[var(--background)]"
                            to="/admin"
                        >
                            <span className="mr-2 material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            Back to Dashboard
                        </MotionLink>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-6 px-5 py-8 text-center border-t border-solid border-[var(--border)] bg-[var(--surface)]">
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <Link className="text-[var(--text-secondary)] text-sm font-medium hover:text-primary transition-colors" to="#">Support</Link>
                    <Link className="text-[var(--text-secondary)] text-sm font-medium hover:text-primary transition-colors" to="#">Privacy Policy</Link>
                    <Link className="text-[var(--text-secondary)] text-sm font-medium hover:text-primary transition-colors" to="#">Terms of Service</Link>
                </div>
                <p className="text-[var(--text-secondary)] text-sm">© 2024 Smart Gym Automation Systems. All rights reserved.</p>
            </footer>
        </div>
    );
};
