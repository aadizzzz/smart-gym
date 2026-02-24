import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface Member {
    id: string;
    user_id: string;
    gym_id: string;
    status: string;
    membership_plan: string;
    join_date: string;
    expiry_date: string;
    churn_risk: boolean;
    profile?: {
        email: string;
        role: string;
    };
}

export const Members: React.FC = () => {
    const { gymId } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTab, setFilterTab] = useState<'all' | 'active' | 'expired' | 'frozen'>('all');

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [modalData, setModalData] = useState({ email: '', plan: 'Basic', status: 'active' });

    useEffect(() => {
        const fetchMembers = async () => {
            if (!gymId) return;

            try {
                // Step 1: Fetch all members for this gym
                const { data: membersData, error: membersError } = await supabase
                    .from('members')
                    .select('id, user_id, gym_id, status, membership_plan, join_date, expiry_date, churn_risk')
                    .eq('gym_id', gymId);

                if (membersError) throw membersError;
                if (!membersData || membersData.length === 0) {
                    setMembers([]);
                    setLoading(false);
                    return;
                }

                // Step 2: Fetch profiles for those user_ids
                const userIds = membersData.map(m => m.user_id);
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, email, role')
                    .in('id', userIds);

                // Step 3: Merge
                const profileMap = new Map((profilesData || []).map(p => [p.id, p]));
                const merged = membersData.map(m => ({
                    ...m,
                    expiry_date: m.expiry_date ?? '',
                    profile: profileMap.get(m.user_id) ?? undefined,
                }));

                setMembers(merged);
            } catch (err) {
                console.error('Error fetching members:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [gymId]);

    const filteredMembers = members.filter(m => {
        const matchesSearch = m.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.membership_plan?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = filterTab === 'all' || m.status === filterTab;
        return matchesSearch && matchesTab;
    });

    const deleteMember = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setMembers(members.filter(m => m.id !== id));
        } catch (err) {
            console.error('Error deleting member:', err);
            alert('Failed to delete member. Please try again.');
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        alert("Member invitations require a backend email service to generate auth links. This UI is a placeholder for the Edge Function integration.");
        setIsAddModalOpen(false);
    };

    const handleEditMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMember) return;

        try {
            const { error } = await supabase
                .from('members')
                .update({ status: modalData.status, membership_plan: modalData.plan })
                .eq('id', selectedMember.id);

            if (error) throw error;

            setMembers(members.map(m => m.id === selectedMember.id ? { ...m, status: modalData.status, membership_plan: modalData.plan } : m));
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating member:', error);
            alert('Failed to update member.');
        }
    };

    const openEditModal = (member: Member) => {
        setSelectedMember(member);
        setModalData({ email: member.profile?.email || '', plan: member.membership_plan, status: member.status });
        setIsEditModalOpen(true);
    };

    const getInitials = (email: string) => email.substring(0, 2).toUpperCase();

    const stats = {
        total: members.length,
        active: members.filter(m => m.status === 'active').length,
        expired: members.filter(m => m.status === 'expired').length,
        frozen: members.filter(m => m.status === 'frozen').length
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 xl:px-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Member Directory</h2>
                        <p className="text-[var(--text-secondary)] mt-1">Manage gym access, memberships, and billing status.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary hover:bg-[#0fd60f] text-black px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add Member
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col">
                        <span className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider mb-1">Total Members</span>
                        <span className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</span>
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col">
                        <span className="text-emerald-400/80 text-xs font-medium uppercase tracking-wider mb-1">Active</span>
                        <span className="text-2xl font-bold text-[var(--text-primary)]">{stats.active}</span>
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col">
                        <span className="text-primary/80 text-xs font-medium uppercase tracking-wider mb-1">Expired</span>
                        <span className="text-2xl font-bold text-[var(--text-primary)]">{stats.expired}</span>
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col">
                        <span className="text-red-500/80 text-xs font-medium uppercase tracking-wider mb-1">Churn Risk</span>
                        <span className="text-2xl font-bold text-[var(--text-primary)]">{members.filter(m => m.churn_risk).length}</span>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-[var(--surface-highlight)] p-2 rounded-xl border border-[var(--border)]">
                    {/* Tabs */}
                    <div className="flex p-1 bg-[var(--surface)]/50 rounded-lg self-stretch lg:self-auto overflow-x-auto">
                        <button onClick={() => setFilterTab('all')} className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${filterTab === 'all' ? 'text-[var(--text-primary)] bg-[var(--surface-highlight)] shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'}`}>All Members</button>
                        <button onClick={() => setFilterTab('active')} className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${filterTab === 'active' ? 'text-[var(--text-primary)] bg-[var(--surface-highlight)] shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'}`}>Active</button>
                        <button onClick={() => setFilterTab('expired')} className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${filterTab === 'expired' ? 'text-[var(--text-primary)] bg-[var(--surface-highlight)] shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'}`}>Expired</button>
                        <button onClick={() => setFilterTab('frozen')} className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${filterTab === 'frozen' ? 'text-[var(--text-primary)] bg-[var(--surface-highlight)] shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'}`}>Frozen</button>
                    </div>
                    {/* Search & Filter */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative group w-full lg:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-[var(--text-secondary)] group-focus-within:text-primary transition-colors">search</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-[var(--surface)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm transition-shadow"
                                placeholder="Search by name, email, or phone..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--surface-highlight)] border-b border-[var(--border)]">
                                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Member</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Plan Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Join Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                                            <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
                                            <p className="mt-2 text-sm font-medium">Loading members...</p>
                                        </td>
                                    </tr>
                                ) : filteredMembers.length > 0 ? (
                                    filteredMembers.map(member => (
                                        <tr key={member.id} className="group hover:bg-[var(--surface-highlight)]/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                                        {getInitials(member.profile?.email || 'U')}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-[var(--text-primary)]">{member.profile?.email.split('@')[0]}</div>
                                                        <div className="text-xs text-[var(--text-secondary)]">ID: #{member.id.substring(0, 6)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-[var(--text-secondary)] flex flex-col gap-0.5">
                                                    <span className="flex items-center gap-1.5 truncate w-48"><span className="material-symbols-outlined text-[14px]">mail</span> {member.profile?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[var(--surface-highlight)] text-[var(--text-primary)] border border-[var(--border)]">
                                                    {member.membership_plan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                                                {new Date(member.join_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center flex items-center justify-center gap-2">
                                                {member.churn_risk && (
                                                    <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 text-xs font-bold px-2 py-0.5 rounded-md" title="High Churn Risk">
                                                        <span className="material-symbols-outlined text-[14px]">warning</span>
                                                        At Risk
                                                    </span>
                                                )}
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    member.status === 'expired' ? 'bg-primary/10 text-primary border border-primary/20' :
                                                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {member.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                                                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(member)}
                                                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1.5 rounded hover:bg-white/10 transition-colors"
                                                        title="Edit Member"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteMember(member.id)}
                                                        className="text-primary hover:text-[#0fd60f] p-1.5 rounded hover:bg-primary/10 transition-colors"
                                                        title="Delete Member"
                                                    >
                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                                            <p className="text-sm font-medium">No members found.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Bottom Space for scroll */}
            <div className="h-12"></div>

            {/* Add Member Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface-highlight)]/30">
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Invite New Member</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddMember} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={modalData.email}
                                    onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                                    placeholder="member@example.com"
                                />
                                <p className="text-[10px] text-[var(--text-secondary)] mt-1">An invitation link will be sent to this email to complete signup securely.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Initial Plan</label>
                                <select
                                    value={modalData.plan}
                                    onChange={(e) => setModalData({ ...modalData, plan: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors appearance-none"
                                >
                                    <option value="Basic">Basic ($29/mo)</option>
                                    <option value="Pro">Pro ($49/mo)</option>
                                    <option value="Elite">Elite ($99/mo)</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-highlight)] transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-primary hover:bg-[#0fd60f] text-black px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Member Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface-highlight)]/30">
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Edit Member</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleEditMember} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Email (Read Only)</label>
                                <input
                                    type="email"
                                    disabled
                                    value={modalData.email}
                                    className="w-full bg-[var(--background)]/50 border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-secondary)] cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Status</label>
                                <select
                                    value={modalData.status}
                                    onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors appearance-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="frozen">Frozen</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Plan</label>
                                <select
                                    value={modalData.plan}
                                    onChange={(e) => setModalData({ ...modalData, plan: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors appearance-none"
                                >
                                    <option value="Basic">Basic</option>
                                    <option value="Pro">Pro</option>
                                    <option value="Elite">Elite</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-highlight)] transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-primary hover:bg-[#0fd60f] text-black px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
