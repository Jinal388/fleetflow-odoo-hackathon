import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, Menu, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/auth/login');
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden relative font-sans text-foreground">

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Navigation Component */}
            <AdminSidebar
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background relative z-0">

                {/* Top Navbar */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-card border-b border-border/50 shadow-sm sticky top-0 z-30">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden text-muted-foreground hover:text-foreground"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Global Search */}
                        <div className="hidden sm:flex max-w-md w-full relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Global Admin Search..."
                                className="w-full h-10 pl-10 pr-4 bg-secondary/50 border border-transparent focus:border-blue-500/30 focus:bg-background rounded-xl text-sm outline-none transition-all placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center mr-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                System Admin
                            </span>
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-destructive border-2 border-card ring-0" />
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary transition-colors"
                            >
                                <img
                                    className="h-8 w-8 rounded-full border border-border object-cover"
                                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="Admin Avatar"
                                />
                                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsProfileOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-56 rounded-xl bg-popover border border-border shadow-md z-50 overflow-hidden origin-top-right text-popover-foreground"
                                        >
                                            <div className="px-4 py-3 border-b border-border bg-muted/20">
                                                <p className="text-sm font-medium">System Administrator</p>
                                                <p className="text-xs text-muted-foreground truncate">admin@vahansetu.com</p>
                                            </div>
                                            <div className="p-1 border-t border-border mt-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center px-3 py-2 text-sm rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Sign out
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content scrollable area */}
                <main className="flex-1 overflow-auto bg-secondary/20 scrollbar-hide">
                    <div className="mx-auto max-w-7xl h-full p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
