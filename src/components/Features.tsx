import React from 'react';

const featuresPayload = [
    {
        icon: 'meeting_room',
        title: 'Automated Check-ins',
        desc: 'Touchless entry systems that integrate with major hardware. Manage capacity in real-time without staff.'
    },
    {
        icon: 'credit_card',
        title: 'Smart Billing',
        desc: 'Automated invoicing and payment retry logic. Never chase a late payment or failed card again.'
    },
    {
        icon: 'psychology',
        title: 'Retention AI',
        desc: 'Predict member churn before it happens. Our algorithms highlight at-risk members for proactive outreach.'
    },
    {
        icon: 'calendar_month',
        title: 'Class Scheduling',
        desc: 'Drag-and-drop calendar for classes and trainers. Let members book their spots via mobile app.'
    },
    {
        icon: 'inventory_2',
        title: 'Equipment Tracker',
        desc: 'Track maintenance schedules for every machine. Prevent downtime with automated service alerts.'
    },
    {
        icon: 'bar_chart',
        title: 'Advanced Reporting',
        desc: 'Deep dive into attendance trends, revenue per member, and marketing ROI with one click.'
    }
];

export const Features: React.FC = () => {
    return (
        <section id="features" className="bg-[var(--surface-highlight)] py-20 px-6 lg:px-10 transition-colors duration-300">
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">Core Functionality</h2>
                    <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)]">Everything you need to automate your fitness business, from entry to billing.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {featuresPayload.map((feature, idx) => (
                        <div key={idx} className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-all hover:border-primary/50 hover:shadow-lg">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-[var(--text-primary)]">{feature.title}</h3>
                            <p className="text-[var(--text-secondary)]">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
