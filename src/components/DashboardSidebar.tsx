import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
};

const SidebarItem: React.FC<{ icon: string; text: string; to: string; badge?: string; end?: boolean; onClick?: () => void }> = ({ icon, text, to, badge, end, onClick }) => {
    return (
        <motion.div variants={itemVariants}>
            <NavLink
                to={to}
                end={end}
                onClick={onClick}
                className={({ isActive }) => `relative flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(19,236,19,0.05)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-highlight)]'}`}
            >
                {({ isActive }) => (
                    <>
                        {isActive && (
                            <motion.div
                                layoutId="activeSidebar"
                                className="absolute left-0 w-1 h-5 bg-primary rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <div className="flex items-center gap-3 relative z-10">
                            <span className={`material-symbols-outlined text-[22px] transition-transform duration-300 ${isActive ? 'filled' : 'group-hover:scale-110'}`}>
                                {icon}
                            </span>
                            <span className="text-sm font-medium tracking-tight whitespace-nowrap">{text}</span>
                        </div>
                        {badge && (
                            <span className="bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-md relative z-10">
                                {badge}
                            </span>
                        )}
                    </>
                )}
            </NavLink>
        </motion.div>
    );
};

const SidebarContent: React.FC<{ onNavClick?: () => void }> = ({ onNavClick }) => {
    const { gymName, userName, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <>
            {/* Header / Gym Name */}
            <div className="p-6">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="size-11 rounded-2xl bg-gradient-to-br from-primary to-[#0b8a0b] flex items-center justify-center text-black font-extrabold text-xl shadow-[0_8px_20px_rgba(19,236,19,0.2)] group-hover:scale-105 transition-transform">
                        {gymName ? gymName.charAt(0).toUpperCase() : 'F'}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h1 className="text-[var(--text-primary)] text-base font-bold leading-tight tracking-tight truncate">
                            {gymName || 'Smart Gym'}
                        </h1>
                        <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-[0.1em] opacity-70">Admin Console</p>
                    </div>
                </div>
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 overflow-y-auto px-3 space-y-6 pb-8 custom-scrollbar">
                <div>
                    <p className="px-4 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-3 opacity-50">Core Management</p>
                    <motion.nav variants={containerVariants} initial="hidden" animate="show" className="space-y-1">
                        <SidebarItem icon="dashboard" text="Dashboard" to="/admin" end={true} onClick={onNavClick} />
                        <SidebarItem icon="groups" text="Members" to="/admin/members" onClick={onNavClick} />
                        <SidebarItem icon="payments" text="Payments & Billing" to="/admin/payments" onClick={onNavClick} />
                        <SidebarItem icon="fitness_center" text="Trainers" to="/admin/trainers" onClick={onNavClick} />
                        <SidebarItem icon="how_to_reg" text="Attendance" to="/admin/attendance" onClick={onNavClick} />
                    </motion.nav>
                </div>

                <div>
                    <p className="px-4 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-3 opacity-50">Growth & Strategy</p>
                    <motion.nav variants={containerVariants} initial="hidden" animate="show" className="space-y-1">
                        <SidebarItem icon="analytics" text="Analytics" to="/admin/analytics" onClick={onNavClick} />
                        <SidebarItem icon="campaign" text="Leads & Marketing" to="/admin/leads" onClick={onNavClick} />
                        <SidebarItem icon="notifications_active" text="Automation" to="/admin/automation" onClick={onNavClick} />
                    </motion.nav>
                </div>

                <div>
                    <p className="px-4 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-3 opacity-50">Infrastructure</p>
                    <motion.nav variants={containerVariants} initial="hidden" animate="show" className="space-y-1">
                        <SidebarItem icon="settings_applications" text="Gym Management" to="/admin/management" onClick={onNavClick} />
                        <SidebarItem icon="settings" text="Settings" to="/admin/settings" onClick={onNavClick} />
                    </motion.nav>
                </div>
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--background)]/50">
                <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[var(--surface-highlight)] transition-colors cursor-pointer group">
                    <div className="size-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)]">
                        {userName ? userName.split(' ').map(n => n[0]).join('') : 'A'}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[var(--text-primary)] text-sm font-bold truncate group-hover:text-primary transition-colors">
                            {userName || 'Gym Admin'}
                        </span>
                        <span className="text-[var(--text-secondary)] text-[10px] font-medium opacity-70">Gym Manager</span>
                    </div>
                    <button
                        onClick={handleSignOut}
                        title="Sign Out"
                        className="text-[var(--text-secondary)] hover:text-red-400 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export const DashboardSidebar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 bg-[var(--surface)] border-r border-[var(--border)] flex-col h-full shrink-0 relative z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 size-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--text-primary)] shadow-lg"
                aria-label="Open menu"
            >
                <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>

            {/* Mobile Drawer Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/60 z-40"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col z-50 shadow-2xl"
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-4 right-4 size-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            <SidebarContent onNavClick={() => setMobileOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
