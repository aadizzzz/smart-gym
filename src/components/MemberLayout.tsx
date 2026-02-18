import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { to: '/member/home', icon: 'home', label: 'Home' },
    { to: '/member/exercises', icon: 'fitness_center', label: 'Exercises' },
    { to: '/member/profile', icon: 'person', label: 'Profile' },
];

export const MemberLayout: React.FC = () => {
    const { gymName, userName, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-[var(--background)]">
            {/* Sidebar — desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-[var(--surface)] border-r border-[var(--border)] p-5 shrink-0">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-xl">fitness_center</span>
                    </div>
                    <div>
                        <p className="font-bold text-[var(--text-primary)] text-sm leading-tight">Smart Gym</p>
                        <p className="text-[var(--text-secondary)] text-xs truncate max-w-[130px]">{gymName || 'Member'}</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1 flex-1">
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${isActive
                                    ? 'bg-primary text-[#052e16] shadow-lg shadow-primary/20'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--text-primary)]'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User + Sign Out */}
                <div className="border-t border-[var(--border)] pt-4 mt-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {(userName || 'M')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[var(--text-primary)] text-sm font-semibold truncate">{userName || 'Member'}</p>
                            <p className="text-[var(--text-secondary)] text-xs">Active Member</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                    <Outlet />
                </main>

                {/* Bottom Nav — mobile */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--border)] flex z-50">
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-all ${isActive ? 'text-primary' : 'text-[var(--text-secondary)]'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <motion.span
                                        className="material-symbols-outlined text-[22px]"
                                        animate={{ scale: isActive ? 1.15 : 1 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                    >
                                        {item.icon}
                                    </motion.span>
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};
