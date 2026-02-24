import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

import { supabase } from '../lib/supabase';

const COLORS = [
    { id: 'green', hex: '#13ec13', label: 'Neon Green' },
    { id: 'blue', hex: '#3b82f6', label: 'Ocean Blue' },
    { id: 'indigo', hex: '#6366f1', label: 'Indigo' },
    { id: 'purple', hex: '#a855f7', label: 'Purple' },
    { id: 'rose', hex: '#f43f5e', label: 'Rose' },
    { id: 'orange', hex: '#f97316', label: 'Orange' }
];

export const MemberSettings: React.FC = () => {
    const { user, signOut, refreshAuth, themePreference, accentColor } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [theme, setTheme] = useState(themePreference || 'system');
    const [col, setCol] = useState(accentColor || 'green');
    const [language, setLanguage] = useState('English');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setTheme(themePreference || 'system');
        setCol(accentColor || 'green');
    }, [themePreference, accentColor]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await supabase.from('profiles').update({
                theme_preference: theme,
                accent_color: col
            }).eq('id', user.id);

            await refreshAuth();
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (e) {
            console.error('Failed to save settings:', e);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: window.location.origin + '/admin/settings?reset=true',
        });
        if (!error) {
            alert('Password reset link sent to your email!');
        } else {
            alert(error.message);
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-8 pb-32">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Settings</h1>
                <p className="text-[var(--text-secondary)] mt-1">Manage your app preferences and account security</p>
            </motion.div>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Preferences saved successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* App Preferences */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4 border-b border-[var(--border)] pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                    App Preferences
                </h2>

                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-6 shadow-sm">
                    {/* Dark Mode toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">Theme Appearance</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Switch between light, dark, and system</p>
                        </div>
                        <div className="bg-[var(--background)] p-1 rounded-xl flex items-center gap-1 border border-[var(--border)]">
                            <button onClick={() => setTheme('light')} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${theme === 'light' ? 'bg-[var(--surface-highlight)] text-black dark:text-white shadow-sm' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}>
                                <span className="material-symbols-outlined text-[16px]">light_mode</span> Light
                            </button>
                            <button onClick={() => setTheme('dark')} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${theme === 'dark' ? 'bg-[#2a2a2a] text-white shadow-sm' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}>
                                <span className="material-symbols-outlined text-[16px]">dark_mode</span> Dark
                            </button>
                            <button onClick={() => setTheme('system')} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${theme === 'system' ? 'bg-[var(--surface-highlight)] text-black dark:text-white shadow-sm' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}>
                                <span className="material-symbols-outlined text-[16px]">desktop_windows</span> System
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-[var(--border)]"></div>

                    {/* Accent Color picker */}
                    <div>
                        <p className="font-bold text-[var(--text-primary)] mb-1">Accent Color</p>
                        <p className="text-xs text-[var(--text-secondary)] mb-4">Personalize your app's primary color</p>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setCol(c.id)}
                                    title={c.label}
                                    className={`size-10 rounded-full flex items-center justify-center transition-all ${col === c.id ? 'scale-110 ring-2 ring-offset-2 ring-offset-[var(--background)]' : 'hover:scale-105 opacity-50 hover:opacity-100'}`}
                                    style={{ backgroundColor: c.hex }}
                                >
                                    {col === c.id && <span className="material-symbols-outlined text-white/90 text-[20px] drop-shadow-md">check</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-[var(--border)]"></div>

                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-[var(--text-primary)] relative pr-4">
                                Push Notifications
                                <span className="absolute -right-2 -top-1 size-2 rounded-full bg-primary animate-pulse"></span>
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Receive alerts for check-ins, payments, and smart suggestions</p>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors relative ${notifications ? 'bg-primary' : 'bg-gray-600'}`}
                        >
                            <div className={`size-4 bg-white rounded-full shadow-md transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="border-t border-[var(--border)]"></div>

                    {/* Language Selection */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">Language</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Sets the display language for the app</p>
                        </div>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] text-sm rounded-lg px-3 py-2 outline-none focus:border-primary cursor-pointer"
                        >
                            <option value="English">English</option>
                            <option value="Hindi">Hindi (हिंदी)</option>
                            <option value="Spanish">Spanish</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 text-right">
                    <button onClick={handleSave} disabled={isSaving} className="bg-[var(--surface)] hover:bg-[var(--surface-highlight)] border border-[var(--border)] hover:border-primary/50 text-[var(--text-primary)] font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            </motion.section>

            {/* Account & Security */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4 border-b border-[var(--border)] pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">security</span>
                    Account Security
                </h2>

                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 space-y-6 shadow-sm">
                    {/* Reset Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <span className="material-symbols-outlined">password</span>
                            </div>
                            <div>
                                <p className="font-bold text-[var(--text-primary)]">Change Password</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-snug">We will send a secure link to <br />{user?.email} to reset your password.</p>
                            </div>
                        </div>
                        <button onClick={handlePasswordReset} className="px-4 py-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white font-bold text-sm rounded-xl transition-colors">
                            Send Link
                        </button>
                    </div>

                    <div className="border-t border-[var(--border)]"></div>

                    {/* Logout */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <span className="material-symbols-outlined">logout</span>
                            </div>
                            <div>
                                <p className="font-bold text-[var(--text-primary)]">Sign Out</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">Securely log out of the FitLogic System on this device.</p>
                            </div>
                        </div>
                        <button onClick={signOut} className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-sm rounded-xl transition-colors">
                            Sign Out
                        </button>
                    </div>
                </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
                <button className="text-[var(--text-tertiary)] hover:text-red-500 text-xs font-bold uppercase transition-colors underline decoration-dotted underline-offset-4">
                    Request Account Deletion
                </button>
            </motion.section>

        </div>
    );
};
