import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, BarChart3, Clock } from 'lucide-react';

const Features: React.FC = () => {
    return (
        <section id="features" className="py-24 bg-card/30 relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to <span className="text-primary">scale</span></h2>
                    <p className="text-muted-foreground text-lg">
                        VahanSetu provides a complete suite of tools to manage your logistics business from end to end.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Real-time Tracking",
                            description: "Monitor active deliveries, vehicle status, and driver locations instantly.",
                            icon: Clock,
                            color: "text-blue-500",
                            bg: "bg-blue-500/10"
                        },
                        {
                            title: "Asset Management",
                            description: "Track vehicle lifecycle, capacity, and set statuses dynamically.",
                            icon: Truck,
                            color: "text-primary",
                            bg: "bg-primary/10"
                        },
                        {
                            title: "Safety & Compliance",
                            description: "Monitor driver performance, license validity, and safety scores.",
                            icon: ShieldCheck,
                            color: "text-amber-500",
                            bg: "bg-amber-500/10"
                        },
                        {
                            title: "Financial Analytics",
                            description: "Automate cost calculation, ROI, and identify expense inefficiencies.",
                            icon: BarChart3,
                            color: "text-purple-500",
                            bg: "bg-purple-500/10"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
