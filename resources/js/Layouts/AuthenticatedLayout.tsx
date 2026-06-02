import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { PageProps } from '@/types';
import {
    LayoutDashboard,
    Train,
    Tag,
    AlertTriangle,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ClipboardList,
    Users,
} from 'lucide-react';
import { router } from '@inertiajs/react';

const navItems = [
    {
        label: 'Tableau de bord',
        icon: LayoutDashboard,
        href: '/dashboard',
        name: 'dashboard',
    },
    {
        label: 'Gestion Locomotives',
        icon: Train,
        href: '/locomotives',
        name: 'locomotives',
    },
    {
        label: 'Catégories',
        icon: Tag,
        href: '/categories',
        name: 'categories',
    },
    {
        label: 'Gestion des Pannes',
        icon: AlertTriangle,
        href: '/pannes',
        name: 'pannes',
    },
    {
        label: 'Ordres de Travail',
        icon: ClipboardList,
        href: '/ordres-travail',
        name: 'ordres-travail',
    },
    {
        label: 'Analyse & KPI',
        icon: BarChart3,
        href: '/kpi',
        name: 'kpi',
    },
    {
        label: 'Rôles & Permissions',
        icon: Settings,
        href: '/admin/roles',
        name: 'admin.roles',
        permission: 'admin.view',
    },
    {
        label: 'Utilisateurs',
        icon: Users,
        href: '/admin/users',
        name: 'admin.users',
        permission: 'admin.view',
    },
    {
        label: 'Cycles & Règles',
        icon: Settings,
        href: '/admin/maintenance',
        name: 'admin.maintenance',
        permission: 'admin.view',
    },
];

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const handleLogout = () => {
        router.post('/logout');
    };

    const isActive = (name: string) => {
        if (name === 'dashboard') return url === '/dashboard';
        if (name === 'locomotives') return url.startsWith('/locomotives');
        if (name === 'categories') return url.startsWith('/categories');
        if (name === 'pannes') return url.startsWith('/pannes');
        if (name === 'ordres-travail') return url.startsWith('/ordres-travail');
        if (name === 'kpi') return url.startsWith('/kpi');
        if (name === 'admin.roles') return url.startsWith('/admin/roles');
        if (name === 'admin.users') return url.startsWith('/admin/users');
        if (name === 'admin.maintenance') return url.startsWith('/admin/maintenance');
        return false;
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            <aside
                className={`optima-sidebar flex flex-col transition-all duration-300 ease-in-out ${
                    sidebarOpen ? 'w-64' : 'w-16'
                } shrink-0 relative z-20 shadow-2xl`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 shrink-0">
                        <div className="w-5 h-5 bg-white rounded-md rotate-12" />
                    </div>
                    {sidebarOpen && (
                        <div className="animate-fade-in">
                            <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium">
                                Plateforme
                            </p>
                            <p className="text-white font-bold text-lg leading-tight tracking-wide">
                                OPTIMA ONE
                            </p>
                        </div>
                    )}
                </div>

                {/* Toggle button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute -right-3 top-6 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center border border-blue-100 hover:scale-110 transition-transform z-30"
                >
                    {sidebarOpen ? (
                        <ChevronRight className="w-3 h-3 text-blue-700 rotate-180" />
                    ) : (
                        <ChevronRight className="w-3 h-3 text-blue-700" />
                    )}
                </button>

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {navItems
                        .filter(item => !item.permission || (user && user.permissions && user.permissions.includes(item.permission)))
                        .map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.name);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                                    active
                                        ? 'bg-white/20 text-white shadow-md'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <Icon
                                    className={`w-5 h-5 shrink-0 transition-transform ${
                                        active ? 'scale-110' : 'group-hover:scale-105'
                                    }`}
                                />
                                {sidebarOpen && (
                                    <span className="text-sm font-medium truncate animate-fade-in">
                                        {item.label}
                                    </span>
                                )}
                                {active && sidebarOpen && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info */}
                {user && (
                    <div className="border-t border-white/10 p-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <span className="text-white text-xs font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            {sidebarOpen && (
                                <div className="flex-1 min-w-0 animate-fade-in">
                                    <p className="text-white text-sm font-semibold truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-white/60 text-xs truncate">
                                        {user.role || 'Utilisateur'}
                                    </p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className={`mt-3 flex items-center gap-2 text-white/70 hover:text-white text-xs transition-colors w-full ${
                                sidebarOpen ? 'px-2' : 'justify-center'
                            }`}
                        >
                            <LogOut className="w-4 h-4 shrink-0" />
                            {sidebarOpen && <span>Déconnexion</span>}
                        </button>
                    </div>
                )}
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="bg-card border-b border-border px-6 py-3.5 flex items-center gap-4 shadow-sm shrink-0">
                    <div className="flex-1">
                        {header && (
                            <div className="text-lg font-bold text-foreground">
                                {header}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-muted-foreground">Système opérationnel</span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    {children}
                </main>
            </div>
        </div>
    );
}
