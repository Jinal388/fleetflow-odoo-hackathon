import { motion } from 'framer-motion';

const Workflow: React.FC = () => {
    return (
        <section id="workflow" className="py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="w-full max-w-4xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-12">Seamless Operational Flow</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            {[
                                { title: "Intake & Registration", text: "Add vehicles and verify driver compliance before any trip begins." },
                                { title: "Smart Dispatch", text: "Assign available vehicles to active drivers strictly based on capacity." },
                                { title: "Execute & Log", text: "Track the trip to completion, seamlessly logging fuel and maintenance." },
                                { title: "Analyze Metrics", text: "Use real-time data to drive better strategic business decisions." }
                            ].map((step, idx) => (
                                <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                                        <p className="text-muted-foreground">{step.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;
