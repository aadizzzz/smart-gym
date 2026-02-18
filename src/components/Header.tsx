import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const Header: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { user, role, gymName, signOut } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
        setIsMenuOpen(false);
    };

    // Helper to get initials
    const getInitials = (email: string | undefined) => {
        if (!email) return 'U';
        return email.substring(0, 2).toUpperCase();
    };

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/80 px-6 py-4 backdrop-blur-md lg:px-10 transition-colors duration-300">
            <div className="flex items-center gap-3 text-[var(--text-primary)]">
                <Link to="/" className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[28px]">fitness_center</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight">Smart Gym</h2>
                        {gymName && (
                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider leading-none mt-0.5">{gymName}</p>
                        )}
                    </div>
                </Link>
            </div>

            <nav className="hidden md:flex items-center gap-8">
                <Link to="/features" className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-primary">Features</Link>
                <Link to="/pricing" className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-primary">Pricing</Link>
                <Link to="/resources" className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-primary">Resources</Link>
            </nav>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex size-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-highlight)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-highlight)]/80"
                    aria-label="Toggle Theme"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>

                {user && (role === 'gym_admin' || role === 'admin') && (
                    <Link
                        to="/admin"
                        className="hidden lg:flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">dashboard</span>
                        Dashboard
                    </Link>
                )}

                {user ? (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 pr-3 hover:bg-[var(--surface-highlight)] transition-colors"
                        >
                            <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                                {getInitials(user.email)}
                            </div>
                            <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block">Profile</span>
                            <span className="material-symbols-outlined text-[20px] text-[var(--text-secondary)]">
                                {isMenuOpen ? 'expand_less' : 'expand_more'}
                            </span>
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                                    <p className="text-xs font-medium text-[var(--text-secondary)]">Signed in as</p>
                                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">{user.email}</p>
                                    <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded mt-1 inline-block">
                                        {role?.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    {role === 'gym_admin' && (
                                        <>
                                            <Link
                                                to="/admin"
                                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-highlight)] hover:text-[var(--text-primary)] transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                                                Manage Gym
                                            </Link>
                                            <Link
                                                to="/admin/members"
                                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-highlight)] hover:text-[var(--text-primary)] transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">group_add</span>
                                                Add Members
                                            </Link>
                                            <Link
                                                to="/admin/analytics"
                                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-highlight)] hover:text-[var(--text-primary)] transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">analytics</span>
                                                Revenue
                                            </Link>
                                        </>
                                    )}
                                    {role === 'member' && (
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-highlight)] hover:text-[var(--text-primary)] transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">person</span>
                                            My Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleSignOut}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors text-left"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">logout</span>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="hidden sm:flex h-9 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-bold text-[var(--text-secondary)] transition-colors hover:text-primary">
                            Gym Login
                        </Link>
                        <Link to="/login" className="flex h-10 cursor-pointer items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-white transition-all hover:bg-green-600 active:scale-95 shadow-md shadow-primary/20">
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};
