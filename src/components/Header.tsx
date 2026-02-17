import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const Header: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-background-dark/90 px-6 py-4 backdrop-blur-md lg:px-10 transition-colors duration-300">
            <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                <Link to="/" className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-[28px]">fitness_center</span>
                    </div>
                    <h2 className="text-xl font-bold leading-tight tracking-tight">Smart Gym</h2>
                </Link>
            </div>
            <nav className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-primary dark:hover:text-white">Features</a>
                <a href="#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-primary dark:hover:text-white">Pricing</a>
                <a href="#resources" className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-primary dark:hover:text-white">Resources</a>
            </nav>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex size-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Toggle Theme"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>
                <Link to="/login" className="hidden sm:flex h-9 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors hover:text-primary dark:hover:text-white">
                    Admin Login
                </Link>
                <button className="flex h-10 cursor-pointer items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-white transition-all hover:bg-green-600 active:scale-95 shadow-md shadow-primary/20">
                    Get Started
                </button>
            </div>
        </header>
    );
};
