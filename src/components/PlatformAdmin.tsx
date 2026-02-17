export const PlatformAdmin: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="size-20 bg-primary/20 text-primary rounded-3xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Platform Administration</h1>
            <p className="text-[var(--text-secondary)] mt-4 max-w-md">
                This is the master control panel for the entire SaaS platform. Manage gyms, subscription plans, and platform-wide analytics.
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                    <h3 className="font-bold text-lg mb-2">Manage Gyms</h3>
                    <p className="text-sm text-[var(--text-secondary)]">View and manage all registered gyms.</p>
                </div>
                <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                    <h3 className="font-bold text-lg mb-2">Global Revenue</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Track income across all tenants.</p>
                </div>
                <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                    <h3 className="font-bold text-lg mb-2">System Health</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Monitor server and database performance.</p>
                </div>
            </div>
        </div>
    );
};
