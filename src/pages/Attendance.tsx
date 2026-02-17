export const Attendance: React.FC = () => {
    return (
        <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">Attendance Tracking</h2>
                    <p className="text-[var(--text-secondary)] mt-1">Real-time gym occupancy and check-in logs.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 min-h-[400px]">
                        <h3 className="font-bold text-[var(--text-primary)] mb-4">Daily Logs</h3>
                        <p className="text-[var(--text-secondary)] text-sm">Waiting for first check-in of the day...</p>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
                            <h3 className="text-primary font-bold">Live Status</h3>
                            <p className="text-primary/70 text-sm mt-1">Gym is currently quiet.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
