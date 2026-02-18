import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const GOAL_OPTIONS = [
    { id: 'weight_loss', label: 'Lose Weight', icon: 'monitor_weight' },
    { id: 'muscle_build', label: 'Build Muscle', icon: 'fitness_center' },
    { id: 'endurance', label: 'Improve Endurance', icon: 'directions_run' },
    { id: 'flexibility', label: 'Flexibility & Mobility', icon: 'self_improvement' },
];

const TARGET_AREAS = [
    { id: 'arms', label: 'Arms' },
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back' },
    { id: 'legs', label: 'Legs' },
    { id: 'abs', label: 'Abs / Core' },
    { id: 'full_body', label: 'Full Body' },
];

export const ChooseGoals: React.FC = () => {
    const { user, refreshAuth } = useAuth();
    console.log("ChooseGoals component mounted");
    const navigate = useNavigate();
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleSelection = (list: string[], setList: (l: string[]) => void, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);

        try {
            const fitnessGoals = {
                goals: selectedGoals,
                targets: selectedTargets
            };

            const { error } = await supabase
                .from('profiles')
                .update({
                    fitness_goals: fitnessGoals,
                    onboarding_completed: true
                })
                .eq('id', user.id);

            if (error) throw error;

            await refreshAuth();
            navigate('/dashboard'); // Go to Member Dashboard
        } catch (err) {
            console.error('Error saving goals:', err);
            alert('Failed to save goals. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-xl"
            >
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2 text-center">What are your goals?</h1>
                <p className="text-[var(--text-secondary)] text-center mb-8">Let us know what you want to achieve so we can tailor your experience.</p>

                <div className="space-y-8">
                    {/* Primary Goals */}
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">flag</span>
                            Primary Focus
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {GOAL_OPTIONS.map(goal => (
                                <button
                                    key={goal.id}
                                    onClick={() => toggleSelection(selectedGoals, setSelectedGoals, goal.id)}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedGoals.includes(goal.id)
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-[var(--border)] hover:border-primary/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    <span className="material-symbols-outlined">{goal.icon}</span>
                                    <span className="font-medium">{goal.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Target Areas */}
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">accessibility_new</span>
                            Target Areas
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {TARGET_AREAS.map(area => (
                                <button
                                    key={area.id}
                                    onClick={() => toggleSelection(selectedTargets, setSelectedTargets, area.id)}
                                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selectedTargets.includes(area.id)
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-[var(--border)] hover:border-primary/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    {area.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex justify-end gap-4">
                    <button
                        className="px-6 py-3 rounded-xl font-bold bg-primary text-white shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSave}
                        disabled={loading || selectedGoals.length === 0}
                    >
                        {loading ? 'Saving...' : 'Finish Setup'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
