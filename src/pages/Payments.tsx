import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

export const Payments: React.FC = () => {
    const { currency } = useCurrency();
    const sym = currency.symbol;
    return (
        <div className="flex-1 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)]">Payments &amp; Billing</h2>
                        <p className="text-[var(--text-secondary)] mt-1">Track revenue, invoices, and member dues.</p>
                    </div>
                </div>
                {/* Placeholder content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total Revenue</h3>
                        <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">{sym}0.00</p>
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Pending Dues</h3>
                        <p className="text-3xl font-bold text-primary mt-2">{sym}0.00</p>
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Net Profit</h3>
                        <p className="text-3xl font-bold text-emerald-400 mt-2">{sym}0.00</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
