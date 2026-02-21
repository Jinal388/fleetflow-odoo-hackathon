import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe2, BarChart3 } from 'lucide-react';

const Solution: React.FC = () => {
    const solutions = [
        {
            title: 'Real-Time Visibility',
            description: 'Track your entire fleet on a live map with AI-predicted ETAs and route optimizations to reduce fuel consumption and wear.',
            icon: Globe2,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            title: 'Automated Dispatch',
            description: 'Intelligently assign available drivers and vehicles based on capacity, proximity, and compliance status without manual intervention.',
            icon: Zap,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            title: 'Predictive Maintenance',
            description: 'Log issues instantly and schedule service proactively before breakdowns happen, reducing unexpected downtime by up to 40%.',
            icon: ShieldCheck,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            title: 'Financial Analytics',
            description: 'Correlate expenses and revenue on a per-trip and per-vehicle basis to calculate exact ROI and total operational costs.',
            icon: BarChart3,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        }
    ];

    return (
        <section id="solutions" className="py-24 bg-secondary/30 relative">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold tracking-tight mb-4">Our Comprehensive Solution</h2>
                    <p className="text-lg text-muted-foreground">
                        VahanSetu provides a unified ecosystem that bridges the gap between logistical execution, driver compliance, and deep financial reporting.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {solutions.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className={`w-14 h-14 rounded-xl ${item.bg} flex items-center justify-center mb-6`}>
                                <item.icon className={`w-7 h-7 ${item.color}`} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Solution;
