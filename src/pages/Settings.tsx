import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';

interface UserProfile {
    full_name: string;
    role: string;
    email: string;
    phone: string;
    dob: string;
    location: string;
    avatar_url: string;
}

export const Settings: React.FC = () => {
    const { user, refreshAuth } = useAuth();
    const { role } = useAuth();
    const { currency, setCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
    const [loading, setLoading] = useState(false);
    const [currencySearch, setCurrencySearch] = useState('');

    const [profile, setProfile] = useState<UserProfile>({
        full_name: '',
        role: '',
        email: '',
        phone: '',
        dob: '',
        location: '',
        avatar_url: ''
    });

    // Password State
    const [passwords, setPasswords] = useState({
        new: '',
        confirm: ''
    });

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (error) throw error;
            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    role: data.role || 'Member',
                    email: data.email || user?.email || '',
                    phone: data.phone || '',
                    dob: data.dob || '',
                    location: data.location || '',
                    avatar_url: data.avatar_url || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    phone: profile.phone,
                    dob: profile.dob || null,
                    location: profile.location
                })
                .eq('id', user?.id);

            if (error) throw error;
            alert('Profile updated successfully!');
            refreshAuth(); // Update context if needed
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert('Passwords do not match!');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.new
            });

            if (error) throw error;
            alert('Password updated successfully!');
            setPasswords({ new: '', confirm: '' });
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto h-full custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">System Settings</h2>
                        <p className="text-[var(--text-secondary)] mt-1">Manage your account and app preferences.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[var(--border)]">
                    {(['profile', 'preferences', 'security'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-bold capitalize border-b-2 transition-all ${activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'profile' && (
                        <div className="max-w-3xl space-y-8">
                            {/* Avatar Section */}
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 flex items-center gap-6">
                                <div className="relative group cursor-pointer">
                                    <div className="size-24 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border-4 border-[var(--surface)] shadow-lg flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            profile.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-white">edit</span>
                                    </div>
                                    <span className="absolute bottom-1 right-1 size-5 bg-green-500 border-2 border-[var(--surface)] rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)]">{profile.full_name || 'Admin User'}</h3>
                                    <p className="text-[var(--text-secondary)] capitalize">{profile.role} • {user?.email}</p>
                                </div>
                                <button className="ml-auto flex items-center gap-2 bg-[var(--surface-highlight)] hover:bg-[var(--border)] text-[var(--text-primary)] px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                                    Upload New Photo
                                </button>
                            </div>

                            {/* Details Form */}
                            <form onSubmit={handleProfileUpdate} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            value={profile.full_name}
                                            onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Role</label>
                                        <input
                                            type="text"
                                            value={profile.role}
                                            disabled
                                            className="w-full bg-[var(--background)]/50 border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-secondary)] cursor-not-allowed uppercase"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Email Address</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full bg-[var(--background)]/50 border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-secondary)] cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Phone</label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={profile.dob}
                                            onChange={e => setProfile({ ...profile, dob: e.target.value })}
                                            className="w-full bg-[var(--background)] border-2 border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors accent-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Location</label>
                                        <input
                                            type="text"
                                            value={profile.location}
                                            onChange={e => setProfile({ ...profile, location: e.target.value })}
                                            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-primary hover:bg-[#0fd60f] text-[#052e16] px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="max-w-3xl space-y-8">
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 space-y-6">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">App Appearance</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <span className="material-symbols-outlined">dark_mode</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[var(--text-primary)]">Theme Mode</h4>
                                                <p className="text-xs text-[var(--text-secondary)]">Select your preferred interface theme.</p>
                                            </div>
                                        </div>
                                        <div className="flex bg-[var(--surface-highlight)] p-1 rounded-lg">
                                            <button className="px-3 py-1.5 rounded-md text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Light</button>
                                            <button className="px-3 py-1.5 rounded-md text-xs font-bold bg-[var(--surface)] text-[var(--text-primary)] shadow-sm">Dark</button>
                                            <button className="px-3 py-1.5 rounded-md text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">System</button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                                                <span className="material-symbols-outlined">palette</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[var(--text-primary)]">Accent Color</h4>
                                                <p className="text-xs text-[var(--text-secondary)]">Choose the primary brand color.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="size-6 rounded-full bg-[#13ec13] ring-2 ring-offset-2 ring-offset-[var(--background)] ring-[#13ec13]"></button>
                                            <button className="size-6 rounded-full bg-blue-500 hover:scale-110 transition-transform"></button>
                                            <button className="size-6 rounded-full bg-purple-500 hover:scale-110 transition-transform"></button>
                                            <button className="size-6 rounded-full bg-orange-500 hover:scale-110 transition-transform"></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Currency Selector — Admin Only */}
                            {(role === 'admin' || role === 'gym_admin') && (
                                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                            <span className="material-symbols-outlined">currency_exchange</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Currency</h3>
                                            <p className="text-xs text-[var(--text-secondary)]">Sets the currency symbol across all pages for your gym. Members will see this currency.</p>
                                        </div>
                                        <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Admin Only</span>
                                    </div>

                                    {/* Current selection */}
                                    <div className="flex items-center gap-3 p-4 bg-[var(--background)] rounded-2xl border border-primary/30">
                                        <span className="text-2xl">{CURRENCIES.find(c => c.code === currency.code)?.flag}</span>
                                        <div>
                                            <p className="font-bold text-[var(--text-primary)]">{currency.name}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">{currency.code} &bull; {currency.symbol}</p>
                                        </div>
                                        <span className="ml-auto text-xs font-bold text-primary">Active</span>
                                    </div>

                                    {/* Search */}
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-lg">search</span>
                                        <input
                                            type="text"
                                            placeholder="Search currency..."
                                            value={currencySearch}
                                            onChange={e => setCurrencySearch(e.target.value)}
                                            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>

                                    {/* Currency grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                                        {CURRENCIES
                                            .filter(c =>
                                                c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
                                                c.code.toLowerCase().includes(currencySearch.toLowerCase())
                                            )
                                            .map(c => (
                                                <button
                                                    key={c.code}
                                                    onClick={() => setCurrency(c.code)}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${currency.code === c.code
                                                        ? 'border-primary bg-primary/10 text-[var(--text-primary)]'
                                                        : 'border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)] hover:border-primary/40 hover:text-[var(--text-primary)]'
                                                        }`}
                                                >
                                                    <span className="text-xl shrink-0">{c.flag}</span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold truncate">{c.name}</p>
                                                        <p className="text-xs opacity-70">{c.code} &bull; {c.symbol}</p>
                                                    </div>
                                                    {currency.code === c.code && (
                                                        <span className="material-symbols-outlined text-primary ml-auto text-lg shrink-0">check_circle</span>
                                                    )}
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="max-w-3xl space-y-8">
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 space-y-6">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Login & Security</h3>
                                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="New password"
                                                value={passwords.new}
                                                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Confirm Password</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="Confirm password"
                                                value={passwords.confirm}
                                                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-[var(--surface-highlight)] hover:bg-[var(--border)] text-[var(--text-primary)] px-6 py-2.5 rounded-xl font-bold text-sm transition-colors border border-[var(--border)] disabled:opacity-50"
                                        >
                                            {loading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};
