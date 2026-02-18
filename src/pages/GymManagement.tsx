import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

interface Plan {
    id: string;
    name: string;
    price: number;
    period: 'Monthly' | 'Quarterly' | 'Yearly';
    features: string[] | string; // Supabase returns jsonb, might be string or array
    active: boolean;
}

interface GymDetails {
    name: string;
    address: string;
    phone?: string;
    website?: string;
    contact_email?: string;
}

export const GymManagement: React.FC = () => {
    const { gymId } = useAuth();
    const { currency } = useCurrency();
    const [activeTab, setActiveTab] = useState<'profile' | 'plans' | 'facilities'>('profile');
    const [loading, setLoading] = useState(false);

    // Gym Profile State
    const [gymDetails, setGymDetails] = useState<GymDetails>({
        name: '',
        address: '',
        phone: '',
        website: '',
        contact_email: ''
    });

    // Plans State
    const [plans, setPlans] = useState<Plan[]>([]);
    const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

    useEffect(() => {
        if (gymId) {
            fetchGymDetails();
            fetchPlans();
        }
    }, [gymId]);

    const fetchGymDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('gyms')
                .select('name, address') // Add other fields if they exist in schema or jsonb
                .eq('id', gymId)
                .single();

            if (error) throw error;
            if (data) {
                setGymDetails(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error fetching gym details:', error);
        }
    };

    const fetchPlans = async () => {
        try {
            const { data, error } = await supabase
                .from('membership_plans')
                .select('*')
                .eq('gym_id', gymId)
                .order('price', { ascending: true });

            if (error) throw error;
            if (data) {
                // Ensure features is parsed correctly
                const parsedPlans = data.map(p => ({
                    ...p,
                    features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features
                }));
                setPlans(parsedPlans);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('gyms')
                .update({
                    name: gymDetails.name,
                    address: gymDetails.address
                    // Add other fields if schema supports them
                })
                .eq('id', gymId);

            if (error) throw error;
            alert('Gym profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handlePlanSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPlan) return;

        setLoading(true);
        try {
            const planData = {
                gym_id: gymId,
                name: editingPlan.name,
                price: editingPlan.price,
                period: editingPlan.period,
                features: JSON.stringify(Array.isArray(editingPlan.features) ? editingPlan.features : typeof editingPlan.features === 'string' ? (editingPlan.features as string).split(',').map(s => s.trim()) : []),
                active: editingPlan.active ?? true
            };

            if (editingPlan.id) {
                // Update
                const { error } = await supabase
                    .from('membership_plans')
                    .update(planData)
                    .eq('id', editingPlan.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('membership_plans')
                    .insert(planData);
                if (error) throw error;
            }

            setIsPlanModalOpen(false);
            setEditingPlan(null);
            fetchPlans();
        } catch (error) {
            console.error('Error saving plan:', error);
            alert('Failed to save plan.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlan = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;
        try {
            const { error } = await supabase
                .from('membership_plans')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchPlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Failed to delete plan.');
        }
    };

    return (
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto h-full custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Gym Management</h2>
                        <p className="text-[var(--text-secondary)] mt-1">Configure your facility details and offerings.</p>
                    </div>
                    <div className="flex p-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                        {(['profile', 'plans', 'facilities'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab
                                    ? 'bg-primary text-black shadow-md'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'profile' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <form onSubmit={handleProfileSubmit} className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 space-y-6">
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">General Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Gym Name</label>
                                        <input
                                            type="text"
                                            value={gymDetails.name}
                                            onChange={(e) => setGymDetails({ ...gymDetails, name: e.target.value })}
                                            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Contact Email</label>
                                        <input
                                            type="email"
                                            value={gymDetails.contact_email}
                                            onChange={(e) => setGymDetails({ ...gymDetails, contact_email: e.target.value })}
                                            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Address</label>
                                        <input
                                            type="text"
                                            value={gymDetails.address}
                                            onChange={(e) => setGymDetails({ ...gymDetails, address: e.target.value })}
                                            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Phone</label>
                                        <input
                                            type="tel"
                                            value={gymDetails.phone}
                                            onChange={(e) => setGymDetails({ ...gymDetails, phone: e.target.value })}
                                            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Website</label>
                                        <input
                                            type="url"
                                            value={gymDetails.website}
                                            onChange={(e) => setGymDetails({ ...gymDetails, website: e.target.value })}
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

                            {/* Branding Card */}
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 flex flex-col items-center text-center space-y-6">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Branding</h3>
                                <div className="relative group cursor-pointer">
                                    <div className="size-32 rounded-full bg-[var(--background)] border-2 border-dashed border-[var(--border)] flex items-center justify-center overflow-hidden">
                                        <span className="material-symbols-outlined text-4xl text-[var(--text-secondary)] group-hover:text-primary transition-colors">add_a_photo</span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-white text-xs font-bold">Change Logo</span>
                                    </div>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Upload your gym logo.<br />Recommended size: 512x512px.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'plans' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {plans.map((plan) => (
                                <div key={plan.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 relative group hover:border-primary/50 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-[var(--text-primary)]">{plan.name}</h3>
                                            <p className="text-sm text-[var(--text-secondary)]">{plan.period}</p>
                                        </div>
                                        <div className="bg-[var(--background)] px-3 py-1 rounded-lg">
                                            <span className="text-lg font-bold text-primary">{currency.symbol}{plan.price}</span>
                                            <span className="text-xs text-[var(--text-secondary)]">/{plan.period === 'Monthly' ? 'mo' : plan.period === 'Yearly' ? 'yr' : 'qtr'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {(Array.isArray(plan.features) ? plan.features : []).map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                                <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setEditingPlan(plan);
                                                setIsPlanModalOpen(true);
                                            }}
                                            className="flex-1 bg-[var(--surface-highlight)] hover:bg-[var(--border)] text-[var(--text-primary)] py-2.5 rounded-xl font-bold text-sm transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeletePlan(plan.id)}
                                            className="size-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Add Plan Card */}
                            <button
                                onClick={() => {
                                    setEditingPlan({ features: [] });
                                    setIsPlanModalOpen(true);
                                }}
                                className="bg-[var(--surface-highlight)]/30 border-2 border-dashed border-[var(--border)] rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:bg-[var(--surface-highlight)]/50 hover:border-primary/50 transition-all min-h-[300px] group"
                            >
                                <div className="size-16 rounded-full bg-[var(--surface)] flex items-center justify-center mb-4 text-[var(--text-secondary)] group-hover:text-primary group-hover:scale-110 transition-all shadow-sm">
                                    <span className="material-symbols-outlined text-3xl">add</span>
                                </div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Add New Plan</h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">Create a new membership tier.</p>
                            </button>
                        </div>
                    )}

                    {activeTab === 'facilities' && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="size-20 rounded-full bg-[var(--surface-highlight)] flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl text-[var(--text-secondary)]">construction</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Facilities Management Coming Soon</h3>
                            <p className="text-[var(--text-secondary)] mt-2 max-w-md">
                                Managing equipment, room booking, and maintenance schedules will be available in the next update.
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Plan Modal (Simple Implementation) */}
            {isPlanModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">{editingPlan?.id ? 'Edit Plan' : 'New Plan'}</h3>
                        <form onSubmit={handlePlanSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editingPlan?.name || ''}
                                    onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Price</label>
                                    <input
                                        type="number"
                                        required
                                        value={editingPlan?.price || ''}
                                        onChange={e => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) })}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Period</label>
                                    <select
                                        value={editingPlan?.period || 'Monthly'}
                                        onChange={e => setEditingPlan({ ...editingPlan, period: e.target.value as any })}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                    >
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                        <option value="Yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Features (comma separated)</label>
                                <textarea
                                    value={Array.isArray(editingPlan?.features) ? editingPlan?.features.join(', ') : editingPlan?.features || ''}
                                    onChange={e => setEditingPlan({ ...editingPlan, features: e.target.value.split(',').map(s => s.trim()) })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] h-24 resize-none"
                                    placeholder="Gym Access, Towel Service, ..."
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsPlanModalOpen(false)}
                                    className="flex-1 bg-transparent hover:bg-[var(--surface-highlight)] text-[var(--text-secondary)] py-2 rounded-lg font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-[#052e16] py-2 rounded-lg font-bold text-sm"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
