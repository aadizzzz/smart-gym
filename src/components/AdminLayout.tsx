import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem: React.FC<{ icon: string; text: string; to: string }> = ({ icon, text, to }) => {
    const location = useLocation();
    const active = location.pathname === to;
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-[#9db99d] hover:bg-[#283928] hover:text-white group'}`}
        >
            <span className={`material-symbols-outlined ${active ? 'filled' : 'group-hover:scale-110 transition-transform'}`}>{icon}</span>
            <span className="text-sm font-medium">{text}</span>
        </Link>
    );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 font-display antialiased overflow-hidden h-screen flex">
            <aside className="w-64 bg-background-dark border-r border-[#283928] flex flex-col justify-between h-full shrink-0 transition-all duration-300">
                <div>
                    <div className="p-6 flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-primary to-[#0b8a0b] flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(19,236,19,0.3)]">
                            F
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-white text-lg font-bold leading-tight tracking-tight">FitLogic Pro</h1>
                            <p className="text-[#9db99d] text-xs font-normal">Admin Console</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2 px-4 mt-4">
                        <SidebarItem icon="dashboard" text="Dashboard" to="/admin" />
                        <SidebarItem icon="analytics" text="Analytics" to="/admin/analytics" />
                        <SidebarItem icon="groups" text="Members" to="/admin/members" />
                        <SidebarItem icon="schedule" text="Classes" to="#" />
                        <SidebarItem icon="fitness_center" text="Equipment" to="#" />
                        <SidebarItem icon="payments" text="Financials" to="#" />
                    </nav>
                </div>
                <div className="p-4 border-t border-[#283928]">
                    <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9db99d] hover:bg-[#283928] hover:text-white transition-colors group mb-2" href="#">
                        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </a>
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="size-8 rounded-full bg-cover bg-center border border-[#3b543b] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-700"></div>
                            {/* Fallback avatar */}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-sm font-medium">Alex Morgan</span>
                            <span className="text-[#9db99d] text-xs">Gym Manager</span>
                        </div>
                    </div>
                </div>
            </aside>
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
                <header className="h-20 border-b border-[#283928] flex items-center justify-between px-8 bg-background-dark/80 backdrop-blur-md sticky top-0 z-20">
                    <h2 className="text-white text-2xl font-bold tracking-tight">Dashboard Overview</h2>
                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="relative w-64 group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9db99d] group-focus-within:text-primary transition-colors">search</span>
                            <input className="w-full bg-[#1a241a] border border-[#283928] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-[#5d7a5d] transition-all" placeholder="Search members, classes..." type="text" />
                        </div>
                        {/* Notifications */}
                        <button className="relative p-2 text-[#9db99d] hover:text-white transition-colors rounded-full hover:bg-[#283928]">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-background-dark"></span>
                        </button>
                        {/* Action Button */}
                        <button className="bg-primary hover:bg-[#0fd60f] text-black text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-[0_0_15px_rgba(19,236,19,0.2)] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>New Member</span>
                        </button>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
};
