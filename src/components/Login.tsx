import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

type UserRole = 'gym_admin' | 'member' | 'trainer' | 'super_admin' | 'platform_admin';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>('gym_admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, role: authRole, loading: authLoading } = useAuth();

    // Auto-redirect if already logged in
    useEffect(() => {
        if (!authLoading && user && authRole) {
            if (authRole === 'gym_admin') navigate('/admin');
            else if (authRole === 'member') navigate('/dashboard');
            else if (authRole === 'trainer') navigate('/trainer');
            else if (authRole === 'platform_admin' || authRole === 'super_admin') navigate('/platform-admin');
        }
    }, [user, authRole, authLoading, navigate]);

    const handleError = (err: any) => {
        const message = err.message || err.error_description || 'Authentication failed.';
        if (message === 'Invalid login credentials') {
            setError('Invalid email or password.');
        } else if (message.includes('already registered')) {
            setError('Email is already registered. Please login.');
        } else {
            setError(message);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;

                // Create profile for new user
                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .upsert([
                            {
                                id: data.user.id,
                                email: email,
                                role: selectedRole
                            }
                        ]);
                    if (profileError) {
                        console.error("Error creating profile:", profileError);
                        throw new Error(`Account created but profile setup failed: ${profileError.message}. Please contact support.`);
                    }
                }
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
            }
            // Navigation handled by useEffect
        } catch (err: any) {
            console.error("Auth error:", err);
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const { error: googleError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    redirectTo: window.location.origin + '/dashboard',
                }
            });
            if (googleError) throw googleError;
        } catch (err: unknown) {
            console.error("Google Auth error:", err);
            handleError(err as Error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 relative overflow-hidden font-display">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#13ec5b]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#13ec5b]/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md relative z-10 flex flex-col gap-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-[var(--surface)] border border-[var(--border)] mb-4 shadow-lg shadow-primary/10">
                        <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Smart Gym</h1>
                </div>

                <div className="bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)] grid grid-cols-2">
                    <button
                        onClick={() => setSelectedRole('gym_admin')}
                        className={`text-sm font-bold py-2.5 rounded-lg transition-all ${selectedRole === 'gym_admin' ? 'bg-primary text-[#052e16] shadow-lg shadow-primary/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        Admin Portal
                    </button>
                    <button
                        onClick={() => setSelectedRole('member')}
                        className={`text-sm font-bold py-2.5 rounded-lg transition-all ${selectedRole === 'member' ? 'bg-primary text-[#052e16] shadow-lg shadow-primary/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                    >
                        Member Area
                    </button>
                </div>

                <div className="bg-[var(--surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-[var(--text-secondary)] text-sm">
                            {isSignUp ? `Sign up as a new ${selectedRole}` : `Sign in to your ${selectedRole} account`}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[var(--text-secondary)] ml-1 uppercase tracking-wider">Email</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-11 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Password</label>
                                {!isSignUp && <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">Forgot?</a>}
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-11 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-[#0fd60f] text-[#052e16] font-bold py-3.5 rounded-xl transition-colors duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
                            ) : (
                                isSignUp ? 'Create Account' : 'Sign In'
                            )}
                        </motion.button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-[var(--border)]"></div>
                            <span className="flex-shrink-0 mx-4 text-[var(--text-secondary)] text-xs font-medium">OR CONTINUE WITH</span>
                            <div className="flex-grow border-t border-[var(--border)]"></div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: 'var(--surface-highlight)' }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] font-medium py-3 rounded-xl transition-colors duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                            <span>Google</span>
                        </motion.button>
                    </form>

                    <p className="text-center mt-6 text-[var(--text-secondary)] text-sm">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                            }}
                            className="text-primary font-bold hover:underline ml-1 focus:outline-none"
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
