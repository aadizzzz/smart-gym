import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export const Onboarding: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [gymName, setGymName] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError('');

        try {
            // 1. Create the gym
            const { data: gymData, error: dbError } = await supabase
                .from('gyms')
                .insert([
                    {
                        name: gymName,
                        address: address,
                        owner_id: user.id
                    }
                ])
                .select()
                .maybeSingle();

            if (dbError) throw dbError;

            // 2. Link gym_id to user profile
            if (gymData) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ gym_id: gymData.id })
                    .eq('id', user.id);

                if (profileError) throw profileError;
            }

            // Redirect to admin dashboard on success
            navigate('/admin');
        } catch (err: unknown) {
            console.error('Error creating gym:', err);
            const message = err instanceof Error ? err.message : 'Failed to create gym. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-xl"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-4">
                        <span className="material-symbols-outlined text-2xl">fitness_center</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome to Smart Gym!</h1>
                    <p className="text-[var(--text-secondary)] mt-2">Let's set up your gym profile</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Gym Name</label>
                        <input
                            type="text"
                            required
                            value={gymName}
                            onChange={(e) => setGymName(e.target.value)}
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                            placeholder="e.g. Iron Paradise Fitness"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Address</label>
                        <textarea
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text-primary)] placeholder-gray-500 focus:border-primary focus:outline-none transition-colors min-h-[100px] resize-none"
                            placeholder="Where is your gym located?"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-lg bg-primary font-bold text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                    >
                        {loading ? 'Setting up...' : 'Complete Setup'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
