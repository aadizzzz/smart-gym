export const TrainerDashboard: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="size-20 bg-primary/20 text-primary rounded-3xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl">fitness_center</span>
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Trainer Dashboard</h1>
            <p className="text-[var(--text-secondary)] mt-4 max-w-md">
                Welcome to your specialized trainer view. Here you can manage your assigned members and workouts.
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                    <h3 className="font-bold text-lg mb-2">My Members</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Manage your client list and progress.</p>
                </div>
                <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                    <h3 className="font-bold text-lg mb-2">Workouts</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Create and assign workout plans.</p>
                </div>
            </div>
        </div>
    );
};
