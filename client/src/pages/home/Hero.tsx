import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Abstract Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-[100%] bg-primary/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-[100%] bg-blue-500/10 blur-[120px]" />
            </div>

            <div className="container relative z-10 px-6 mx-auto flex flex-col items-center text-center py-16">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-5xl leading-tight"
                >
                    Modern Fleet Management, <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">
                        Perfected.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl"
                >
                    Replace manual logbooks with a centralized, rule-driven digital hub.
                    Track vehicle health, dispatch intelligently, and monitor financial performance in real-time.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Link to="/auth/signup" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <a href="#features" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300">
                        <Play className="mr-2 h-5 w-5" />
                        See How It Works
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
