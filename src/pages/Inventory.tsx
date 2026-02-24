import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

interface InventoryItem {
    id: string;
    item_name: string;
    current_stock: number;
    cost: number;
    last_30_days_sales: number;
}

export const Inventory: React.FC = () => {
    const { gymId } = useAuth();
    const { currency } = useCurrency();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [formData, setFormData] = useState({ item_name: '', current_stock: 0, cost: 0, last_30_days_sales: 0 });

    useEffect(() => {
        if (gymId) fetchInventory();
    }, [gymId]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inventory')
                .select('*')
                .eq('gym_id', gymId)
                .order('item_name', { ascending: true });

            if (error) throw error;
            if (data) setInventory(data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                const { error } = await supabase
                    .from('inventory')
                    .update({
                        item_name: formData.item_name,
                        current_stock: formData.current_stock,
                        cost: formData.cost,
                        last_30_days_sales: formData.last_30_days_sales,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('inventory')
                    .insert({
                        gym_id: gymId,
                        item_name: formData.item_name,
                        current_stock: formData.current_stock,
                        cost: formData.cost,
                        last_30_days_sales: formData.last_30_days_sales
                    });
                if (error) throw error;
            }
            setIsModalOpen(false);
            fetchInventory();
        } catch (error) {
            console.error('Error saving inventory:', error);
            alert('Failed to save item.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            const { error } = await supabase.from('inventory').delete().eq('id', id);
            if (error) throw error;
            fetchInventory();
        } catch (error) {
            console.error('Error deleting inventory:', error);
        }
    };

    const openModal = (item?: InventoryItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({ item_name: item.item_name, current_stock: item.current_stock, cost: item.cost, last_30_days_sales: item.last_30_days_sales });
        } else {
            setEditingItem(null);
            setFormData({ item_name: '', current_stock: 0, cost: 0, last_30_days_sales: 0 });
        }
        setIsModalOpen(true);
    };

    const getDaysLeft = (stock: number, sales30: number) => {
        if (sales30 <= 0) return Infinity;
        const dailyAvg = sales30 / 30;
        return stock / dailyAvg;
    };

    return (
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto h-full custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Inventory</h2>
                        <p className="text-[var(--text-secondary)] mt-1">Manage gym supplies and track predictive stock alerts.</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-primary hover:bg-[#0fd60f] text-[#052e16] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_8px_20px_rgba(19,236,19,0.15)] active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Add Item
                    </button>
                </div>

                {/* Table */}
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--surface-highlight)]/50">
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Item Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Current Stock</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Last 30D Sales</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Cost</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Intelligence Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {loading && inventory.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                                            <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
                                        </td>
                                    </tr>
                                ) : inventory.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-[var(--text-secondary)]">No inventory items found. Add one to start tracking.</td>
                                    </tr>
                                ) : (
                                    inventory.map((item) => {
                                        const daysLeft = getDaysLeft(item.current_stock, item.last_30_days_sales);
                                        const isLow = daysLeft < 5 && daysLeft !== Infinity;

                                        return (
                                            <tr key={item.id} className={`hover:bg-[var(--surface-highlight)] transition-colors ${isLow ? 'bg-red-500/5 hover:bg-red-500/10' : ''}`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-bold text-[var(--text-primary)]">{item.item_name}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-[var(--text-primary)]">{item.current_stock}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-[var(--text-primary)]">{item.last_30_days_sales}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-[var(--text-secondary)]">{currency.symbol}{item.cost}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {isLow ? (
                                                        <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 text-xs font-bold px-2.5 py-1 rounded-md">
                                                            <span className="material-symbols-outlined text-[14px]">warning</span>
                                                            Low ({'<'} {Math.ceil(daysLeft)} days left)
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-500 text-xs font-bold px-2.5 py-1 rounded-md">
                                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                            Healthy
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => openModal(item)} className="p-2 text-[var(--text-secondary)] hover:text-primary transition-colors rounded-xl hover:bg-primary/10">
                                                            <span className="material-symbols-outlined text-lg">edit</span>
                                                        </button>
                                                        <button onClick={() => handleDelete(item.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors rounded-xl hover:bg-red-500/10">
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">{editingItem ? 'Edit Item' : 'Add Item'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Item Name</label>
                                <input
                                    type="text" required
                                    value={formData.item_name}
                                    onChange={e => setFormData({ ...formData, item_name: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Current Stock</label>
                                    <input
                                        type="number" required min="0"
                                        value={formData.current_stock}
                                        onChange={e => setFormData({ ...formData, current_stock: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">30 Day Sales</label>
                                    <input
                                        type="number" required min="0"
                                        value={formData.last_30_days_sales}
                                        onChange={e => setFormData({ ...formData, last_30_days_sales: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Cost ({currency.symbol})</label>
                                <input
                                    type="number" required min="0" step="0.01"
                                    value={formData.cost}
                                    onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-transparent hover:bg-[var(--surface-highlight)] text-[var(--text-secondary)] py-2 rounded-lg font-bold text-sm">Cancel</button>
                                <button type="submit" className="flex-1 bg-primary text-[#052e16] py-2 rounded-lg font-bold text-sm">{editingItem ? 'Save Changes' : 'Add Item'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
