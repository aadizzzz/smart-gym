import React, { createContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { type User } from '@supabase/supabase-js';

type AuthState = {
    user: User | null;
    role: string | null;
    gymId: string | null;
    userName: string | null;
    gymName: string | null;
    hasMembership: boolean;
    loading: boolean;
};

type AuthContextType = AuthState & {
    signOut: () => Promise<void>;
    refreshAuth: () => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        role: null,
        gymId: null,
        userName: null,
        gymName: null,
        hasMembership: false,
        loading: true,
    });

    // Helper to clear state
    const clearState = () => {
        setState({
            user: null,
            role: null,
            gymId: null,
            userName: null,
            gymName: null,
            hasMembership: false,
            loading: false,
        });
    }

    const fetchUserData = async (userId: string, retries = 0) => {
        try {
            // 1. Fetch Profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role, gym_id')
                .eq('id', userId)
                .maybeSingle();

            if (profileError) throw profileError;

            // Retry logic if the database trigger is still processing
            if (!profile && retries < 2) {
                const delay = 500 * Math.pow(2, retries);
                console.log(`Profile not found. Retrying in ${delay}ms... (Attempt ${retries + 1}/2)`);
                setTimeout(() => fetchUserData(userId, retries + 1), delay);
                return;
            }

            console.log("AuthContext Fetched Profile:", profile);

            const userRole = profile?.role ?? 'member';
            const userGymId = profile?.gym_id ?? null;
            // Removed full_name since it doesn't exist in the table apparently
            const full_name = null;

            let fetchedGymName = null;
            let fetchedHasMembership = false;

            // 2. Fetch Gym Name if applicable
            if (userGymId) {
                const { data: gym } = await supabase
                    .from('gyms')
                    .select('name')
                    .eq('id', userGymId)
                    .maybeSingle();

                fetchedGymName = gym?.name ?? null;
            }

            // 3. Check Membership if they are a member and have a gym
            if (userRole === 'member' && userGymId) {
                const { data: member } = await supabase
                    .from('members')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('gym_id', userGymId)
                    .maybeSingle();

                fetchedHasMembership = !!member;
            }

            setState(prev => ({
                ...prev,
                role: userRole,
                gymId: userGymId,
                userName: full_name,
                gymName: fetchedGymName,
                hasMembership: fetchedHasMembership,
                loading: false,
            }));

        } catch (err) {
            console.error('Exception fetching user data:', err);
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        let mounted = true;

        // One-time subscription setup
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;

            const currentUser = session?.user ?? null;

            if (currentUser) {
                // Determine if we need to fetch data. 
                // If user ID changed, or if we are not loaded.
                setState(prev => {
                    if (prev.user?.id === currentUser.id && !prev.loading) return prev;
                    return { ...prev, user: currentUser, loading: true };
                });

                // Check for role param from OAuth redirect
                const params = new URLSearchParams(window.location.search);
                const roleParam = params.get('role');
                if (roleParam) {
                    try {
                        const { error } = await supabase.rpc('set_initial_oauth_role', { selected_role: roleParam });
                        if (error) console.error("Failed to set OAuth role on backend:", error);
                        // Clean URL without refreshing page
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } catch (e) {
                        console.error("Exception setting OAuth role:", e);
                    }
                }

                // Small delay to allow session to settle
                setTimeout(() => fetchUserData(currentUser.id, 0), 50);
            } else {
                clearState();
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const refreshAuth = async () => {
        if (state.user) {
            setState(prev => ({ ...prev, loading: true }));
            await fetchUserData(state.user.id);
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, signOut, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
