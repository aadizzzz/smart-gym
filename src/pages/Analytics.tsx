import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';

interface AnalyticsData {
    revenue: number;
    activeMembers: number;
    avgVisitDuration: number;
    engagement: {
        daily: number;
        weekly: number;
        inactive: number;
        score: number;
    };
    peakHours: { time: string; count: number; heightPct: number; isPeak: boolean }[];
    weeklyTrend: { week: string; count: number }[];
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

export const Analytics: React.FC = () => {
    const { gymId } = useAuth();
    const [data, setData] = useState<AnalyticsData>({
        revenue: 0,
        activeMembers: 0,
        avgVisitDuration: 0,
        engagement: { daily: 0, weekly: 0, inactive: 0, score: 0 },
        peakHours: [],
        weeklyTrend: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!gymId) return;
            try {
                const today = new Date();
                const thirtyDaysAgo = new Date(today);
                thirtyDaysAgo.setDate(today.getDate() - 30);

                // Revenue
                const { data: payments } = await supabase
                    .from('payments')
                    .select('amount')
                    .eq('gym_id', gymId)
                    .eq('status', 'paid');
                const totalRev = (payments || []).reduce((acc: number, p: { amount: number }) => acc + Number(p.amount), 0);

                // Active Members
                const { count: activeMembersCount } = await supabase
                    .from('members')
                    .select('*', { count: 'exact', head: true })
                    .eq('gym_id', gymId)
                    .eq('status', 'Active');
                const activeCount = activeMembersCount || 1;

                // Attendance
                const { data: attendance } = await supabase
                    .from('attendance')
                    .select('member_id, check_in_time, check_out_time')
                    .eq('gym_id', gymId)
                    .gte('check_in_time', thirtyDaysAgo.toISOString());
                const records = attendance || [];

                // Avg Duration
                let totalDuration = 0, durationCount = 0;
                records.forEach(r => {
                    if (r.check_out_time && r.check_in_time) {
                        const mins = (new Date(r.check_out_time).getTime() - new Date(r.check_in_time).getTime()) / 60000;
                        if (mins > 0 && mins < 300) { totalDuration += mins; durationCount++; }
                    }
                });
                const avgDuration = durationCount > 0 ? Math.round(totalDuration / durationCount) : 0;

                // Engagement
                const now = today.getTime();
                const daily = new Set(records.filter(r => new Date(r.check_in_time).getTime() > now - 86400000).map(r => r.member_id)).size;
                const weekly = new Set(records.filter(r => new Date(r.check_in_time).getTime() > now - 604800000).map(r => r.member_id)).size;
                const monthly = new Set(records.map(r => r.member_id)).size;
                const inactive = Math.max(0, activeCount - monthly);

                // Peak Hours
                const hourCounts = new Array(24).fill(0);
                records.forEach(r => { hourCounts[new Date(r.check_in_time).getHours()]++; });
                const maxH = Math.max(...hourCounts, 1);
                const peakHours = [6, 8, 10, 12, 14, 16, 18, 20, 22].map(h => {
                    const count = hourCounts[h];
                    const heightPct = Math.round((count / maxH) * 100);
                    return {
                        time: `${h > 12 ? h - 12 : h}${h >= 12 ? 'pm' : 'am'}`,
                        count,
                        heightPct: Math.max(8, heightPct),
                        isPeak: heightPct === 100 && count > 0
                    };
                });

                // Weekly Trend
                const weeklyTrend = [];
                for (let i = 3; i >= 0; i--) {
                    const start = new Date(today); start.setDate(today.getDate() - i * 7 - 6); start.setHours(0, 0, 0, 0);
                    const end = new Date(today); end.setDate(today.getDate() - i * 7); end.setHours(23, 59, 59, 999);
                    const count = records.filter(r => { const t = new Date(r.check_in_time); return t >= start && t <= end; }).length;
                    weeklyTrend.push({ week: `Week ${4 - i}`, count });
                }

                setData({
                    revenue: totalRev,
                    activeMembers: activeCount,
                    avgVisitDuration: avgDuration,
                    engagement: {
                        daily: Math.round((daily / activeCount) * 100),
                        weekly: Math.round((weekly / activeCount) * 100),
                        inactive: Math.round((inactive / activeCount) * 100),
                        score: Math.min(100, Math.round((weekly / activeCount) * 100))
                    },
                    peakHours,
                    weeklyTrend
                });
            } catch (err) {
                console.error('Analytics fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [gymId]);

    const maxWeekly = Math.max(...data.weeklyTrend.map(w => w.count), 1);
    const { currency } = useCurrency();

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            style={{ padding: '1rem' }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Page Header */}
                <motion.div variants={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(19,236,91,0.15)', padding: '8px', borderRadius: '10px', color: '#13ec5b', flexShrink: 0 }}>
                        <span className="material-symbols-outlined">monitoring</span>
                    </div>
                    <h2 style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: 700, margin: 0 }}>
                        Performance Analytics
                    </h2>
                </motion.div>

                {/* KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    {/* Revenue */}
                    <motion.div variants={item} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Revenue</span>
                            <div style={{ background: 'rgba(19,236,91,0.15)', padding: '6px', borderRadius: '8px', color: '#13ec5b' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>attach_money</span>
                            </div>
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
                            {loading ? '—' : `${currency.symbol}${totalRev(data.revenue)}`}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>Total collected</div>
                    </motion.div>

                    {/* Active Members */}
                    <motion.div variants={item} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Members</span>
                            <div style={{ background: 'rgba(19,236,91,0.15)', padding: '6px', borderRadius: '8px', color: '#13ec5b' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>group</span>
                            </div>
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
                            {loading ? '—' : data.activeMembers}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>Current members</div>
                    </motion.div>

                    {/* Avg Visit */}
                    <motion.div variants={item} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg Visit Duration</span>
                            <div style={{ background: 'rgba(19,236,91,0.15)', padding: '6px', borderRadius: '8px', color: '#13ec5b' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>timer</span>
                            </div>
                        </div>
                        <div style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
                            {loading ? '—' : `${data.avgVisitDuration}m`}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>Based on check-outs</div>
                    </motion.div>
                </div>

                {/* Charts Row: Attendance + Engagement */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>

                    {/* Attendance Trend */}
                    <motion.div variants={item} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px 0' }}>Attendance Trend</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 20px 0' }}>Weekly check-ins for the last 4 weeks</p>
                        <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                            {data.weeklyTrend.length > 0 ? data.weeklyTrend.map((w, i) => {
                                const h = Math.max(6, Math.round((w.count / maxWeekly) * 100));
                                return (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                                        <div style={{ width: '100%', height: `${h}%`, background: 'rgba(19,236,91,0.25)', borderRadius: '6px 6px 0 0', transition: 'height 0.4s ease' }} />
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px', whiteSpace: 'nowrap' }}>{w.week}</span>
                                    </div>
                                );
                            }) : [1, 2, 3, 4].map(i => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                                    <div style={{ width: '100%', height: '30%', background: 'var(--surface-highlight)', borderRadius: '6px 6px 0 0', animation: 'pulse 1.5s infinite' }} />
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>—</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Engagement Score */}
                    <motion.div variants={item} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px 0' }}>Engagement Score</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 20px 0' }}>Active member participation</p>

                        {/* Donut — fixed inline px so it never collapses */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{
                                width: '152px',
                                height: '152px',
                                borderRadius: '50%',
                                flexShrink: 0,
                                background: `conic-gradient(#13ec5b 0% ${data.engagement.score}%, #1e3a2a ${data.engagement.score}% 100%)`,
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: '16px',
                                    background: 'var(--surface)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>
                                        {data.engagement.score}%
                                    </span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
                                        Weekly Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        {[
                            { label: 'Daily Users', val: data.engagement.daily, color: '#13ec5b' },
                            { label: 'Weekly Users', val: data.engagement.weekly, color: 'rgba(19,236,91,0.5)' },
                            { label: 'Inactive (30d)', val: data.engagement.inactive, color: '#1e3a2a' },
                        ].map(row => (
                            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: row.color, flexShrink: 0 }} />
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{row.label}</span>
                                </div>
                                <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 700 }}>{row.val}%</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Peak Hour Traffic — always scrollable */}
                <motion.div variants={item} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px 0' }}>Peak Hour Traffic</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 20px 0' }}>Check-in distribution by hour (last 30 days)</p>

                    {/* Scroll wrapper — overflow-x: auto with explicit minWidth on inner */}
                    <div style={{ overflowX: 'auto', overflowY: 'visible', WebkitOverflowScrolling: 'touch' }}>
                        <div style={{ minWidth: '480px', height: '180px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                            {data.peakHours.length > 0 ? data.peakHours.map((bar, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                                    <div style={{
                                        width: '100%',
                                        height: `${bar.heightPct}%`,
                                        background: bar.isPeak ? '#13ec5b' : '#1e3a2a',
                                        borderRadius: '6px 6px 0 0',
                                        boxShadow: bar.isPeak ? '0 0 12px rgba(19,236,91,0.4)' : 'none',
                                        transition: 'height 0.4s ease'
                                    }} />
                                    <span style={{
                                        color: bar.isPeak ? '#13ec5b' : 'var(--text-tertiary)',
                                        fontSize: '11px',
                                        fontWeight: bar.isPeak ? 700 : 400,
                                        whiteSpace: 'nowrap'
                                    }}>{bar.time}</span>
                                </div>
                            )) : Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                                    <div style={{ width: '100%', height: '30%', background: 'var(--surface-highlight)', borderRadius: '6px 6px 0 0' }} />
                                    <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>—</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
};

// Helper to format revenue
function totalRev(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toFixed(0);
}
