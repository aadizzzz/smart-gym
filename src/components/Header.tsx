import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-800 bg-background-dark/90 px-6 py-4 backdrop-blur-md lg:px-10">
            <div className="flex items-center gap-3 text-white">
                <Link to="/" className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-[28px]">fitness_center</span>
                    </div>
                    <h2 className="text-xl font-bold leading-tight tracking-tight">Smart Gym</h2>
                </Link>
            </div>
            <nav className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">Features</a>
                <a href="#pricing" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">Pricing</a>
                <a href="#resources" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">Resources</a>
            </nav>
            <div className="flex items-center gap-3">
                <Link to="/login" className="hidden sm:flex h-9 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-bold text-gray-300 transition-colors hover:text-white">
                    Admin Login
                </Link>
                <button className="flex h-10 cursor-pointer items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-white transition-all hover:bg-blue-600 active:scale-95">
                    Get Started
                </button>
            </div>
        </header>
    );
};
