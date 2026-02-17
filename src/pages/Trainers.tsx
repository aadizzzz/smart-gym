export const Trainers: React.FC = () => {
    return (
        <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)]">Trainer Directory</h2>
                        <p className="text-[var(--text-secondary)] mt-1">Manage gym staff and personal trainers.</p>
                    </div>
                    <button className="bg-primary hover:bg-[#0fd60f] text-[#052e16] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
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
        </div>
    );
};
