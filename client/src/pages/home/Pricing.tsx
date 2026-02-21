import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
    const plans = [
        {
            name: 'Essential',
            price: 'Free',
            period: 'forever',
            description: 'Perfect for small fleets just getting started with digital management.',
            features: [
                'Up to 10 Vehicles',
                'Basic Trip Dispatch',
                'Driver Directory',
                'Standard Email Support'
            ],
            cta: 'Get Started',
            highlighted: false
        },
        {
            name: 'Professional',
            price: '$49',
            period: '/month',
            description: 'Advanced analytics and tracking for growing logistical operations.',
            features: [
                'Up to 100 Vehicles',
                'Advanced Form Validations',
                'Expense & Fuel Logging',
                'Automated KPI Generation',
                'Priority 24/7 Support'
            ],
            cta: 'Start Free Trial',
            highlighted: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            description: 'Bespoke solutions and dedicated infrastructure for enterprise fleets.',
            features: [
                'Unlimited Vehicles',
                'Full API Access',
                'Custom Role Perms',
                'Dedicated Account Manager'
            ],
            cta: 'Contact Sales',
            highlighted: false
        }
    ];

    return (
        <section id="pricing" className="py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-muted-foreground">
                        Scale your fleet management with predictable plans that grow securely alongside your business.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`relative bg-card rounded-3xl p-8 border ${plan.highlighted ? 'border-primary ring-1 ring-primary shadow-xl scale-105 z-10' : 'border-border shadow-md z-0'} flex flex-col`}
                        >
                            {plan.highlighted && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-muted-foreground text-sm mb-6 h-10">{plan.description}</p>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-extrabold">{plan.price}</span>
                                {plan.period && <span className="text-muted-foreground font-medium">{plan.period}</span>}
                            </div>

                            <ul className="mb-8 space-y-4 flex-1">
                                {plan.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex flex-start gap-3">
                                        <div className="mt-0.5 rounded-full p-0.5 bg-primary/10 text-primary shrink-0">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to={plan.highlighted ? "/auth/signup" : "#contact"}
                                className={`w-full py-3 px-4 rounded-xl text-center font-semibold transition-all ${plan.highlighted ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                            >
                                {plan.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
