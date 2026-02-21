import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck, LayoutDashboard, Route, Receipt, Users, TrendingUp, X, Wrench } from 'lucide-react';

interface UserSidebarProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
        { name: 'Vehicle Registry', href: '/user/vehicles', icon: Truck },
        { name: 'Trip Dispatch', href: '/user/trips', icon: Route },
        { name: 'Maintenance', href: '/user/maintenance', icon: Wrench },
        { name: 'Expense Logs', href: '/user/expenses', icon: Receipt },
        { name: 'Driver Profiles', href: '/user/drivers', icon: Users },
        { name: 'Analytics', href: '/user/analytics', icon: TrendingUp },
    ];

    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar-background border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} `}
        >
            <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border/50">
                <Link to="/" className="flex items-center gap-3">
                    <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">VahanSetu</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-sidebar-foreground hover:text-white">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
                <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                    Main Menu
                </div>
                {navigation.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-white'
                                } `}
                        >
                            <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-sidebar-foreground group-hover:text-white'} `} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-sidebar-border/50">
                <div className="bg-sidebar-accent/50 rounded-xl p-4 border border-sidebar-border">
                    <h4 className="text-sm font-semibold text-white mb-1">Fleet Status</h4>
                    <div className="flex justify-between items-center text-xs mt-3">
                        <span className="text-sidebar-foreground text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online</span>
                        <span className="text-white font-medium">84 / 100</span>
                    </div>
                    <div className="w-full bg-sidebar-background rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSidebar;
