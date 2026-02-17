import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { type User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const ProtectedRoute: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#111813] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#13ec5b] text-4xl animate-spin">progress_activity</span>
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};
