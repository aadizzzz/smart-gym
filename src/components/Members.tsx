import React from 'react';
import { AdminLayout } from './AdminLayout';

export const Members: React.FC = () => {
    return (
        <AdminLayout>
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 xl:px-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Member Directory</h2>
                            <p className="text-[var(--text-secondary)] mt-1">Manage gym access, memberships, and billing status.</p>
                        </div>
                        <button className="bg-primary hover:bg-[#0fd60f] text-black px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Add Member
                        </button>
                    </div>
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col">
                            <span className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider mb-1">Total Members</span>
                            <span className="text-2xl font-bold text-[var(--text-primary)]">1,240</span>
                        </div>
                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col">
                            <span className="text-emerald-400/80 text-xs font-medium uppercase tracking-wider mb-1">Active</span>
                            <span className="text-2xl font-bold text-[var(--text-primary)]">982</span>
                        </div>
                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col">
                            <span className="text-primary/80 text-xs font-medium uppercase tracking-wider mb-1">Expired</span>
                            <span className="text-2xl font-bold text-[var(--text-primary)]">145</span>
                        </div>
                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col">
                            <span className="text-blue-400/80 text-xs font-medium uppercase tracking-wider mb-1">Frozen</span>
                            <span className="text-2xl font-bold text-[var(--text-primary)]">113</span>
                        </div>
                    </div>
                    {/* Toolbar */}
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-[var(--surface-highlight)] p-2 rounded-xl border border-[var(--border)]">
                        {/* Tabs */}
                        <div className="flex p-1 bg-[var(--surface)]/50 rounded-lg self-stretch lg:self-auto overflow-x-auto">
                            <button className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--surface-highlight)] shadow rounded-md whitespace-nowrap transition-all">All Members</button>
                            <button className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-md whitespace-nowrap transition-all hover:bg-white/5">Active</button>
                            <button className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-md whitespace-nowrap transition-all hover:bg-white/5">Expired</button>
                            <button className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-md whitespace-nowrap transition-all hover:bg-white/5">Frozen</button>
                        </div>
                        {/* Search & Filter */}
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <div className="relative group w-full lg:w-80">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[var(--text-secondary)] group-focus-within:text-primary transition-colors">search</span>
                                </div>
                                <input className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-[var(--surface)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm transition-shadow" placeholder="Search by name, email, or phone..." type="text" />
                            </div>
                            <button className="p-2.5 bg-[var(--surface)] hover:bg-[var(--surface-highlight)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors border border-transparent hover:border-[var(--border)]" title="Filter">
                                <span className="material-symbols-outlined">filter_list</span>
                            </button>
                            <button className="p-2.5 bg-[var(--surface)] hover:bg-[var(--surface-highlight)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors border border-transparent hover:border-[var(--border)]" title="Export">
                                <span className="material-symbols-outlined">download</span>
                            </button>
                        </div>
                    </div>
                    {/* Table Container */}
                    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--surface-highlight)] border-b border-[var(--border)]">
                                        <th className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-1/4">Member</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-1/4">Contact</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-1/6">Plan Type</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-1/6">Join Date</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-1/6 text-center">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {/* Row 1 */}
                                    <tr className="group hover:bg-[var(--surface-highlight)]/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                                    AJ
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-[var(--text-primary)]">Alex Johnson</div>
                                                    <div className="text-xs text-[var(--text-secondary)]">ID: #8823</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-[var(--text-secondary)] flex flex-col gap-0.5">
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">mail</span> alex.j@example.com</span>
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">call</span> (555) 123-4567</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[var(--surface-highlight)] text-[var(--text-primary)] border border-[var(--border)]">
                                                Gold (Annual)
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                                            Jan 15, 2023
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded hover:bg-white/10 transition-colors">
                                                <span className="material-symbols-outlined text-xl">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Row 2 */}
                                    <tr className="group hover:bg-[var(--surface-highlight)]/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {/* Replaced external image with gradient avatar */}
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                                    SC
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-[var(--text-primary)]">Sarah Connor</div>
                                                    <div className="text-xs text-[var(--text-secondary)]">ID: #9941</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-[var(--text-secondary)] flex flex-col gap-0.5">
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">mail</span> sarah.c@skynet.com</span>
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">call</span> (555) 987-6543</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[var(--surface-highlight)] text-[var(--text-primary)] border border-[var(--border)]">
                                                Drop-in
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9db99d]">
                                            Mar 10, 2023
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                                Expired
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-[#9db99d] hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                                                <span className="material-symbols-outlined text-xl">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Row 3 */}
                                    <tr className="group hover:bg-[#39282a]/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                                    MR
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">Mike Ross</div>
                                                    <div className="text-xs text-[#9db99d]">ID: #4421</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-[#9db99d] flex flex-col gap-0.5">
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">mail</span> mike.r@pearson.com</span>
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">call</span> (555) 246-8135</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#39282a] text-white border border-white/10">
                                                Student
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9db99d]">
                                            Feb 01, 2023
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                <span className="material-symbols-outlined text-[14px]">ac_unit</span>
                                                Frozen
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-[#9db99d] hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                                                <span className="material-symbols-outlined text-xl">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Row 4 */}
                                    <tr className="group hover:bg-[#39282a]/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {/* Replaced external image with gradient avatar */}
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                                    JP
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">Jessica Pearson</div>
                                                    <div className="text-xs text-[#9db99d]">ID: #0001</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-[#9db99d] flex flex-col gap-0.5">
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">mail</span> jess.p@pearson.com</span>
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">call</span> (555) 135-7924</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#39282a] text-white border border-white/10">
                                                Platinum
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9db99d]">
                                            Nov 20, 2022
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-[#9db99d] hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                                                <span className="material-symbols-outlined text-xl">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer */}
                        <div className="bg-[var(--surface-highlight)] border-t border-[var(--border)] px-6 py-4 flex items-center justify-between">
                            <div className="text-sm text-[var(--text-secondary)]">
                                Showing <span className="font-medium text-[var(--text-primary)]">1</span> to <span className="font-medium text-[var(--text-primary)]">4</span> of <span className="font-medium text-[var(--text-primary)]">1,240</span> results
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1 rounded-md bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors text-sm disabled:opacity-50" disabled>
                                    Previous
                                </button>
                                <button className="px-3 py-1 rounded-md bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors text-sm">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bottom Space for scroll */}
                <div className="h-12"></div>
            </div>
        </AdminLayout>
    );
};
