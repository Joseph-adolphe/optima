import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Shield, User, Lock, Check, Save, Search, Users, SlidersHorizontal } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
    module: string;
    description: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    direct_permissions: number[];
}

interface Props {
    permissionsGrouped: Record<string, Permission[]>;
    rolePermissions: Record<string, number[]>;
    users: UserItem[];
    roles: string[];
}

export default function Roles({ permissionsGrouped, rolePermissions, users, roles }: Props) {
    const [activeMainTab, setActiveMainTab] = useState<'roles' | 'users'>('roles');
    const [selectedRole, setSelectedRole] = useState<string>('chef_atelier');
    const [userSearch, setUserSearch] = useState('');
    const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserItem | null>(null);

    // Form pour mettre à jour les permissions d'un rôle
    const roleForm = useForm({
        role: selectedRole,
        permissions: rolePermissions[selectedRole] || [],
    });

    // Form pour mettre à jour les permissions directes d'un utilisateur
    const userForm = useForm({
        user_id: 0,
        permissions: [] as number[],
    });

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        roleForm.setData({
            role: role,
            permissions: rolePermissions[role] || [],
        });
    };

    const handleRolePermissionToggle = (permId: number) => {
        const currentPerms = [...roleForm.data.permissions];
        const index = currentPerms.indexOf(permId);
        if (index > -1) {
            currentPerms.splice(index, 1);
        } else {
            currentPerms.push(permId);
        }
        roleForm.setData('permissions', currentPerms);
    };

    const handleSaveRolePermissions = (e: React.FormEvent) => {
        e.preventDefault();
        roleForm.post(route('admin.roles.update'), {
            preserveScroll: true,
        });
    };

    const handleOpenUserEdit = (user: UserItem) => {
        setSelectedUserForEdit(user);
        userForm.setData({
            user_id: user.id,
            permissions: user.direct_permissions || [],
        });
    };

    const handleUserPermissionToggle = (permId: number) => {
        const currentPerms = [...userForm.data.permissions];
        const index = currentPerms.indexOf(permId);
        if (index > -1) {
            currentPerms.splice(index, 1);
        } else {
            currentPerms.push(permId);
        }
        userForm.setData('permissions', currentPerms);
    };

    const handleSaveUserPermissions = (e: React.FormEvent) => {
        e.preventDefault();
        userForm.post(route('admin.users.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedUserForEdit(null);
            },
        });
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.role.toLowerCase().includes(userSearch.toLowerCase())
    );

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'chef_atelier': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'coordinateur': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'directeur': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <AppLayout>
            <Head title="Habilitations & Sécurité - OPTIMA ONE" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Gestion des Habilitations & Rôles
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Configurez les habilitations globales des rôles ou attribuez des droits spécifiques par utilisateur (Modèle Hybride).
                            </p>
                        </div>

                        {/* Top tabs switcher */}
                        <div className="flex bg-slate-100 p-1 rounded-xl self-start border border-slate-200 shadow-sm">
                            <button
                                onClick={() => setActiveMainTab('roles')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeMainTab === 'roles'
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Rôles & Matrices
                            </button>
                            <button
                                onClick={() => setActiveMainTab('users')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeMainTab === 'users'
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Users className="w-4 h-4" />
                                Utilisateurs ({users.length})
                            </button>
                        </div>
                    </div>

                    {/* Section 1: Roles Matrix */}
                    {activeMainTab === 'roles' && (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Role List Side panel */}
                            <div className="lg:col-span-1 space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
                                    Sélectionner un Rôle
                                </p>
                                {roles.map(role => (
                                    <button
                                        key={role}
                                        onClick={() => handleRoleChange(role)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left font-medium transition-all duration-200 ${
                                            selectedRole === role
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-[1.02]'
                                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Shield className={`w-4 h-4 ${selectedRole === role ? 'text-white' : 'text-slate-400'}`} />
                                            <span className="capitalize">{role.replace('_', ' ')}</span>
                                        </div>
                                        <Badge className={`text-[10px] ${
                                            selectedRole === role 
                                                ? 'bg-white/20 text-white border-transparent' 
                                                : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {rolePermissions[role]?.length || 0} p.
                                        </Badge>
                                    </button>
                                ))}
                            </div>

                            {/* Permissions Matrix Detail */}
                            <div className="lg:col-span-3">
                                <Card className="shadow-lg border-slate-200">
                                    <CardHeader className="border-b bg-slate-50/50">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Shield className="w-5 h-5 text-blue-600" />
                                            Permissions pour le rôle <span className="capitalize text-blue-700">"{selectedRole.replace('_', ' ')}"</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Cochez les droits d'accès globaux applicables à tous les utilisateurs possédant ce rôle.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <form onSubmit={handleSaveRolePermissions} className="space-y-6">
                                            
                                            {Object.entries(permissionsGrouped).map(([module, perms]) => (
                                                <div key={module} className="border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                                                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                                                        Module : {module}
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {perms.map(perm => {
                                                            const isChecked = roleForm.data.permissions.includes(perm.id);
                                                            return (
                                                                <label
                                                                    key={perm.id}
                                                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                                        isChecked
                                                                            ? 'bg-blue-50/50 border-blue-200'
                                                                            : 'bg-white border-slate-150 hover:bg-slate-50'
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={() => handleRolePermissionToggle(perm.id)}
                                                                        className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                                                                    />
                                                                    <div>
                                                                        <p className="text-xs font-mono font-bold text-slate-700">
                                                                            {perm.name}
                                                                        </p>
                                                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                                                            {perm.description}
                                                                        </p>
                                                                    </div>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex justify-end pt-4 border-t">
                                                <Button type="submit" disabled={roleForm.processing} className="bg-blue-600 hover:bg-blue-700 px-6">
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Enregistrer la matrice
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Section 2: User Direct Permissions Overrides */}
                    {activeMainTab === 'users' && (
                        <Card className="shadow-lg border-slate-200">
                            <CardHeader className="bg-slate-50/50 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Permissions directes par Utilisateur</CardTitle>
                                    <CardDescription>
                                        Attribuez des droits spécifiques à un utilisateur sans affecter les autres personnes ayant le même rôle.
                                    </CardDescription>
                                </div>
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Rechercher un utilisateur..."
                                        value={userSearch}
                                        onChange={e => setUserSearch(e.target.value)}
                                        className="pl-9 bg-white"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-1/3">Utilisateur</TableHead>
                                            <TableHead>Rôle assigné</TableHead>
                                            <TableHead>Droits directs additionnels</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map(user => (
                                                <TableRow key={user.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900">{user.name}</p>
                                                                <p className="text-xs text-slate-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`capitalize border ${getRoleBadgeColor(user.role)}`}>
                                                            {user.role.replace('_', ' ')}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.direct_permissions.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {user.direct_permissions.map(permId => {
                                                                    // Retrouver le nom de la permission
                                                                    const name = Object.values(permissionsGrouped)
                                                                        .flat()
                                                                        .find(p => p.id === permId)?.name || '';
                                                                    return (
                                                                        <Badge key={permId} variant="outline" className="text-[10px] font-mono border-blue-200 text-blue-700 bg-blue-50/50">
                                                                            {name}
                                                                        </Badge>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-slate-400 italic">Aucun droit spécifique (hérite du rôle)</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleOpenUserEdit(user)}
                                                            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                                                        >
                                                            <User className="w-3.5 h-3.5 mr-1" />
                                                            Détail droits
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                                                    Aucun utilisateur trouvé.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    {/* Dialog/Modal for Direct user permission configuration */}
                    <Dialog open={selectedUserForEdit !== null} onOpenChange={(open) => !open && setSelectedUserForEdit(null)}>
                        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Droits directs pour {selectedUserForEdit?.name}
                                </DialogTitle>
                                <DialogDescription className="text-xs md:text-sm">
                                    Cochez les permissions que vous souhaitez accorder directement à cet utilisateur. Ces droits s'ajoutent aux permissions de son rôle actuel (<span className="font-bold text-slate-700">{selectedUserForEdit?.role.replace('_', ' ')}</span>).
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSaveUserPermissions} className="space-y-4 md:space-y-6 my-2 md:my-4">
                                {Object.entries(permissionsGrouped).map(([module, perms]) => (
                                    <div key={module} className="border border-slate-100 rounded-xl p-3 md:p-4 bg-slate-50/30">
                                        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2 md:mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                            {module}
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                                            {perms.map(perm => {
                                                const isInherited = rolePermissions[selectedUserForEdit?.role || '']?.includes(perm.id);
                                                const isChecked = userForm.data.permissions.includes(perm.id);
                                                
                                                return (
                                                    <label
                                                        key={perm.id}
                                                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all ${
                                                            isInherited
                                                                ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
                                                                : isChecked
                                                                    ? 'bg-blue-50/50 border-blue-200 cursor-pointer'
                                                                    : 'bg-white border-slate-150 hover:bg-slate-50 cursor-pointer'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isInherited || isChecked}
                                                            disabled={isInherited}
                                                            onChange={() => !isInherited && handleUserPermissionToggle(perm.id)}
                                                            className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 disabled:opacity-55 disabled:text-slate-400 shrink-0"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-1.5">
                                                                <span className="text-[11px] md:text-xs font-mono font-bold text-slate-700 truncate">
                                                                    {perm.name}
                                                                </span>
                                                                {isInherited && (
                                                                    <Badge variant="outline" className="text-[9px] bg-slate-100 text-slate-500 py-0 px-1 border-slate-200 shrink-0">
                                                                        Via rôle
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] md:text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2 md:line-clamp-none">
                                                                {perm.description}
                                                            </p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                <DialogFooter className="mt-4 md:mt-6 border-t pt-4 flex flex-col sm:flex-row gap-2 sm:gap-0">
                                    <Button type="button" variant="outline" onClick={() => setSelectedUserForEdit(null)} className="w-full sm:w-auto">
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={userForm.processing} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                                        <Save className="w-4 h-4 mr-2 shrink-0" />
                                        Enregistrer
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                </div>
            </div>
        </AppLayout>
    );
}
