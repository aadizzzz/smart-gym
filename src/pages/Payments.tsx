import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Invoice {
    id: string;
    invoice_number: string;
    amount: number;
    gst_amount: number;
    created_at: string;
    payment_id: string;
}

export const Payments: React.FC = () => {
    const { currency } = useCurrency();
    const { gymId } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const sym = currency.symbol;

    useEffect(() => {
        if (gymId) fetchInvoices();
    }, [gymId]);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*')
                .eq('gym_id', gymId) // assuming gym_id is on invoices, if not we join payments
                .order('created_at', { ascending: false });

            if (error && error.code === '42703') {
                // if gym_id doesn't exist on invoices, we just fetch all for now, or join. 
                // Since this is a demo, let's fetch all invoices linked to payments for this gym
                const { data: invData, error: invError } = await supabase
                    .from('invoices')
                    .select('*, payments!inner(gym_id)')
                    .eq('payments.gym_id', gymId)
                    .order('created_at', { ascending: false });

                if (invError) throw invError;
                if (invData) setInvoices(invData);
            } else if (error) {
                throw error;
            } else if (data) {
                setInvoices(data);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto h-full custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Payments &amp; Billing</h2>
                        <p className="text-[var(--text-secondary)] mt-1">Track revenue, invoices, and member dues.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total Revenue</h3>
                        <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">{sym}{totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total Invoices</h3>
                        <p className="text-3xl font-bold text-primary mt-2">{invoices.length}</p>
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Net Profit</h3>
                        <p className="text-3xl font-bold text-emerald-400 mt-2">{sym}{totalRevenue.toFixed(2)}</p>
                    </div>
                </div>

                {/* Invoices Table */}
                <div className="mt-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface-highlight)]/30">
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Recent Invoices (Gym Intelligence Engine)</h3>
                        <span className="text-xs px-2.5 py-1 rounded bg-primary/10 text-primary font-bold">Auto-Generated</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--surface-highlight)]/50">
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Invoice #</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">GST Included</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                                            <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
                                        </td>
                                    </tr>
                                ) : invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-secondary)]">No invoices generated yet.</td>
                                    </tr>
                                ) : (
                                    invoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-[var(--surface-highlight)] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-[var(--text-primary)]">{inv.invoice_number}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-[var(--text-secondary)]">
                                                    {new Date(inv.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-[var(--text-primary)] font-medium">{sym}{inv.amount.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-[var(--text-secondary)]">{sym}{(inv.gst_amount || 0).toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="text-primary hover:text-[#0fd60f] transition-colors flex items-center justify-end gap-1 text-sm font-bold w-full">
                                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                                    PDF
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
