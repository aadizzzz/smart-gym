import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const Trainers: React.FC = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [email, setEmail] = useState('');

    const handleAddTrainer = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await supabase.functions.invoke('send-email', {
                body: {
                    to: email,
                    subject: "You've been invited to join the Gym as a Trainer!",
                    html: `
                        <h2>Welcome to the Team!</h2>
                        <p>You have been invited to join the gym platform as a certified personal trainer.</p>
                        <p>To set up your profile, view your assigned members, and manage your schedule, please click the link below to get started:</p>
                        <br/>
                        <a href="https://smartgym.com/login" style="padding: 10px 20px; background-color: #0fd60f; color: black; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to your Dashboard</a>
                        <br/><br/>
                        <p>Best,<br/>Your Gym Admin Team</p>
                    `,
                    fromName: "Gym Admin",
                }
            });
            alert(`Invitation email successfully sent to ${email} via Resend Edge Function!`);
        } catch (error) {
            console.error("Failed to send trainer invitation email:", error);
            alert("Failed to send invitation email. Check console for details.");
        }

        setIsAddModalOpen(false);
    };

    return (
        <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)]">Trainer Directory</h2>
                        <p className="text-[var(--text-secondary)] mt-1">Manage gym staff and personal trainers.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary hover:bg-[#0fd60f] text-[#052e16] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        Add Trainer
                    </button>
                </div>
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-6xl text-[var(--text-secondary)] mb-4 opacity-20">fitness_center</span>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">No Trainers Yet</h3>
                    <p className="text-[var(--text-secondary)] mt-2 max-w-xs">Start by adding your first trainer to manage assignments and performance.</p>
                </div>
            </div>

            {/* Add Trainer Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface-highlight)]/30">
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Invite New Trainer</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddTrainer} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Trainer Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-primary transition-colors"
                                    placeholder="trainer@example.com"
                                />
                                <p className="text-[10px] text-[var(--text-secondary)] mt-1">An invitation link will be sent to this email to complete signup securely.</p>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-highlight)] transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-primary hover:bg-[#0fd60f] text-[#052e16] px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
