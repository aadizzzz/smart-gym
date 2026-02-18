import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'New' | 'Contacted' | 'Trial' | 'Converted';
    source: string;
    created_at: string;
}

interface Campaign {
    id: string;
    name: string;
    type: 'Email' | 'SMS' | 'Social';
    status: 'Active' | 'Draft' | 'Completed';
    sent_count: number;
    clicked_count: number;
}

export const Leads: React.FC = () => {
    const { gymId } = useAuth();
    const [activeTab, setActiveTab] = useState<'leads' | 'marketing'>('leads');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(false);

    // New Lead State
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [newLead, setNewLead] = useState<Partial<Lead>>({ status: 'New', source: 'Manual' });

    useEffect(() => {
        if (gymId) {
            fetchLeads();
            fetchCampaigns();
        }
    }, [gymId]);

    const fetchLeads = async () => {
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('gym_id', gymId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setLeads(data as any);
        } catch (error) {
            console.error('Error fetching leads:', error);
        }
    };

    const fetchCampaigns = async () => {
        try {
            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .eq('gym_id', gymId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setCampaigns(data as any);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        }
    };

    const handleAddLead = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('leads')
                .insert({
                    gym_id: gymId,
                    name: newLead.name,
                    email: newLead.email,
                    phone: newLead.phone,
                    source: newLead.source,
                    status: newLead.status || 'New'
                });

            if (error) throw error;
            setIsLeadModalOpen(false);
            setNewLead({ status: 'New', source: 'Manual' });
            fetchLeads();
        } catch (error) {
            console.error('Error adding lead:', error);
            alert('Failed to add lead.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto h-full custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Leads & Marketing</h2>
                        <p className="text-[var(--text-secondary)] mt-1">Acquire new members and manage campaigns.</p>
                    </div>
                    <div className="flex gap-2 bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)]">
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'leads' ? 'bg-primary text-black shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                            Leads
                        </button>
                        <button
                            onClick={() => setActiveTab('marketing')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'marketing' ? 'bg-primary text-black shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                            Marketing
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'leads' ? (
                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Recent Leads</h3>
                                <button
                                    onClick={() => setIsLeadModalOpen(true)}
                                    className="flex items-center gap-2 bg-[var(--surface-highlight)] hover:bg-[var(--border)] text-[var(--text-primary)] px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                    Add New Lead
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[var(--surface-highlight)] text-[var(--text-secondary)] text-xs uppercase tracking-wider font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Contact</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Source</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {leads.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-[var(--text-secondary)]">
                                                    No leads found. Add one to get started!
                                                </td>
                                            </tr>
                                        ) : (
                                            leads.map((lead) => (
                                                <tr key={lead.id} className="group hover:bg-[var(--surface-highlight)] transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-[var(--text-primary)]">{lead.name || 'Unnamed Lead'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                                        <div>{lead.email}</div>
                                                        <div className="text-xs opacity-70">{lead.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                            lead.status === 'Contacted' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                                lead.status === 'Trial' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                                                    'bg-green-500/10 text-green-500 border-green-500/20'
                                                            }`}>
                                                            {lead.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{lead.source}</td>
                                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                                        {new Date(lead.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-[var(--text-secondary)] hover:text-primary transition-colors">
                                                            <span className="material-symbols-outlined">more_vert</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Campaign Stats Cards */}
                            {campaigns.map((campaign) => (
                                <div key={campaign.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 hover:shadow-lg transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`size-10 rounded-xl flex items-center justify-center ${campaign.type === 'Email' ? 'bg-blue-500/10 text-blue-500' :
                                            campaign.type === 'SMS' ? 'bg-green-500/10 text-green-500' : 'bg-pink-500/10 text-pink-500'
                                            }`}>
                                            <span className="material-symbols-outlined">{campaign.type === 'Email' ? 'mail' : campaign.type === 'SMS' ? 'sms' : 'share'}</span>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${campaign.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-[var(--surface-highlight)] text-[var(--text-secondary)]'
                                            }`}>
                                            {campaign.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{campaign.name}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] mb-6">Targeting members and leads.</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[var(--background)] rounded-xl p-3">
                                            <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">Sent</p>
                                            <p className="text-lg font-bold text-[var(--text-primary)]">{campaign.sent_count}</p>
                                        </div>
                                        <div className="bg-[var(--background)] rounded-xl p-3">
                                            <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">Engaged</p>
                                            <p className="text-lg font-bold text-primary">{campaign.clicked_count}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Create New Campaign Card */}
                            <button className="bg-[var(--surface-highlight)]/30 border border-dashed border-[var(--border)] rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:bg-[var(--surface-highlight)]/50 transition-all min-h-[200px]">
                                <div className="size-12 rounded-full bg-[var(--surface)] flex items-center justify-center mb-4 text-primary shadow-sm">
                                    <span className="material-symbols-outlined">add</span>
                                </div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">New Campaign</h3>
                                <p className="text-sm text-[var(--text-secondary)]">Create an email or SMS blast.</p>
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Add Lead Modal */}
            {isLeadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Add New Lead</h3>
                        <form onSubmit={handleAddLead} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newLead.name || ''}
                                    onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newLead.email || ''}
                                    onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={newLead.phone || ''}
                                    onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Source</label>
                                    <select
                                        value={newLead.source || 'Manual'}
                                        onChange={e => setNewLead({ ...newLead, source: e.target.value })}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                    >
                                        <option value="Manual">Manual</option>
                                        <option value="Website">Website</option>
                                        <option value="Referral">Referral</option>
                                        <option value="Social">Social</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Status</label>
                                    <select
                                        value={newLead.status || 'New'}
                                        onChange={e => setNewLead({ ...newLead, status: e.target.value as any })}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                    >
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Trial">Trial</option>
                                        <option value="Converted">Converted</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsLeadModalOpen(false)}
                                    className="flex-1 bg-transparent hover:bg-[var(--surface-highlight)] text-[var(--text-secondary)] py-2 rounded-lg font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-primary text-[#052e16] py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                                >
                                    {loading ? 'Adding...' : 'Add Lead'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
