import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

interface Gym {
    id: string;
    name: string;
    address: string;
}

export const ChooseGym: React.FC = () => {
    const { user, refreshAuth } = useAuth();
    const navigate = useNavigate();
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectingId, setSelectingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const { data, error } = await supabase
                    .from('gyms')
                    .select('id, name, address');

                if (error) throw error;
                setGyms(data || []);
            } catch (err) {
                console.error('Error fetching gyms:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGyms();
    }, []);

    const handleSelect = async (gymId: string) => {
        if (!user) return;
        setSelectingId(gymId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ gym_id: gymId })
                .eq('id', user.id);

            if (error) throw error;

            await refreshAuth();
            navigate('/choose-plan');
        } catch (err) {
            console.error('Error selecting gym:', err);
            alert('Failed to select gym. Please try again.');
        } finally {
            setSelectingId(null);
        }
    };

    const filteredGyms = gyms.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">Find Your Gym</h1>
                    <p className="text-[var(--text-secondary)] mt-3 text-lg">Select the gym you want to join to continue</p>
                </div>

                <div className="relative mb-8">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--text-secondary)]">search</span>
                    <input
                        type="text"
                        placeholder="Search by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl pl-12 pr-4 py-4 text-[var(--text-primary)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-xl"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="col-span-full py-20 text-center text-[var(--text-secondary)]">
                            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                            <p className="mt-4 font-medium">Finding nearby gyms...</p>
                        </div>
                    ) : filteredGyms.length > 0 ? (
                        filteredGyms.map(gym => (
                            <motion.div
                                key={gym.id}
                                whileHover={{ y: -4 }}
                                onClick={() => !selectingId && handleSelect(gym.id)}
                                className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl cursor-pointer hover:border-primary/50 transition-all flex flex-col gap-3 group"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-primary transition-colors">{gym.name}</h3>
                                    {selectingId === gym.id && (
                                        <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                                    )}
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    {gym.address}
                                </p>
                                <div className="mt-2 text-xs font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Select Gym</div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-[var(--text-secondary)] border border-dashed border-[var(--border)] rounded-2xl">
                            <p>No gyms found matching your search.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
