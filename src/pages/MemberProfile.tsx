import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileData {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    fitness_goals: {
        goals: string[];
        targets: string[];
    };
    gym_name: string;
    join_date: string;
    membership_plan: string;
    status: string;
}

interface EditForm {
    full_name: string;
    phone: string;
    location: string;
}

export const MemberProfile: React.FC = () => {
    const { user, gymId } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [editForm, setEditForm] = useState<EditForm>({ full_name: '', phone: '', location: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user || !gymId) return;

            try {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('full_name, email, phone, location, fitness_goals, gyms(name)')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;

                const { data: memberData, error: memberError } = await supabase
                    .from('members')
                    .select('join_date, membership_plan, status')
                    .eq('user_id', user.id)
                    .eq('gym_id', gymId)
                    .single();

                if (memberError && memberError.code !== 'PGRST116') throw memberError;

                const built: ProfileData = {
                    full_name: profileData.full_name || '',
                    email: profileData.email || user.email || '',
                    phone: profileData.phone || '',
                    location: profileData.location || '',
                    fitness_goals: { goals: profileData.fitness_goals?.goals ?? [], targets: profileData.fitness_goals?.targets ?? [] },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    gym_name: (profileData.gyms as any)?.name || (Array.isArray(profileData.gyms) ? (profileData.gyms[0] as any)?.name : 'Unknown Gym'),
                    join_date: memberData?.join_date || new Date().toISOString(),
                    membership_plan: memberData?.membership_plan || 'None',
                    status: memberData?.status || 'active'
                };

                setProfile(built);
                setEditForm({ full_name: built.full_name, phone: built.phone, location: built.location });

            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, gymId]);

    const handleSave = async () => {
        if (!user) return;
        if (!editForm.full_name.trim()) {
            setSaveError('Name cannot be empty.');
            return;
        }
        setSaving(true);
        setSaveError('');
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: editForm.full_name.trim(),
                    phone: editForm.phone.trim(),
                    location: editForm.location.trim(),
                })
                .eq('id', user.id);

            if (error) throw error;

            setProfile(prev => prev ? {
                ...prev,
                full_name: editForm.full_name.trim(),
                phone: editForm.phone.trim() || 'Not set',
                location: editForm.location.trim() || 'Not set',
            } : prev);

            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save.';
            setSaveError(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) setEditForm({ full_name: profile.full_name, phone: profile.phone === 'Not set' ? '' : profile.phone, location: profile.location === 'Not set' ? '' : profile.location });
        setSaveError('');
        setIsEditing(false);
    };

    const formatGoal = (id: string) => {
        const labels: Record<string, string> = {
            weight_loss: 'Lose Weight', muscle_build: 'Build Muscle', endurance: 'Endurance',
            flexibility: 'Flexibility', arms: 'Arms', chest: 'Chest', back: 'Back',
            legs: 'Legs', abs: 'Abs', full_body: 'Full Body'
        };
        return labels[id] || id;
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[300px]">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
        </div>
    );
    if (!profile) return <div className="p-8 text-center text-[var(--text-secondary)]">Profile not found.</div>;

    const displayName = profile.full_name || 'Member';
    const avatarLetter = displayName[0].toUpperCase();

    return (
        <div className="p-4 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Profile</h1>
                    <p className="text-[var(--text-secondary)]">Manage your personal information and goals</p>
                </header>

                {/* Success Toast */}
                <AnimatePresence>
                    {saveSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            Profile updated successfully!
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* ID Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="col-span-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col items-center text-center shadow-sm"
                    >
                        <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold mb-4">
                            {avatarLetter}
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">{displayName}</h2>
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase mt-2 border border-green-500/20">
                            {profile.status}
                        </span>

                        <div className="w-full mt-6 pt-6 border-t border-[var(--border)] space-y-3 text-left">
                            <div>
                                <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold">Gym</label>
                                <p className="text-[var(--text-primary)] font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm">fitness_center</span>
                                    {profile.gym_name}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold">Membership</label>
                                <p className="text-[var(--text-primary)] font-medium">{profile.membership_plan}</p>
                            </div>
                            <div>
                                <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold">Member Since</label>
                                <p className="text-[var(--text-primary)] font-medium">
                                    {new Date(profile.join_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Details & Goals */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        {/* Personal Details Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Personal Details</h3>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleCancel}
                                            className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-lg hover:bg-[var(--surface-highlight)] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center gap-1.5 bg-primary text-black text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-[#0fd60f] transition-colors disabled:opacity-60"
                                        >
                                            {saving ? (
                                                <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-[16px]">check</span>
                                            )}
                                            Save
                                        </button>
                                    </div>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {!isEditing ? (
                                    <motion.div
                                        key="view"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                    >
                                        <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                                            <label className="text-xs text-[var(--text-secondary)]">Full Name</label>
                                            <p className="text-[var(--text-primary)] font-medium">{profile.full_name || <span className="italic text-[var(--text-secondary)]">Not set</span>}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                                            <label className="text-xs text-[var(--text-secondary)]">Email</label>
                                            <p className="text-[var(--text-primary)] font-medium truncate">{profile.email}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                                            <label className="text-xs text-[var(--text-secondary)]">Phone</label>
                                            <p className="text-[var(--text-primary)] font-medium">{profile.phone || <span className="italic text-[var(--text-secondary)]">Not set</span>}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                                            <label className="text-xs text-[var(--text-secondary)]">Location</label>
                                            <p className="text-[var(--text-primary)] font-medium">{profile.location || <span className="italic text-[var(--text-secondary)]">Not set</span>}</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="edit"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        {saveError && (
                                            <p className="text-red-400 text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">error</span>
                                                {saveError}
                                            </p>
                                        )}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="sm:col-span-2">
                                                <label className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider block mb-1.5">
                                                    Full Name <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editForm.full_name}
                                                    onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))}
                                                    placeholder="e.g. Aditya Kumar"
                                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-[var(--text-secondary)]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider block mb-1.5">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={editForm.phone}
                                                    onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                                                    placeholder="e.g. +91 98765 43210"
                                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-[var(--text-secondary)]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider block mb-1.5">Location</label>
                                                <input
                                                    type="text"
                                                    value={editForm.location}
                                                    onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                                                    placeholder="e.g. Kanpur, UP"
                                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-[var(--text-secondary)]"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">lock</span>
                                            Email cannot be changed here.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Fitness Goals */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Fitness Goals</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold mb-2 block">Primary Focus</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(profile.fitness_goals?.goals ?? []).length > 0 ? (
                                            (profile.fitness_goals?.goals ?? []).map(goal => (
                                                <span key={goal} className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-sm font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                    {formatGoal(goal)}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-[var(--text-secondary)] italic text-sm">No goals set</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold mb-2 block">Target Areas</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(profile.fitness_goals?.targets ?? []).length > 0 ? (
                                            (profile.fitness_goals?.targets ?? []).map(target => (
                                                <span key={target} className="px-3 py-1 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-lg text-sm font-medium">
                                                    {formatGoal(target)}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-[var(--text-secondary)] italic text-sm">No target areas set</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};
