import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FooterCTA: React.FC = () => {
    return (
        <>
            <section className="py-24 relative overflow-hidden bg-sidebar-background text-sidebar-foreground">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to optimize your fleet?</h2>
                        <p className="text-lg text-sidebar-foreground/80 mb-10">
                            Join leading logistics companies transforming their operations with VahanSetu. Start making data-driven decisions today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/auth/signup" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300">
                                Create Free Account
                            </Link>
                            <Link to="/auth/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20 duration-300">
                                Sign In to Dashboard
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer minimal */}
            <footer className="py-8 bg-sidebar-background border-t border-sidebar-border text-center text-sm text-sidebar-foreground/60">
                <div className="container mx-auto px-6">
                    <p>© {new Date().getFullYear()} VahanSetu. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
};

export default FooterCTA;
