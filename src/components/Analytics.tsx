import React from 'react';
import { AdminLayout } from './AdminLayout';

export const Analytics: React.FC = () => {
    return (
        <AdminLayout>
            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
                    {/* Header for Analytics - overriding the default header title in layout if needed, 
              but since we reuse layout, we might just put this content inside. 
              The layout has a header already, so we might want to customize or suppress it.
              For now, let's put the specific Analytics content here.
           */}

                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4 text-white">
                            <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                <span className="material-symbols-outlined">monitoring</span>
                            </div>
                            <h2 className="text-white text-xl font-bold leading-tight tracking-tight">Performance Analytics</h2>
                        </div>
                        <div className="hidden md:flex items-center bg-[#1e2a23] rounded-lg px-3 py-1.5 border border-[#28392e]">
                            <span className="material-symbols-outlined text-[#9db9a6] text-[20px]">calendar_today</span>
                            <span className="text-white text-sm font-medium ml-2">Oct 1 - Oct 31, 2023</span>
                            <span className="material-symbols-outlined text-[#9db9a6] text-[18px] ml-2 cursor-pointer">expand_more</span>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1 rounded-2xl p-6 bg-[#1e2a23] border border-[#28392e] shadow-sm hover:border-primary/30 transition-colors">
                            <div className="flex justify-between items-start">
                                <p className="text-[#9db9a6] text-sm font-medium uppercase tracking-wider">Total Revenue</p>
                                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                    <span className="material-symbols-outlined text-[20px]">attach_money</span>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <p className="text-white text-3xl font-bold tracking-tight">$42,500</p>
                                <span className="flex items-center text-primary text-sm font-bold bg-primary/10 px-1.5 py-0.5 rounded">
                                    <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                                    15%
                                </span>
                            </div>
                            <p className="text-[#5c6f62] text-xs mt-1">vs. last month</p>
                        </div>
                        <div className="flex flex-col gap-1 rounded-2xl p-6 bg-[#1e2a23] border border-[#28392e] shadow-sm hover:border-primary/30 transition-colors">
                            <div className="flex justify-between items-start">
                                <p className="text-[#9db9a6] text-sm font-medium uppercase tracking-wider">Active Members</p>
                                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                    <span className="material-symbols-outlined text-[20px]">groups</span>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <p className="text-white text-3xl font-bold tracking-tight">1,240</p>
                                <span className="flex items-center text-primary text-sm font-bold bg-primary/10 px-1.5 py-0.5 rounded">
                                    <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                                    4.2%
                                </span>
                            </div>
                            <p className="text-[#5c6f62] text-xs mt-1">vs. last month</p>
                        </div>
                        <div className="flex flex-col gap-1 rounded-2xl p-6 bg-[#1e2a23] border border-[#28392e] shadow-sm hover:border-primary/30 transition-colors">
                            <div className="flex justify-between items-start">
                                <p className="text-[#9db9a6] text-sm font-medium uppercase tracking-wider">Avg Visit Duration</p>
                                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                    <span className="material-symbols-outlined text-[20px]">timer</span>
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <p className="text-white text-3xl font-bold tracking-tight">64m</p>
                                <span className="flex items-center text-primary text-sm font-bold bg-primary/10 px-1.5 py-0.5 rounded">
                                    <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                                    1.5%
                                </span>
                            </div>
                            <p className="text-[#5c6f62] text-xs mt-1">vs. last month</p>
                        </div>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Member Churn Probability */}
                        <div className="col-span-1 lg:col-span-2 rounded-2xl bg-[#1e2a23] border border-[#28392e] p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-white text-lg font-bold">Member Churn Probability</h3>
                                    <p className="text-[#9db9a6] text-sm">Risk analysis based on attendance patterns</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-2 rounded-full bg-[#fa5538]"></div>
                                        <span className="text-xs text-[#9db9a6] font-medium">High Risk</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="size-2 rounded-full bg-primary"></div>
                                        <span className="text-xs text-[#9db9a6] font-medium">Stable</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-end min-h-[200px]">
                                <div className="flex items-end justify-between gap-4 h-[180px] w-full relative">
                                    {/* Y-Axis Grid Lines (Visual only) */}
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                        <div className="w-full h-px bg-[#28392e] border-t border-dashed border-[#28392e]"></div>
                                        <div className="w-full h-px bg-[#28392e] border-t border-dashed border-[#28392e]"></div>
                                        <div className="w-full h-px bg-[#28392e] border-t border-dashed border-[#28392e]"></div>
                                        <div className="w-full h-px bg-[#28392e] border-t border-dashed border-[#28392e]"></div>
                                    </div>
                                    {/* Area Chart SVG */}
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
                                    <span className="text-[11px] text-[#5c6f62] font-semibold">Week 1</span>
                                    <span className="text-[11px] text-[#5c6f62] font-semibold">Week 2</span>
                                    <span className="text-[11px] text-[#5c6f62] font-semibold">Week 3</span>
                                    <span className="text-[11px] text-[#5c6f62] font-semibold">Week 4</span>
                                </div>
                            </div>
                        </div>
                        {/* Engagement Score */}
                        <div className="col-span-1 rounded-2xl bg-[#1e2a23] border border-[#28392e] p-6 flex flex-col">
                            <h3 className="text-white text-lg font-bold mb-1">Engagement Score</h3>
                            <p className="text-[#9db9a6] text-sm mb-6">Member activity breakdown</p>
                            <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
                                {/* Donut Chart CSS implementation */}
                                <div className="relative size-48 rounded-full" style={{ background: 'conic-gradient(#13ec5b 0% 65%, #ffffff 65% 85%, #3e5346 85% 100%)' }}>
                                    <div className="absolute inset-4 bg-[#1e2a23] rounded-full flex flex-col items-center justify-center z-10">
                                        <span className="text-4xl font-extrabold text-white">78%</span>
                                        <span className="text-xs text-[#9db9a6] font-medium uppercase tracking-wide mt-1">Avg Score</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2.5 rounded-sm bg-primary"></div>
                                        <span className="text-sm text-[#9db9a6]">Daily Users</span>
                                    </div>
                                    <span className="text-sm text-white font-bold">65%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2.5 rounded-sm bg-white"></div>
                                        <span className="text-sm text-[#9db9a6]">Weekly</span>
                                    </div>
                                    <span className="text-sm text-white font-bold">20%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2.5 rounded-sm bg-[#3e5346]"></div>
                                        <span className="text-sm text-[#9db9a6]">Inactive</span>
                                    </div>
                                    <span className="text-sm text-white font-bold">15%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 2 - Peak Hour Traffic */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-1 lg:col-span-3 rounded-2xl bg-[#1e2a23] border border-[#28392e] p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                                <div>
                                    <h3 className="text-white text-lg font-bold">Peak Hour Traffic</h3>
                                    <p className="text-[#9db9a6] text-sm">Average gym capacity by hour</p>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[#9db9a6] text-sm">Peak:</span>
                                    <span className="text-2xl font-bold text-white">82%</span>
                                    <span className="text-sm text-[#9db9a6]">at 6 PM</span>
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
                                            <div className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111813] text-white text-xs py-1 px-2 rounded border border-[#28392e] ${!bar.isPeak && 'opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                                                {bar.height}
                                            </div>
                                        </div>
                                        <span className={`text-[10px] sm:text-xs font-medium ${bar.isPeak ? 'text-primary font-bold' : 'text-[#5c6f62]'}`}>{bar.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Table - At-Risk Members */}
                    <div className="rounded-2xl bg-[#1e2a23] border border-[#28392e] overflow-hidden mb-6">
                        <div className="px-6 py-4 border-b border-[#28392e] flex justify-between items-center">
                            <h3 className="text-white text-lg font-bold">At-Risk Members</h3>
                            <button className="text-primary text-sm font-bold hover:text-white transition-colors">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[#9db9a6] text-xs uppercase tracking-wider border-b border-[#28392e]">
                                        <th className="px-6 py-4 font-medium">Member Name</th>
                                        <th className="px-6 py-4 font-medium">Last Visit</th>
                                        <th className="px-6 py-4 font-medium">Avg Frequency</th>
                                        <th className="px-6 py-4 font-medium">Churn Risk</th>
                                        <th className="px-6 py-4 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white text-sm">
                                    <tr className="group hover:bg-[#28392e] transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-[#3e5346] flex items-center justify-center text-xs font-bold">JD</div>
                                            <span className="font-medium">John Doe</span>
                                        </td>
                                        <td className="px-6 py-4 text-[#9db9a6]">14 days ago</td>
                                        <td className="px-6 py-4 text-[#9db9a6]">1x / month</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fa5538]/10 text-[#fa5538]">
                                                High (85%)
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-[#9db9a6] hover:text-white transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="group hover:bg-[#28392e] transition-colors border-t border-[#28392e]">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-[#3e5346] flex items-center justify-center text-xs font-bold">AS</div>
                                            <span className="font-medium">Alice Smith</span>
                                        </td>
                                        <td className="px-6 py-4 text-[#9db9a6]">21 days ago</td>
                                        <td className="px-6 py-4 text-[#9db9a6]">2x / month</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f59e0b]/10 text-[#f59e0b]">
                                                Medium (60%)
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-[#9db9a6] hover:text-white transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};
