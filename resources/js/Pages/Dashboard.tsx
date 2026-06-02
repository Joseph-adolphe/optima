import { Head, Link, usePage } from '@inertiajs/react';
import { Train, AlertTriangle, BarChart3, Clock, TrendingUp, ChevronRight, Activity, Settings, ListPlus } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { PageProps } from '@/types';

interface Locomotive {
    id: number;
    nom: string;
    modele: string;
    photo_url: string;
    total_pannes: number;
    pannes_en_cours: number;
}

interface Stats {
    total_locomotives: number;
    total_pannes: number;
    pannes_en_cours: number;
    pannes_ce_mois: number;
}

interface Props extends PageProps {
    locomotives: Locomotive[];
    stats: Stats;
}

export default function Dashboard({ locomotives, stats }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user || { name: 'Utilisateur', role: 'agent', email: '' };

    const statCards = [
        {
            label: 'Locomotives Actives',
            value: stats.total_locomotives,
            icon: Train,
            gradient: 'from-blue-600 to-blue-400',
            iconColor: 'text-blue-500',
            bgIcon: 'bg-blue-100/50',
            trend: '+1 ce mois',
        },
        {
            label: 'Pannes en cours',
            value: stats.pannes_en_cours,
            icon: Clock,
            gradient: 'from-orange-500 to-amber-400',
            iconColor: 'text-orange-500',
            bgIcon: 'bg-orange-100/50',
            trend: stats.pannes_en_cours > 0 ? 'Action requise' : 'Tout est OK',
        },
        {
            label: 'Total Pannes (Mois)',
            value: stats.pannes_ce_mois,
            icon: TrendingUp,
            gradient: 'from-red-600 to-pink-500',
            iconColor: 'text-red-500',
            bgIcon: 'bg-red-100/50',
            trend: 'Impact sur le Taux Dispo.',
        },
        {
            label: 'Total Historique',
            value: stats.total_pannes,
            icon: AlertTriangle,
            gradient: 'from-slate-700 to-slate-500',
            iconColor: 'text-slate-600',
            bgIcon: 'bg-slate-100/50',
            trend: 'Depuis la création',
        },
    ];

    const menuCards = [
        {
            title: 'Parc Locomotives',
            description: 'Gérez la flotte, ajoutez des unités et consultez les fiches de vie.',
            icon: Train,
            href: '/locomotives',
            bgClass: 'bg-gradient-to-br from-blue-900 to-blue-800',
            iconBg: 'bg-blue-800',
            hoverRing: 'group-hover:ring-blue-500/50',
            stats: `${stats.total_locomotives} unités`,
        },
        {
            title: 'Signalements & Pannes',
            description: 'Intervenez sur les pannes correctives et suivez leur résolution.',
            icon: AlertTriangle,
            href: '/pannes',
            bgClass: 'bg-gradient-to-br from-orange-900 to-orange-800',
            iconBg: 'bg-orange-800',
            hoverRing: 'group-hover:ring-orange-500/50',
            stats: `${stats.pannes_en_cours} alertes`,
        },
        {
            title: 'Analyses & KPIs',
            description: 'Accédez aux statistiques de disponibilité, MTTR, MTBF, etc.',
            icon: BarChart3,
            href: '/kpi',
            bgClass: 'bg-gradient-to-br from-emerald-900 to-emerald-800',
            iconBg: 'bg-emerald-800',
            hoverRing: 'group-hover:ring-emerald-500/50',
            stats: 'Rapports',
        },
    ];

    return (
        <AuthenticatedLayout header="Tableau de bord">
            <Head title="OPTIMA ONE — Tableau de bord" />

            <div className="max-w-7xl mx-auto pb-10 space-y-6">
                {/* HERO BANNER - CLEAN */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">
                                Bonjour, {user.name}
                            </h1>
                            <p className="text-slate-500">
                                Voici un aperçu de l'état du parc et des opérations de maintenance en cours.
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700 flex items-center gap-2 w-fit">
                            <Settings className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">Rôle : {user.role ? user.role.replace('_', ' ') : 'Agent'}</span>
                        </div>
                    </div>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.label}
                                className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-10 h-10 rounded-md ${card.bgIcon} flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 ${card.iconColor}`} />
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                </div>
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                                        <Activity className="w-3 h-3" />
                                        <span>{card.trend}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* MAIN MENU ACTIONS */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2 px-1">
                        <ListPlus className="w-4 h-4 text-blue-600" />
                        Accès Rapides
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {menuCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <Link
                                    key={card.title}
                                    href={card.href}
                                    className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col"
                                >
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className={`p-2 rounded-md ${card.bgClass ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'} shrink-0`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900 mb-1">{card.title}</h3>
                                            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{card.stats}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 flex-1">{card.description}</p>
                                    <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                                        Ouvrir <ChevronRight className="w-4 h-4 ml-1" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* LOCOMOTIVES CAROUSEL */}
                {locomotives.length > 0 && (
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mt-6">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <Train className="w-4 h-4 text-blue-600" />
                                    Aperçu du Parc
                                </h2>
                            </div>
                            <Link
                                href="/locomotives"
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                Voir tout <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        <div className="p-6 overflow-x-auto">
                            <div className="flex gap-4 min-w-max pb-2">
                                {locomotives.map((loco, idx) => (
                                    <Link
                                        key={`${loco.id}-${idx}`}
                                        href={route('locomotives.show', loco.id)}
                                        className="flex-shrink-0 w-64 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors flex flex-col overflow-hidden group"
                                    >
                                        <div className="h-32 bg-slate-100 relative">
                                            {loco.photo_url ? (
                                                <img
                                                    src={loco.photo_url}
                                                    alt={loco.nom}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Train className="w-10 h-10" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                {loco.pannes_en_cours > 0 ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                                                        {loco.pannes_en_cours} panne{loco.pannes_en_cours > 1 ? 's' : ''}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                        OK
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 truncate">{loco.nom}</h3>
                                            <p className="text-xs text-slate-500 uppercase mt-1 truncate">{loco.modele || '—'}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
