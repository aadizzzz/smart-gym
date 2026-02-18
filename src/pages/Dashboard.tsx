import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

interface DashboardStats {
    activeMembers: number;
    monthlyRevenue: number;
    expiringSoon: number;
    attendanceToday: number;
}

interface ChartData {
    month: string;
    revenue: number;
}

interface NewLead {
    id: string;
    name: string;
    email: string;
    created_at: string;
    status: string;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export const Dashboard: React.FC = () => {
    const { gymId } = useAuth();
    const { currency } = useCurrency();
    const [stats, setStats] = useState<DashboardStats>({
        activeMembers: 0,
        monthlyRevenue: 0,
        expiringSoon: 0,
        attendanceToday: 0
    });
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [leads, setLeads] = useState<NewLead[]>([]);

    useEffect(() => {
        if (gymId) {
            fetchDashboardData();
        }
    }, [gymId]);

    const fetchDashboardData = async () => {
        try {
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();

            // 1. Active Members
            const { count: activeMembers } = await supabase
                .from('members')
                .select('*', { count: 'exact', head: true })
                .eq('gym_id', gymId)
                .eq('status', 'Active');

            // 2. Monthly Revenue
            const { data: payments } = await supabase
                .from('payments')
                .select('amount')
                .eq('gym_id', gymId)
                .gte('payment_date', startOfMonth);

            const monthlyRevenue = payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;

            // 3. Expiring Soon (Next 7 days)
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            const { count: expiringSoon } = await supabase
                .from('members')
                .select('*', { count: 'exact', head: true })
                .eq('gym_id', gymId)
                .gt('expiry_date', today.toISOString())
                .lte('expiry_date', nextWeek.toISOString());

            // 4. Attendance Today
            const { count: attendanceToday } = await supabase
                .from('attendance')
                .select('*', { count: 'exact', head: true })
                .eq('gym_id', gymId)
                .gte('check_in_time', startOfDay);

            setStats({
                activeMembers: activeMembers || 0,
                monthlyRevenue: monthlyRevenue,
                expiringSoon: expiringSoon || 0,
                attendanceToday: attendanceToday || 0
            });

            // 5. Recent Leads
            const { data: recentLeads } = await supabase
                .from('leads')
                .select('id, name, email, created_at, status')
                .eq('gym_id', gymId)
                .order('created_at', { ascending: false })
                .limit(5);

            if (recentLeads) setLeads(recentLeads as any);

            // 6. Chart Data (Last 6 Months)
            await fetchChartData();

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const fetchChartData = async () => {
        // Generate last 6 month labels
        const months: { name: string; date: Date; revenue: number }[] = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({
                name: d.toLocaleString('default', { month: 'short' }),
                date: d,
                revenue: 0
            });
        }

        const sixMonthsAgo = months[0].date.toISOString();

        const { data: historicalPayments } = await supabase
            .from('payments')
            .select('amount, payment_date')
            .eq('gym_id', gymId)
            .gte('payment_date', sixMonthsAgo);

        if (historicalPayments) {
            historicalPayments.forEach(payment => {
                const pDate = new Date(payment.payment_date);
                const monthIndex = months.findIndex(m =>
                    m.date.getMonth() === pDate.getMonth() &&
                    m.date.getFullYear() === pDate.getFullYear()
                );
                if (monthIndex !== -1) {
                    months[monthIndex].revenue += Number(payment.amount);
                }
            });
        }

        setChartData(months.map(m => ({ month: m.name, revenue: m.revenue })));
    };

    // Helper for smooth curve
    const getSmoothPath = (width: number, height: number) => {
        if (chartData.length < 2) return '';
        const maxRevenue = Math.max(...chartData.map(d => d.revenue), 100);
        const points = chartData.map((d, i) => {
            const x = (i / (chartData.length - 1)) * width;
            const y = height - ((d.revenue / maxRevenue) * (height * 0.8)) - (height * 0.1); // padding
            return [x, y];
        });

        return points.reduce((acc, point, i, a) => {
            if (i === 0) return `M ${point[0]},${point[1]}`;
            const cpsX = a[i - 1][0] + (point[0] - a[i - 1][0]) / 2; // Control Point Start X
            return `${acc} C ${cpsX},${a[i - 1][1]} ${cpsX},${point[1]} ${point[0]},${point[1]}`;
        }, '');
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 overflow-y-auto p-4 lg:p-8 pb-20 text-[var(--text-primary)] custom-scrollbar"
        >
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Active Members */}
                <motion.div variants={item} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-[#3b543b] transition-colors relative group overflow-hidden">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-[var(--text-primary)]">groups</span>
                    </div>
                    <div className="flex flex-col gap-1 relative z-10">
                        <p className="text-[var(--text-secondary)] text-sm font-medium">Active Members</p>
                        <div className="flex items-end gap-3">
                            <h3 className="text-[var(--text-primary)] text-3xl font-bold">{stats.activeMembers}</h3>
                            <span className="text-primary text-sm font-medium mb-1 flex items-center bg-primary/10 px-1.5 py-0.5 rounded">
                                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                Live
                            </span>
                        </div>
                    </div>
                </motion.div>
                {/* Monthly Revenue */}
                <motion.div variants={item} className="bg-[var(--surface)] border border-primary/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(19,236,19,0.05)] relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 size-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
                    <div className="flex flex-col gap-1 relative z-10">
                        <p className="text-primary text-sm font-medium">Monthly Revenue</p>
                        <div className="flex items-end gap-3">
                            <h3 className="text-[var(--text-primary)] text-3xl font-bold">{currency.symbol}{stats.monthlyRevenue.toLocaleString()}</h3>
                            <span className="text-primary text-sm font-medium mb-1 flex items-center bg-primary/10 px-1.5 py-0.5 rounded">
                                <span className="material-symbols-outlined text-[16px]">payments</span>
                                MTD
                            </span>
                        </div>
                    </div>
                </motion.div>
                {/* Expiring Soon */}
                <motion.div variants={item} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-[#ef4444]/50 transition-colors relative group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-[#ef4444]">warning</span>
                    </div>
                    <div className="flex flex-col gap-1 relative z-10">
                        <p className="text-[#ef4444] text-sm font-medium">Expiring Soon</p>
                        <div className="flex items-end gap-3">
                            <h3 className="text-[var(--text-primary)] text-3xl font-bold">{stats.expiringSoon}</h3>
                            <span className="text-[#ef4444] text-sm font-medium mb-1 flex items-center bg-[#ef4444]/10 px-1.5 py-0.5 rounded">
                                Needs Action
                            </span>
                        </div>
                    </div>
                </motion.div>
                {/* Attendance Today */}
                <motion.div variants={item} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-[#3b543b] transition-colors relative group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-[var(--text-primary)]">how_to_reg</span>
                    </div>
                    <div className="flex flex-col gap-1 relative z-10">
                        <p className="text-[var(--text-secondary)] text-sm font-medium">Attendance Today</p>
                        <div className="flex items-end gap-3">
                            <h3 className="text-[var(--text-primary)] text-3xl font-bold">{stats.attendanceToday}</h3>
                            <span className="text-primary text-sm font-medium mb-1 flex items-center bg-primary/10 px-1.5 py-0.5 rounded">
                                <span className="material-symbols-outlined text-[16px]">today</span>
                                Today
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Section */}
                <motion.div variants={item} className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-[var(--text-primary)] text-lg font-bold">Revenue Overview</h3>
                            <p className="text-[var(--text-secondary)] text-sm">Income analytics for the last 6 months</p>
                        </div>
                        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm bg-[var(--surface-highlight)] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                            Last 6 Months <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                        </button>
                    </div>
                    <div className="flex-1 w-full min-h-[300px] relative">
                        {/* SVG Chart */}
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 800 300" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            <line stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="225" y2="225"></line>
                            <line stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
                            <line stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="75" y2="75"></line>

                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#13ec13" stopOpacity="0.2"></stop>
                                    <stop offset="100%" stopColor="#13ec13" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>

                            {/* Area Path */}
                            <path
                                d={`${getSmoothPath(800, 300)} V 300 H 0 Z`}
                                fill="url(#chartGradient)"
                            />
                            {/* Line Path */}
                            <path
                                className="drop-shadow-[0_0_10px_rgba(19,236,19,0.5)]"
                                d={getSmoothPath(800, 300)}
                                fill="none"
                                stroke="#13ec13"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                            />

                            {/* Data Points */}
                            {chartData.map((d, i) => {
                                const maxRevenue = Math.max(...chartData.map(val => val.revenue), 100);
                                const x = (i / (chartData.length - 1)) * 800;
                                const y = 300 - ((d.revenue / maxRevenue) * (300 * 0.8)) - (300 * 0.1);
                                return (
                                    <circle key={i} cx={x} cy={y} r="4" fill="var(--surface)" stroke="#13ec13" strokeWidth="2" />
                                );
                            })}
                        </svg>

                        {/* X-Axis Labels - Correctly Aligned */}
                        <div className="flex justify-between w-full text-[var(--text-secondary)] text-xs font-medium mt-4 absolute bottom-[-20px] left-0 right-0">
                            {chartData.map((d, i) => (
                                <div key={i} className="flex flex-col items-center" style={{ width: `${100 / chartData.length}%` }}>
                                    <span>{d.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Leads Section */}
                <motion.div variants={item} className="lg:col-span-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[var(--text-primary)] text-lg font-bold">New Leads</h3>
                        <a href="/admin/leads" className="text-primary text-sm hover:underline">View All</a>
                    </div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-2 overflow-y-auto"
                    >
                        {leads.length > 0 ? (
                            leads.map((lead) => (
                                <motion.div variants={item} key={lead.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-[var(--surface-highlight)] transition-colors cursor-pointer border border-transparent hover:border-[var(--border)]">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                                            {lead.name ? lead.name.substring(0, 2) : (lead.email ? lead.email.substring(0, 2) : '??')}
                                        </div>
                                        <div>
                                            <p className="text-[var(--text-primary)] text-sm font-medium group-hover:text-primary transition-colors truncate w-32">
                                                {lead.name || lead.email}
                                            </p>
                                            <p className="text-[var(--text-secondary)] text-xs">{new Date(lead.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-[var(--surface-highlight)] text-[var(--text-secondary)]'
                                        }`}>
                                        {lead.status}
                                    </span>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-[var(--text-secondary)] text-sm">No new leads within the last 30 days.</p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-between items-center text-[var(--text-secondary)] text-xs">
                <p>© {new Date().getFullYear()} FitLogic Pro System. All rights reserved.</p>
                <div className="flex gap-4">
                    <a className="hover:text-primary transition-colors" href="#">Privacy</a>
                    <a className="hover:text-primary transition-colors" href="#">Terms</a>
                    <a className="hover:text-primary transition-colors" href="#">Support</a>
                </div>
            </div>
        </motion.div>
    );
};
