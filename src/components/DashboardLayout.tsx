import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { useAuth } from '../hooks/useAuth';

export const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const { gymName } = useAuth();

    // Map path to title
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/admin') return 'Dashboard Overview';
        if (path.includes('/members')) return 'Member Management';
        if (path.includes('/payments')) return 'Payments & Billing';
        if (path.includes('/trainers')) return 'Trainer Directory';
        if (path.includes('/attendance')) return 'Attendance Tracking';
        if (path.includes('/analytics')) return 'Business Analytics';
        if (path.includes('/management')) return 'Gym Configuration';
        if (path.includes('/leads')) return 'Leads & Marketing';
        if (path.includes('/automation')) return 'Workflow Automation';
        if (path.includes('/settings')) return 'System Settings';
        return 'Admin Console';
    };

    return (
        <div className="bg-[var(--background)] text-[var(--text-primary)] font-display antialiased h-screen flex overflow-hidden">
            {/* Modular Sidebar */}
            <DashboardSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--background)] relative">
                {/* Global Header */}
                <header className="h-16 lg:h-20 border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-8 bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex flex-col pl-12 lg:pl-0">
                        <h2 className="text-[var(--text-primary)] text-lg lg:text-2xl font-bold tracking-tight">{getPageTitle()}</h2>
                        <p className="hidden sm:block text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest opacity-60">
                            {gymName || 'Smart Gym'} • Management
                        </p>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        {/* Search Bar */}
                        <div className="relative w-40 md:w-64 group hidden sm:flex">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-[var(--text-secondary)] transition-all"
                                placeholder="Search..."
                                type="text"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--surface-highlight)]">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-[var(--background)]"></span>
                        </button>

                        {/* Global Action Button */}
                        <button className="bg-primary hover:bg-[#0fd60f] text-[#052e16] text-sm font-bold px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl transition-all shadow-[0_8px_20px_rgba(19,236,19,0.15)] flex items-center gap-2 active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">bolt</span>
                            <span className="hidden sm:inline">Quick Action</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
