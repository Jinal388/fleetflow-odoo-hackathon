import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck, LayoutDashboard, Route, Receipt, Users, TrendingUp, X, Wrench } from 'lucide-react';

interface AdminSidebarProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const location = useLocation();

    // Admin has access to all user routes plus system-wide configurations
    const navigation = [
        { name: 'System Overview', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Global Fleet', href: '/admin/vehicles', icon: Truck },
        { name: 'All Trips', href: '/admin/trips', icon: Route },
        { name: 'System Maintenance', href: '/admin/maintenance', icon: Wrench },
        { name: 'Financial Audit', href: '/admin/expenses', icon: Receipt },
        { name: 'Personnel & Drivers', href: '/admin/drivers', icon: Users },
        { name: 'Corporate Analytics', href: '/admin/analytics', icon: TrendingUp },
    ];

    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0c1322] border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} `}
        >
            <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border/50 bg-[#0a0f1c]">
                <Link to="/" className="flex items-center gap-3">
                    <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-300">VahanSetu Admin</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-sidebar-foreground hover:text-white">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
                <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                    Administration
                </div>
                {navigation.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-sm'
                                : 'text-sidebar-foreground hover:bg-white/5 hover:text-white'
                                } `}
                        >
                            <item.icon className={`mr-3 h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-sidebar-foreground group-hover:text-white'} `} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default AdminSidebar;
