import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { BADGE_REGISTRY } from '../services/gamification/BadgeRegistry';

// --- Types ---
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
    member_id: string; // Needed for logging progress
}

interface EditForm {
    full_name: string;
    phone: string;
    location: string;
}

interface MetricLog {
    id: string;
    metric_type: string;
    metric_value: number;
    recorded_at: string;
}

// --- Component ---
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

    // Progress State
    const [metrics, setMetrics] = useState<MetricLog[]>([]);
    const [weightInput, setWeightInput] = useState('');
    const [fatInput, setFatInput] = useState('');
    const [heightInput, setHeightInput] = useState(''); // height in cm
    const [loggingProgress, setLoggingProgress] = useState(false);

    // Achievements State
    const [achievements, setAchievements] = useState<string[]>([]);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!user || !gymId) return;
            try {
                // Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('full_name, email, phone, location, fitness_goals, gyms(name)')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;

                // Fetch Member
                const { data: memberData, error: memberError } = await supabase
                    .from('members')
                    .select('id, join_date, membership_plan, status')
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
                    status: memberData?.status || 'active',
                    member_id: memberData?.id || ''
                };

                setProfile(built);
                setEditForm({ full_name: built.full_name, phone: built.phone, location: built.location });

                // Fetch Metrics
                if (built.member_id) {
                    const { data: metricsData } = await supabase
                        .from('member_progress')
                        .select('*')
                        .eq('member_id', built.member_id)
                        .order('recorded_at', { ascending: true });

                    if (metricsData) setMetrics(metricsData);

                    // Fetch Achievements
                    const { data: achData } = await supabase
                        .from('member_achievements')
                        .select('badge_id')
                        .eq('member_id', built.member_id);

                    if (achData) setAchievements(achData.map(a => a.badge_id));
                }

            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [user, gymId]);

    const handleSaveProfile = async () => {
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

    const handleLogMetrics = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile?.member_id) return;
        setLoggingProgress(true);

        try {
            const inserts = [];
            if (weightInput) inserts.push({ member_id: profile.member_id, metric_type: 'weight', metric_value: parseFloat(weightInput) });
            if (fatInput) inserts.push({ member_id: profile.member_id, metric_type: 'body_fat', metric_value: parseFloat(fatInput) });
            if (heightInput) inserts.push({ member_id: profile.member_id, metric_type: 'height', metric_value: parseFloat(heightInput) });

            if (inserts.length === 0) return;

            const { data, error } = await supabase.from('member_progress').insert(inserts).select();
            if (error) throw error;

            if (data) {
                setMetrics(prev => [...prev, ...data].sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()));
            }

            setWeightInput('');
            setFatInput('');
        } catch (error) {
            console.error(error);
        } finally {
            setLoggingProgress(false);
        }
    };


    // Derived Metrics Calculations
    const weightLogs = metrics.filter(m => m.metric_type === 'weight');
    const heightLogs = metrics.filter(m => m.metric_type === 'height');
    const fatLogs = metrics.filter(m => m.metric_type === 'body_fat');

    const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].metric_value : null;
    const currentHeight = heightLogs.length > 0 ? heightLogs[heightLogs.length - 1].metric_value : (heightInput ? parseFloat(heightInput) : null);
    const currentFat = fatLogs.length > 0 ? fatLogs[fatLogs.length - 1].metric_value : null;

    let currentBMI = null;
    if (currentWeight && currentHeight) {
        const heightM = currentHeight / 100;
        currentBMI = (currentWeight / (heightM * heightM)).toFixed(1);
    }

    const getBMICategory = (bmi: number) => {
        if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
        if (bmi < 25) return { label: 'Normal', color: 'text-green-400' };
        if (bmi < 30) return { label: 'Overweight', color: 'text-orange-400' };
        return { label: 'Obese', color: 'text-red-400' };
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[300px]">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
        </div>
    );
    if (!profile) return <div className="p-8 text-center text-[var(--text-secondary)]">Profile not found.</div>;

    const displayName = profile.full_name || 'Member';
    const avatarLetter = displayName[0].toUpperCase();

    // Visual Path for SVG Chart
    const getChartPath = (width: number, height: number, data: MetricLog[]) => {
        if (data.length < 2) return '';
        const maxVal = Math.max(...data.map(d => d.metric_value)) + 5;
        const minVal = Math.max(0, Math.min(...data.map(d => d.metric_value)) - 5);
        const range = maxVal - minVal;

        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (((d.metric_value - minVal) / range) * (height * 0.8)) - (height * 0.1);
            return [x, y];
        });

        return points.reduce((acc, point, i, a) => {
            if (i === 0) return `M ${point[0]},${point[1]}`;
            const cpsX = a[i - 1][0] + (point[0] - a[i - 1][0]) / 2;
            return `${acc} C ${cpsX},${a[i - 1][1]} ${cpsX},${point[1]} ${point[0]},${point[1]}`;
        }, '');
    };

    return (
        <div className="p-4 lg:p-8 overflow-y-auto pb-32">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">My Profile</h1>
                    <p className="text-[var(--text-secondary)]">Manage your information and track your body metrics</p>
                </header>

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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COL: Profile Info */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* ID Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden group"
                        >
                            <div className="absolute top-0 w-full h-24 bg-gradient-to-br from-primary/20 to-transparent"></div>
                            <div className="size-24 rounded-full bg-[var(--background)] border-4 border-[var(--surface)] flex items-center justify-center text-primary text-4xl font-bold mb-4 relative z-10 shadow-xl group-hover:scale-105 transition-transform duration-500">
                                {avatarLetter}
                            </div>
                            <h2 className="text-xl font-extrabold text-[var(--text-primary)] relative z-10">{displayName}</h2>
                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase mt-2 border border-green-500/20 relative z-10">
                                {profile.status}
                            </span>

                            <div className="w-full mt-6 pt-6 border-t border-[var(--border)] space-y-4 text-left relative z-10">
                                <div>
                                    <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold">Gym</label>
                                    <p className="text-[var(--text-primary)] font-bold flex items-center gap-2 mt-0.5">
                                        <span className="material-symbols-outlined text-primary text-[18px]">fitness_center</span>
                                        {profile.gym_name}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold">Membership</label>
                                        <p className="text-[var(--text-primary)] font-bold mt-0.5">{profile.membership_plan}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold">Member Since</label>
                                        <p className="text-[var(--text-primary)] font-bold mt-0.5">
                                            {new Date(profile.join_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Personal Details Editor */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    Details
                                </h3>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="text-primary text-sm font-bold hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-[var(--text-secondary)] px-2 py-1.5">Cancel</button>
                                        <button onClick={handleSaveProfile} disabled={saving} className="bg-primary text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:brightness-110">
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold">Full Name</label>
                                    {isEditing ? (
                                        <input type="text" value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] mt-1 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                                    ) : (
                                        <p className="text-[var(--text-primary)] font-bold text-sm mt-0.5">{profile.full_name}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold">Phone</label>
                                        {isEditing ? (
                                            <input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] mt-1 focus:border-primary outline-none" />
                                        ) : (
                                            <p className="text-[var(--text-primary)] font-bold text-sm mt-0.5">{profile.phone || '--'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold">Location</label>
                                        {isEditing ? (
                                            <input type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] mt-1 focus:border-primary outline-none" />
                                        ) : (
                                            <p className="text-[var(--text-primary)] font-bold text-sm mt-0.5">{profile.location || '--'}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold">Email</label>
                                    <p className="text-[var(--text-secondary)] font-medium text-sm mt-0.5">{profile.email}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COL: Progress & Body Metrics */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Body Metrics Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">vital_signs</span>
                                    Body Metrics
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-[var(--background)] p-4 rounded-2xl border border-[var(--border)]">
                                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold mb-1">Weight</p>
                                    <p className="text-2xl font-black text-[var(--text-primary)]">
                                        {currentWeight !== null ? currentWeight : '--'} <span className="text-sm text-[var(--text-secondary)]">kg</span>
                                    </p>
                                </div>
                                <div className="bg-[var(--background)] p-4 rounded-2xl border border-[var(--border)]">
                                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold mb-1">Height</p>
                                    <p className="text-2xl font-black text-[var(--text-primary)]">
                                        {currentHeight !== null ? currentHeight : '--'} <span className="text-sm text-[var(--text-secondary)]">cm</span>
                                    </p>
                                </div>
                                <div className="bg-[var(--background)] p-4 rounded-2xl border border-[var(--border)]">
                                    <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold mb-1">Body Fat</p>
                                    <p className="text-2xl font-black text-[var(--text-primary)]">
                                        {currentFat !== null ? currentFat : '--'} <span className="text-sm text-[var(--text-secondary)]">%</span>
                                    </p>
                                </div>
                                <div className="bg-[var(--background)] p-4 rounded-2xl border border-primary/20 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                                    <p className="text-[10px] text-primary uppercase tracking-widest font-bold mb-1 relative z-10">Calc BMI</p>
                                    <div className="relative z-10">
                                        <p className="text-2xl font-black text-[var(--text-primary)]">
                                            {currentBMI !== null ? currentBMI : '--'}
                                        </p>
                                        {currentBMI && (
                                            <p className={`text-[10px] font-bold uppercase tracking-wider ${getBMICategory(parseFloat(currentBMI)).color}`}>
                                                {getBMICategory(parseFloat(currentBMI)).label}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Visual Chart */}
                        {weightLogs.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 flex flex-col min-h-[300px]"
                            >
                                <h3 className="text-[var(--text-primary)] text-lg font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">show_chart</span>
                                    Weight History
                                </h3>
                                <div className="flex-1 relative w-full h-[200px]">
                                    <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="progGradientProf" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="var(--color-primary, #13ec13)" stopOpacity="0.3"></stop>
                                                <stop offset="100%" stopColor="var(--color-primary, #13ec13)" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d={`${getChartPath(800, 200, weightLogs)} V 200 H 0 Z`}
                                            fill="url(#progGradientProf)"
                                        />
                                        <path
                                            className="drop-shadow-[0_0_8px_rgba(19,236,19,0.5)]"
                                            d={getChartPath(800, 200, weightLogs)}
                                            fill="none"
                                            stroke="var(--color-primary, #13ec13)"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="4"
                                        />
                                        {weightLogs.map((d, i) => {
                                            const maxVal = Math.max(...weightLogs.map(val => val.metric_value)) + 5;
                                            const minVal = Math.max(0, Math.min(...weightLogs.map(val => val.metric_value)) - 5);
                                            const range = maxVal - minVal;
                                            const x = (i / (weightLogs.length - 1)) * 800;
                                            const y = 200 - (((d.metric_value - minVal) / range) * (200 * 0.8)) - (200 * 0.1);
                                            return (
                                                <circle key={i} cx={x} cy={y} r="5" fill="var(--surface)" stroke="var(--color-primary, #13ec13)" strokeWidth="3" />
                                            );
                                        })}
                                    </svg>
                                </div>
                            </motion.div>
                        )}

                        {/* Add New Entry Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6"
                        >
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">add_circle</span>
                                Log Progress
                            </h3>
                            <form onSubmit={handleLogMetrics} className="flex gap-4 items-end flex-wrap sm:flex-nowrap">
                                <div className="flex-1 min-w-[120px]">
                                    <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold block mb-1.5">Weight (kg)</label>
                                    <input
                                        type="number" step="0.1"
                                        value={weightInput} onChange={e => setWeightInput(e.target.value)}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-all"
                                        placeholder="e.g. 75.5"
                                    />
                                </div>
                                <div className="flex-1 min-w-[120px]">
                                    <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold block mb-1.5">Body Fat (%)</label>
                                    <input
                                        type="number" step="0.1"
                                        value={fatInput} onChange={e => setFatInput(e.target.value)}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-all"
                                        placeholder="e.g. 15.2"
                                    />
                                </div>
                                <div className="flex-1 min-w-[120px]">
                                    <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold block mb-1.5">Height (cm)</label>
                                    <input
                                        type="number" step="1"
                                        value={heightInput} onChange={e => setHeightInput(e.target.value)}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-all"
                                        placeholder={currentHeight ? currentHeight.toString() : "e.g. 180"}
                                    />
                                </div>
                                <button disabled={loggingProgress} type="submit" className="w-full sm:w-auto h-[46px] bg-primary text-black font-extrabold px-6 rounded-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2 shrink-0">
                                    {loggingProgress ? <span className="material-symbols-outlined animate-spin text-[20px]">sync</span> : <span className="material-symbols-outlined text-[20px]">save</span>}
                                    Save
                                </button>
                            </form>
                        </motion.div>

                    </div>

                    {/* FULL WIDTH BOTTOM: Trophy Room */}
                    <div className="lg:col-span-3 space-y-6 mt-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-br from-[var(--surface-highlight)] to-[var(--surface)] border border-yellow-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <span className="material-symbols-outlined text-[120px] text-yellow-500">trophy</span>
                            </div>

                            <h3 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2 flex items-center gap-3">
                                <span className="material-symbols-outlined text-yellow-500 text-3xl">emoji_events</span>
                                Trophy Room
                            </h3>
                            <p className="text-[var(--text-secondary)] mb-8 max-w-2xl">Complete workouts consistently to unlock exclusive gym badges and rank up your profile. Collect them all to reach Beast Mode.</p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {Object.values(BADGE_REGISTRY).map((badge) => {
                                    const isUnlocked = achievements.includes(badge.id);
                                    return (
                                        <div
                                            key={badge.id}
                                            className={`relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 ${isUnlocked
                                                ? `bg-[var(--background)] border-yellow-500/30 shadow-[0_4px_20px_-4px_rgba(234,179,8,0.15)] group hover:-translate-y-1`
                                                : 'bg-[var(--surface)] border-[var(--border)] opacity-40 grayscale hover:grayscale-0'
                                                }`}
                                            title={badge.description}
                                        >
                                            {/* Badge Icon */}
                                            <div className={`size-16 rounded-full flex items-center justify-center mb-3 transition-transform ${isUnlocked ? badge.color : 'bg-zinc-800 text-zinc-500'}`}>
                                                <span className={`material-symbols-outlined text-3xl ${isUnlocked ? 'group-hover:scale-110' : ''} transition-transform`}>
                                                    {isUnlocked ? badge.icon : 'lock'}
                                                </span>
                                            </div>

                                            {/* Badge Title */}
                                            <p className={`text-center font-bold text-sm leading-tight ${isUnlocked ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                                {badge.title}
                                            </p>

                                            {/* Locked state tooltip via CSS hover on parent */}
                                            {!isUnlocked && (
                                                <p className="opacity-0 group-hover:opacity-100 absolute -bottom-10 bg-black text-white text-[10px] w-[140%] text-center p-1.5 rounded pointer-events-none transition-opacity z-10 border border-zinc-800 shadow-xl">
                                                    {badge.description}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};
