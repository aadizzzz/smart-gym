import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface AutomationWorkflow {
    id: string;
    name: string;
    description: string;
    trigger_type: string;
    action_type: string;
    is_active: boolean;
    stats: {
        runs: number;
        lastRun: string | null;
    };
    // Helper fields for UI
    icon?: string;
    color?: string;
}

export const Automation: React.FC = () => {
    const { gymId } = useAuth();
    const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
    const [loading, setLoading] = useState(false);

    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newWorkflow, setNewWorkflow] = useState<Partial<AutomationWorkflow>>({
        name: '',
        description: '',
        trigger_type: 'New Membership',
        action_type: 'Send Email'
    });

    useEffect(() => {
        if (gymId) {
            fetchWorkflows();
        }
    }, [gymId]);

    const fetchWorkflows = async () => {
        try {
            const { data, error } = await supabase
                .from('automation_workflows')
                .select('*')
                .eq('gym_id', gymId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                const formattedWorkflows = data.map((wf: any) => ({
                    ...wf,
                    icon: getIconForTrigger(wf.trigger_type),
                    color: getColorForTrigger(wf.trigger_type)
                }));
                setWorkflows(formattedWorkflows);
            }
        } catch (error) {
            console.error('Error fetching workflows:', error);
        }
    };

    const getIconForTrigger = (trigger: string) => {
        if (trigger.includes('Birthday')) return 'cake';
        if (trigger.includes('Payment')) return 'credit_card_off';
        if (trigger.includes('Inactivity')) return 'fitness_center';
        return 'waving_hand';
    };

    const getColorForTrigger = (trigger: string) => {
        if (trigger.includes('Birthday')) return 'text-pink-500 bg-pink-500/10';
        if (trigger.includes('Payment')) return 'text-red-500 bg-red-500/10';
        if (trigger.includes('Inactivity')) return 'text-blue-500 bg-blue-500/10';
        return 'text-yellow-500 bg-yellow-500/10';
    };

    const toggleWorkflow = async (id: string, currentState: boolean) => {
        try {
            // Optimistic update
            setWorkflows(workflows.map(wf =>
                wf.id === id ? { ...wf, is_active: !currentState } : wf
            ));

            const { error } = await supabase
                .from('automation_workflows')
                .update({ is_active: !currentState })
                .eq('id', id);

            if (error) {
                throw error;
                // Revert on error would go here
            }
        } catch (error) {
            console.error('Error toggling workflow:', error);
            alert('Failed to update workflow.');
            fetchWorkflows(); // Revert
        }
    };

    const handleCreateWorkflow = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('automation_workflows')
                .insert({
                    gym_id: gymId,
                    name: newWorkflow.name,
                    description: newWorkflow.description,
                    trigger_type: newWorkflow.trigger_type,
                    action_type: newWorkflow.action_type,
                    is_active: true,
                    stats: { runs: 0, lastRun: null }
                });

            if (error) throw error;
            setIsCreateModalOpen(false);
            setNewWorkflow({ name: '', description: '', trigger_type: 'New Membership', action_type: 'Send Email' });
            fetchWorkflows();
        } catch (error) {
            console.error('Error creating workflow:', error);
            alert('Failed to create workflow.');
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
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Workflow Automation</h2>
                        <p className="text-[var(--text-secondary)] mt-1">Automate routine tasks and member engagement.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-primary hover:bg-[#0fd60f] text-[#052e16] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_8px_20px_rgba(19,236,19,0.15)] active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Create Workflow
                    </button>
                </div>

                {/* Workflow List */}
                <div className="space-y-4">
                    {workflows.length === 0 ? (
                        <div className="text-center py-12 bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
                            <div className="size-16 rounded-full bg-[var(--surface-highlight)] flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl text-[var(--text-secondary)]">auto_fix_high</span>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">No workflows yet</h3>
                            <p className="text-[var(--text-secondary)]">Create your first automation to save time.</p>
                        </div>
                    ) : (
                        workflows.map((workflow) => (
                            <div key={workflow.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition-shadow group">
                                {/* Icon */}
                                <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 ${workflow.color || 'bg-gray-500/10 text-gray-500'}`}>
                                    <span className="material-symbols-outlined text-2xl">{workflow.icon || 'settings'}</span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-3">
                                        {workflow.name}
                                        {!workflow.is_active && (
                                            <span className="px-2 py-0.5 rounded-md bg-[var(--surface-highlight)] text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider">
                                                Paused
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] text-sm mt-1 mb-3">{workflow.description}</p>

                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-[var(--text-secondary)]">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm">bolt</span>
                                            <span>Trigger: <span className="text-[var(--text-primary)]">{workflow.trigger_type}</span></span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            <span>Action: <span className="text-[var(--text-primary)]">{workflow.action_type}</span></span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm">history</span>
                                            <span>Ran {workflow.stats?.runs || 0} times • Last: {workflow.stats?.lastRun || 'Never'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-4 self-end md:self-center">
                                    <button className="size-10 rounded-xl hover:bg-[var(--surface-highlight)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <div
                                        onClick={() => toggleWorkflow(workflow.id, workflow.is_active)}
                                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 relative ${workflow.is_active ? 'bg-primary/20' : 'bg-[var(--surface-highlight)]'}`}
                                    >
                                        <div className={`size-4 rounded-full shadow-sm transition-all duration-300 ${workflow.is_active ? 'bg-primary translate-x-6' : 'bg-[var(--text-secondary)] translate-x-0'}`} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Create Workflow Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Create Workflow</h3>
                        <form onSubmit={handleCreateWorkflow} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newWorkflow.name || ''}
                                    onChange={e => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                    placeholder="e.g., Welcome Email"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Description</label>
                                <textarea
                                    value={newWorkflow.description || ''}
                                    onChange={e => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] resize-none h-20"
                                    placeholder="What does this automation do?"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Trigger</label>
                                    <select
                                        value={newWorkflow.trigger_type || ''}
                                        onChange={e => setNewWorkflow({ ...newWorkflow, trigger_type: e.target.value })}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                    >
                                        <option value="New Membership">New Membership</option>
                                        <option value="Payment Failed">Payment Failed</option>
                                        <option value="Birthday">Birthday</option>
                                        <option value="Inactivity">Inactivity</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Action</label>
                                    <select
                                        value={newWorkflow.action_type || ''}
                                        onChange={e => setNewWorkflow({ ...newWorkflow, action_type: e.target.value })}
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                                    >
                                        <option value="Send Email">Send Email</option>
                                        <option value="Send SMS">Send SMS</option>
                                        <option value="Push Notification">Push Notification</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 bg-transparent hover:bg-[var(--surface-highlight)] text-[var(--text-secondary)] py-2 rounded-lg font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-primary text-[#052e16] py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Workflow'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
