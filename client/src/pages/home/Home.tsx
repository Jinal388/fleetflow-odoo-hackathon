import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import Workflow from './Workflow';
import Solution from './Solution';
import Pricing from './Pricing';
import Contact from './Contact';
import FooterCTA from './FooterCTA';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
            <Navbar />
            <Hero />
            <Features />
            <Workflow />
            <Solution />
            <Pricing />
            <Contact />
            <FooterCTA />
        </div>
    );
};

export default Home;
