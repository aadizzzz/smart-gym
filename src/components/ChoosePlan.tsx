import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

interface Plan {
    id: string;
    name: string;
    price: number;
    duration: string;
    features: string[];
}

export const ChoosePlan: React.FC = () => {
    const { user, gymId, refreshAuth } = useAuth();
    const navigate = useNavigate();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            if (!gymId) return;
            try {
                const { data, error } = await supabase
                    .from('membership_plans')
                    .select('*')
                    .eq('gym_id', gymId);

                if (error) {
                    console.error('Error fetching plans:', error);
                    // Fallback to demo plans if table doesn't exist or is empty
                    setPlans([
                        { id: 'basic', name: 'Basic', price: 29, duration: 'Month', features: ['Gym Access', 'Lockers'] },
                        { id: 'pro', name: 'Pro', price: 59, duration: 'Month', features: ['Gym Access', 'Trainer Support', 'Pool'] }
                    ]);
                } else {
                    setPlans(data || []);
                }
            } catch (err) {
                console.error('Exception fetching plans:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, [gymId]);

    const handleSelectPlan = async (plan: Plan) => {
        if (!user || !gymId) return;
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('members')
                .insert([
                    {
                        user_id: user.id,
                        gym_id: gymId,
                        membership_plan: plan.name,
                        status: 'active',
                        join_date: new Date().toISOString(),
                        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Default 30 days
                    }
                ]);

            if (error) throw error;

            await refreshAuth();
            navigate('/dashboard');
        } catch (err) {
            console.error('Error joining gym:', err);
            alert('Failed to subscribe to plan. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!gymId) {
        return <button onClick={() => navigate('/choose-gym')}>Go back to gym selection</button>;
    }

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-[var(--text-primary)]">Choose Your Plan</h1>
                    <p className="text-[var(--text-secondary)] mt-3 text-lg text-pretty">Select a membership plan to activate your account</p>
                </div>

                {loading ? (
                    <div className="py-20 text-center">
                        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 flex flex-col hover:border-primary/50 transition-all shadow-xl group"
                            >
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-extrabold text-primary">${plan.price}</span>
                                        <span className="text-[var(--text-secondary)] text-sm font-medium">/{plan.duration.toLowerCase()}</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {(plan.features || []).map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                            <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => !submitting && handleSelectPlan(plan)}
                                    disabled={submitting}
                                    className="w-full py-4 rounded-2xl bg-primary text-black font-bold hover:bg-green-600 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {submitting ? 'Processing...' : 'Select Plan'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};
