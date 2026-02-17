import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection } from './AnimatedSection';

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

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export const Features: React.FC = () => {
    return (
        <section id="features" className="bg-[var(--surface-highlight)] py-20 px-6 lg:px-10 transition-colors duration-300">
            <div className="mx-auto max-w-7xl">
                <AnimatedSection className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">Core Functionality</h2>
                    <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)]">Everything you need to automate your fitness business, from entry to billing.</p>
                </AnimatedSection>
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {featuresPayload.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={item}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="flex flex-col items-start p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl transition-colors hover:border-primary/50 group"
                        >
                            <div className="p-3 bg-[var(--surface-highlight)] rounded-xl mb-4 group-hover:bg-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-3xl text-primary">{feature.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">{feature.title}</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
