import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export const Analytics: React.FC = () => {
    const { gymId } = useAuth();
    const [revenue, setRevenue] = useState(0);
    const [activeMembers, setActiveMembers] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!gymId) return;

            try {
                // Fetch Total Revenue
                const { data: payments, error: pError } = await supabase
                    .from('payments')
                    .select('amount')
                    .eq('gym_id', gymId)
                    .eq('status', 'paid');

                if (pError) throw pError;
                const totalRev = (payments || []).reduce((acc: number, p: { amount: number }) => acc + p.amount, 0);
                setRevenue(totalRev);

                // Fetch Active Members
                const { count, error: mError } = await supabase
                    .from('members')
                    .select('*', { count: 'exact', head: true })
                    .eq('gym_id', gymId)
                    .eq('status', 'active');

                if (mError) throw mError;
                setActiveMembers(count || 0);

            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [gymId]);

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4 text-[var(--text-primary)]">
                        <div className="bg-primary/20 p-2 rounded-lg text-primary">
                            <span className="material-symbols-outlined">monitoring</span>
                        </div>
                        <h2 className="text-[var(--text-primary)] text-xl font-bold leading-tight tracking-tight">Performance Analytics</h2>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1 rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wider">Total Revenue</p>
                            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                <span className="material-symbols-outlined text-[20px]">attach_money</span>
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <p className="text-[var(--text-primary)] text-3xl font-bold tracking-tight">
                                {loading ? '...' : `$${revenue.toLocaleString()}`}
                            </p>
                        </div>
                        <p className="text-[var(--text-tertiary)] text-xs mt-1">Total collected</p>
                    </div>
                    <div className="flex flex-col gap-1 rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wider">Active Members</p>
                            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                <span className="material-symbols-outlined text-[20px]">groups</span>
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <p className="text-[var(--text-primary)] text-3xl font-bold tracking-tight">
                                {loading ? '...' : activeMembers.toLocaleString()}
                            </p>
                        </div>
                        <p className="text-[var(--text-tertiary)] text-xs mt-1">Current members</p>
                    </div>
                    <div className="flex flex-col gap-1 rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wider">Avg Visit Duration</p>
                            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                <span className="material-symbols-outlined text-[20px]">timer</span>
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <p className="text-[var(--text-primary)] text-3xl font-bold tracking-tight">64m</p>
                        </div>
                        <p className="text-[var(--text-tertiary)] text-xs mt-1">Est. baseline</p>
                    </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Member Churn Probability */}
                    <div className="col-span-1 lg:col-span-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-[var(--text-primary)] text-lg font-bold">Member Churn Probability</h3>
                                <p className="text-[var(--text-secondary)] text-sm">Risk analysis based on attendance patterns</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="size-2 rounded-full bg-[#fa5538]"></div>
                                    <span className="text-xs text-[var(--text-secondary)] font-medium">High Risk</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="size-2 rounded-full bg-primary"></div>
                                    <span className="text-xs text-[var(--text-secondary)] font-medium">Stable</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-end min-h-[200px]">
                            <div className="flex items-end justify-between gap-4 h-[180px] w-full relative">
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                    <div className="w-full h-px bg-[#28392e] border-t border-dashed border-[var(--border)]"></div>
                                    <div className="w-full h-px bg-[#28392e] border-t border-dashed border-[var(--border)]"></div>
                                    <div className="w-full h-px bg-[#28392e] border-t border-dashed border-[var(--border)]"></div>
                                    <div className="w-full h-px bg-[#28392e] border-t border-dashed border-[var(--border)]"></div>
                                </div>
                                <svg className="absolute bottom-0 left-0 right-0 h-full w-full overflow-visible z-10" preserveAspectRatio="none" viewBox="0 0 100 50">
                                    <defs>
                                        <linearGradient id="churnGradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#13ec5b" stopOpacity="0.2"></stop>
                                            <stop offset="100%" stopColor="#13ec5b" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,45 Q10,40 20,42 T40,30 T60,35 T80,20 T100,25 V50 H0 Z" fill="url(#churnGradient)"></path>
                                    <path d="M0,45 Q10,40 20,42 T40,30 T60,35 T80,20 T100,25" fill="none" stroke="#13ec5b" strokeLinecap="round" strokeWidth="0.8" vectorEffect="non-scaling-stroke"></path>
                                    <circle cx="80" cy="20" fill="#1e2a23" r="1.5" stroke="#fa5538" strokeWidth="0.8" vectorEffect="non-scaling-stroke"></circle>
                                </svg>
                            </div>
                            <div className="flex justify-between mt-4 px-2">
                                <span className="text-[11px] text-[var(--text-tertiary)] font-semibold">Week 1</span>
                                <span className="text-[11px] text-[var(--text-tertiary)] font-semibold">Week 2</span>
                                <span className="text-[11px] text-[var(--text-tertiary)] font-semibold">Week 3</span>
                                <span className="text-[11px] text-[var(--text-tertiary)] font-semibold">Week 4</span>
                            </div>
                        </div>
                    </div>
                    {/* Engagement Score */}
                    <div className="col-span-1 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 flex flex-col">
                        <h3 className="text-[var(--text-primary)] text-lg font-bold mb-1">Engagement Score</h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-6">Member activity breakdown</p>
                        <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
                            <div className="relative size-48 rounded-full" style={{ background: 'conic-gradient(#13ec5b 0% 65%, #ffffff 65% 85%, #3e5346 85% 100%)' }}>
                                <div className="absolute inset-4 bg-[var(--surface)] rounded-full flex flex-col items-center justify-center z-10">
                                    <span className="text-4xl font-extrabold text-[var(--text-primary)]">78%</span>
                                    <span className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wide mt-1">Avg Score</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="size-2.5 rounded-sm bg-primary"></div>
                                    <span className="text-sm text-[var(--text-secondary)]">Daily Users</span>
                                </div>
                                <span className="text-sm text-[var(--text-primary)] font-bold">65%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="size-2.5 rounded-sm bg-white"></div>
                                    <span className="text-sm text-[var(--text-secondary)]">Weekly</span>
                                </div>
                                <span className="text-sm text-[var(--text-primary)] font-bold">20%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="size-2.5 rounded-sm bg-[var(--surface-highlight)]"></div>
                                    <span className="text-sm text-[var(--text-secondary)]">Inactive</span>
                                </div>
                                <span className="text-sm text-[var(--text-primary)] font-bold">15%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Peak Hour Traffic */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-1 lg:col-span-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                            <div>
                                <h3 className="text-[var(--text-primary)] text-lg font-bold">Peak Hour Traffic</h3>
                                <p className="text-[var(--text-secondary)] text-sm">Average gym capacity by hour</p>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[var(--text-secondary)] text-sm">Peak:</span>
                                <span className="text-2xl font-bold text-[var(--text-primary)]">82%</span>
                                <span className="text-sm text-[var(--text-secondary)]">at 6 PM</span>
                            </div>
                        </div>
                        <div className="h-[220px] w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
                            {[
                                { time: '6am', height: '15%' },
                                { time: '8am', height: '35%' },
                                { time: '10am', height: '45%' },
                                { time: '12pm', height: '40%' },
                                { time: '2pm', height: '30%' },
                                { time: '4pm', height: '55%' },
                                { time: '6pm', height: '82%', isPeak: true },
                                { time: '8pm', height: '70%' },
                                { time: '10pm', height: '40%' }
                            ].map((bar, index) => (
                                <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                                    <div
                                        className={`w-full rounded-t-sm relative transition-all duration-300 ${bar.isPeak ? 'bg-primary shadow-[0_0_15px_rgba(19,236,91,0.3)]' : 'bg-[#28392e] group-hover:bg-primary/50'}`}
                                        style={{ height: bar.height }}
                                    >
                                        <div className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--background)] text-[var(--text-primary)] text-xs py-1 px-2 rounded border border-[var(--border)] ${!bar.isPeak && 'opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                                            {bar.height}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] sm:text-xs font-medium ${bar.isPeak ? 'text-primary font-bold' : 'text-[var(--text-tertiary)]'}`}>{bar.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
