import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export const MemberPayments: React.FC = () => {
    const { user } = useAuth();
    const [autoRenew, setAutoRenew] = useState(true);

    const invoices = [
        { id: 'INV-2024-004', date: 'Oct 01, 2024', amount: '$49.99', status: 'Paid', plan: 'Pro Membership (Monthly)' },
        { id: 'INV-2024-003', date: 'Sep 01, 2024', amount: '$49.99', status: 'Paid', plan: 'Pro Membership (Monthly)' },
        { id: 'INV-2024-002', date: 'Aug 01, 2024', amount: '$49.99', status: 'Paid', plan: 'Pro Membership (Monthly)' },
        { id: 'INV-2024-001', date: 'Jul 01, 2024', amount: '$49.99', status: 'Paid', plan: 'Pro Membership (Monthly)' },
    ];

    return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8 pb-32">

            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Billing & Payments</h1>
                <p className="text-[var(--text-secondary)] mt-1">Manage your membership, payment methods, and auto-renewal settings.</p>
            </motion.div>

            {/* Current Plan Overview */}
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="bg-gradient-to-br from-[var(--surface-highlight)] to-[var(--surface)] border border-primary/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl shadow-primary/5">

                    {/* Decorative Blob */}
                    <div className="absolute -top-24 -right-24 size-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Active Plan</span>
                            <h2 className="text-3xl font-black text-white mt-4 mb-1">Pro Membership</h2>
                            <p className="text-[var(--text-secondary)] font-medium">Billed monthly • Next charge on <span className="text-[var(--text-primary)]">Nov 01, 2024</span></p>
                        </div>

                        <div className="text-left md:text-right">
                            <p className="text-4xl font-extrabold text-white">$49.99</p>
                            <p className="text-[var(--text-secondary)] text-sm mt-1">/ month</p>
                            <button className="mt-4 border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-highlight)] text-[var(--text-primary)] py-2 px-6 rounded-xl font-bold text-sm transition-colors w-full md:w-auto shadow-sm">
                                Change Plan
                            </button>
                        </div>
                    </div>
                </div>
            </motion.section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
                    <h3 className="font-extrabold text-lg text-[var(--text-primary)] mb-5">Payment Method</h3>

                    <div className="flex items-center justify-between bg-[var(--background)] border border-primary/40 rounded-2xl p-4 ring-1 ring-primary/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-blue-600/20 border border-blue-500/30 rounded flex items-center justify-center">
                                {/* Simulated Visa Logo */}
                                <span className="text-blue-500 font-extrabold italic text-sm">VISA</span>
                            </div>
                            <div>
                                <p className="font-bold text-[var(--text-primary)]">•••• 4242</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5 mt-0.5">Expires 12/26</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">Default</span>
                    </div>

                    <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-tertiary)] hover:bg-[var(--background)] transition-all text-sm font-bold border-dashed">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add Payment Method
                    </button>
                </motion.section>

                {/* Auto-Renew & Notifications */}
                <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
                    <h3 className="font-extrabold text-lg text-[var(--text-primary)] mb-5">Billing Settings</h3>

                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="pr-4">
                                <p className="font-bold text-[var(--text-primary)]">Auto-Renewal</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-snug">Automatically charge your default payment method at the end of every billing cycle.</p>
                            </div>
                            <button
                                onClick={() => setAutoRenew(!autoRenew)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors relative shrink-0 ${autoRenew ? 'bg-primary' : 'bg-gray-600'}`}
                            >
                                <div className={`size-4 bg-white rounded-full shadow-md transition-transform ${autoRenew ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="border-t border-[var(--border)]"></div>

                        <div className="flex items-start justify-between">
                            <div className="pr-4">
                                <p className="font-bold text-[var(--text-primary)]">Send Email Invoices</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-snug">Receive monthly receipts directly to {user?.email || 'your email'}.</p>
                            </div>
                            <span className="material-symbols-outlined text-green-400">check_circle</span>
                        </div>
                    </div>
                </motion.section>
            </div>

            {/* Invoice History */}
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h3 className="font-extrabold text-lg text-[var(--text-primary)] mb-4 ml-1">Invoice History</h3>

                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
                    {invoices.map((inv, idx) => (
                        <div key={inv.id} className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-[var(--background)] ${idx !== invoices.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--text-tertiary)]">
                                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--text-primary)]">{inv.plan}</p>
                                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{inv.date} • {inv.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-6">
                                <span className="font-black text-[var(--text-primary)] tracking-wide">{inv.amount}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md uppercase tracking-wider">{inv.status}</span>
                                    <button className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-primary hover:bg-primary/10 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">download</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>

        </div>
    );
};
