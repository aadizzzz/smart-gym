import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type UserRole = 'admin' | 'member';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [role, setRole] = useState<UserRole>('admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                // Since email confirmation is on by default in Supabase, 
                // we might want to tell the user to check their email.
                // For now, let's assume auto-confirm is off or we handle it gracefully.
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }

            // Redirect based on role
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
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
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    redirectTo: window.location.origin + (role === 'admin' ? '/admin' : '/'),
                }
            });
            if (error) throw error;

        } catch (err: any) {
            console.error("Google Auth error:", err);
            handleError(err);
            setLoading(false);
        }
    };

    const handleError = (err: any) => {
        if (err.message === 'Invalid login credentials') {
            setError('Invalid email or password.');
        } else if (err.message.includes('already registered')) {
            setError('Email is already registered. Please login.');
        } else {
            setError(err.message || 'Authentication failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#111813] flex items-center justify-center p-4 relative overflow-hidden font-display">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#13ec5b]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#13ec5b]/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md relative z-10 flex flex-col gap-6">
                {/* Logo */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-[#1e2a23] border border-[#28392e] mb-4 shadow-lg shadow-[#13ec5b]/10">
                        <span className="material-symbols-outlined text-[#13ec5b] text-3xl">fitness_center</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Smart Gym</h1>
                </div>

                {/* Role Toggles */}
                <div className="bg-[#1e2a23] p-1 rounded-xl border border-[#28392e] grid grid-cols-2">
                    <button
                        onClick={() => setRole('admin')}
                        className={`text-sm font-bold py-2.5 rounded-lg transition-all ${role === 'admin' ? 'bg-[#13ec5b] text-[#052e16] shadow-lg shadow-[#13ec5b]/20' : 'text-[#9db9a6] hover:text-white'}`}
                    >
                        Admin Portal
                    </button>
                    <button
                        onClick={() => setRole('member')}
                        className={`text-sm font-bold py-2.5 rounded-lg transition-all ${role === 'member' ? 'bg-[#13ec5b] text-[#052e16] shadow-lg shadow-[#13ec5b]/20' : 'text-[#9db9a6] hover:text-white'}`}
                    >
                        Member Area
                    </button>
                </div>

                {/* Main Card */}
                <div className="bg-[#1e2a23]/80 backdrop-blur-xl border border-[#28392e] rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-white mb-1">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-[#9db9a6] text-sm">
                            {isSignUp ? `Sign up as a new ${role}` : `Sign in to your ${role} account`}
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
                            <label className="text-xs font-bold text-[#9db9a6] ml-1 uppercase tracking-wider">Email</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c6f62] group-focus-within:text-[#13ec5b] transition-colors material-symbols-outlined text-[20px]">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#111813] border border-[#28392e] rounded-xl px-11 py-3 text-white placeholder-[#5c6f62] focus:outline-none focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-[#9db9a6] uppercase tracking-wider">Password</label>
                                {!isSignUp && <a href="#" className="text-xs font-medium text-[#13ec5b] hover:text-[#13ec5b]/80 transition-colors">Forgot?</a>}
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c6f62] group-focus-within:text-[#13ec5b] transition-colors material-symbols-outlined text-[20px]">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#111813] border border-[#28392e] rounded-xl px-11 py-3 text-white placeholder-[#5c6f62] focus:outline-none focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#13ec5b] hover:bg-[#0fd60f] text-[#052e16] font-bold py-3.5 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-[#13ec5b]/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span>
                            ) : (
                                isSignUp ? 'Create Account' : 'Sign In'
                            )}
                        </button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-[#28392e]"></div>
                            <span className="flex-shrink-0 mx-4 text-[#5c6f62] text-xs font-medium">OR CONTINUE WITH</span>
                            <div className="flex-grow border-t border-[#28392e]"></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full bg-[#111813] hover:bg-[#1a241d] border border-[#28392e] text-white font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                            <span>Google</span>
                        </button>
                    </form>

                    <p className="text-center mt-6 text-[#9db9a6] text-sm">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                            }}
                            className="text-[#13ec5b] font-bold hover:underline ml-1 focus:outline-none"
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
