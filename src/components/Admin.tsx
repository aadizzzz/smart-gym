import React, { useEffect, useState } from 'react';
import { db, type Lead } from '../lib/db';
import { AdminLayout } from './AdminLayout';

export const Admin: React.FC = () => {
    // leads are fetching from local storage for now
    const [leads, setLeads] = useState<Lead[]>([]);

    useEffect(() => {
        setLeads(db.getLeads());
    }, []);

    return (
        <AdminLayout>
            <div className="flex-1 overflow-y-auto p-8 pb-20 text-white">
                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Active Members */}
                    <div className="bg-surface-dark border border-[#283928] rounded-2xl p-6 hover:border-[#3b543b] transition-colors relative group overflow-hidden">
                        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-white">groups</span>
                        </div>
                        <div className="flex flex-col gap-1 relative z-10">
                            <p className="text-[#9db99d] text-sm font-medium">Active Members</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-white text-3xl font-bold">1,240</h3>
                                <span className="text-primary text-sm font-medium mb-1 flex items-center bg-primary/10 px-1.5 py-0.5 rounded">
                                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                    12%
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Monthly Revenue */}
                    <div className="bg-surface-dark border border-primary/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(19,236,19,0.05)] relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 size-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
                        <div className="flex flex-col gap-1 relative z-10">
                            <p className="text-primary text-sm font-medium">Monthly Revenue</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-white text-3xl font-bold">$42,500</h3>
                                <span className="text-primary text-sm font-medium mb-1 flex items-center bg-primary/10 px-1.5 py-0.5 rounded">
                                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                    8%
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Expiring Soon */}
                    <div className="bg-surface-dark border border-[#283928] rounded-2xl p-6 hover:border-[#ef4444]/50 transition-colors relative group">
                        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-[#ef4444]">warning</span>
                        </div>
                        <div className="flex flex-col gap-1 relative z-10">
                            <p className="text-[#ef4444] text-sm font-medium">Expiring Soon</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-white text-3xl font-bold">14</h3>
                                <span className="text-[#ef4444] text-sm font-medium mb-1 flex items-center bg-[#ef4444]/10 px-1.5 py-0.5 rounded">
                                    Needs Action
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Attendance Today */}
                    <div className="bg-surface-dark border border-[#283928] rounded-2xl p-6 hover:border-[#3b543b] transition-colors relative group">
                        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-white">how_to_reg</span>
                        </div>
                        <div className="flex flex-col gap-1 relative z-10">
                            <p className="text-[#9db99d] text-sm font-medium">Attendance Today</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-white text-3xl font-bold">86</h3>
                                <span className="text-primary text-sm font-medium mb-1 flex items-center bg-primary/10 px-1.5 py-0.5 rounded">
                                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                    5%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Section */}
                    <div className="lg:col-span-2 bg-surface-dark border border-[#283928] rounded-2xl p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-white text-lg font-bold">Revenue Overview</h3>
                                <p className="text-[#9db99d] text-sm">Income analytics for the last 6 months</p>
                            </div>
                            <button className="text-[#9db99d] hover:text-white text-sm bg-[#283928] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                                Last 6 Months <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                            </button>
                        </div>
                        <div className="flex-1 w-full min-h-[300px] relative">
                            {/* SVG Chart */}
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 300">
                                {/* Grids - simplified for React, using inline styles for clarity */}
                                <line stroke="#283928" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="250" y2="250"></line>
                                <line stroke="#283928" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="190" y2="190"></line>
                                <line stroke="#283928" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="130" y2="130"></line>
                                <line stroke="#283928" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="70" y2="70"></line>
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#13ec13" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#13ec13" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0 220 C 100 220, 150 140, 200 160 C 250 180, 300 100, 400 110 C 500 120, 550 60, 650 50 C 700 45, 750 30, 800 40 V 300 H 0 Z" fill="url(#chartGradient)"></path>
                                <path className="drop-shadow-[0_0_10px_rgba(19,236,19,0.5)]" d="M0 220 C 100 220, 150 140, 200 160 C 250 180, 300 100, 400 110 C 500 120, 550 60, 650 50 C 700 45, 750 30, 800 40" fill="none" stroke="#13ec13" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                                <circle cx="650" cy="50" fill="#111811" r="6" stroke="#13ec13" strokeWidth="3"></circle>
                                <rect fill="#283928" height="34" rx="8" width="140" x="580" y="5"></rect>
                                <text fill="white" fontFamily="Lexend" fontSize="14" fontWeight="600" textAnchor="middle" x="650" y="27">$42,500</text>
                            </svg>
                            {/* X-Axis Labels */}
                            <div className="flex justify-between text-[#9db99d] text-xs font-medium mt-4 px-2">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>
                            </div>
                        </div>
                    </div>

                    {/* Leads / Recent Payments Table */}
                    <div className="lg:col-span-1 bg-surface-dark border border-[#283928] rounded-2xl p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white text-lg font-bold">New Leads</h3>
                            <a className="text-primary text-sm hover:underline" href="#">View All</a>
                        </div>
                        <div className="flex flex-col gap-2 overflow-y-auto">
                            {leads.length > 0 ? (
                                leads.map((lead) => (
                                    <div key={lead.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer border border-transparent hover:border-[#283928]">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                                                {lead.email.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium group-hover:text-primary transition-colors truncate w-32">{lead.email}</p>
                                                <p className="text-[#9db99d] text-xs">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/20 text-primary border border-primary/20">
                                            New
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No new leads yet.</p>
                            )}
                            {/* Manually added mock data to match design if no leads are present, or just as filler */}
                            <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer border border-transparent hover:border-[#283928]">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-slate-700 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-500"></div>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium group-hover:text-primary transition-colors">Sarah Connor</p>
                                        <p className="text-[#9db99d] text-xs">Today, 10:23 AM</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white text-sm font-bold">$120.00</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/20 text-primary border border-primary/20">
                                        Paid
                                    </span>
                                </div>
                            </div>

                            <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer border border-transparent hover:border-[#283928]">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-slate-700 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-teal-500"></div>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium group-hover:text-primary transition-colors">Mike Ross</p>
                                        <p className="text-[#9db99d] text-xs">Yesterday, 2:15 PM</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white text-sm font-bold">$120.00</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/20 text-red-400 border border-red-500/20">
                                        Failed
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#283928] flex justify-between items-center text-[#5d7a5d] text-xs">
                    <p>© 2024 FitLogic Pro System. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a className="hover:text-primary transition-colors" href="#">Privacy</a>
                        <a className="hover:text-primary transition-colors" href="#">Terms</a>
                        <a className="hover:text-primary transition-colors" href="#">Support</a>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
