import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
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
import { UserPlus, Pencil, Trash2, Search, Save } from 'lucide-react';

interface Role {
    id: number;
    name: string;
    description: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    role?: Role;
}

interface Props {
    users: User[];
    roles: Role[];
}

export default function UsersIndex({ users, roles }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: '',
    });

    const openCreateModal = () => {
        clearErrors();
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (user: User) => {
        clearErrors();
        setData({
            name: user.name,
            email: user.email,
            password: '', // Leave blank unless changing
            role_id: user.role_id.toString(),
        });
        setSelectedUser(user);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        
        put(route('admin.users.update', selectedUser.id), {
            onSuccess: () => {
                setSelectedUser(null);
                reset();
            },
        });
    };

    const handleDelete = () => {
        if (!selectedUser) return;
        
        destroy(route('admin.users.destroy', selectedUser.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
            },
        });
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.role?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="Gestion des Utilisateurs - OPTIMA ONE" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Utilisateurs
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Gérer les comptes utilisateurs et assigner des rôles.
                            </p>
                        </div>
                        
                        <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Nouvel utilisateur
                        </Button>
                    </div>

                    <Card className="shadow-lg border-slate-200">
                        <CardHeader className="bg-slate-50/50 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Rechercher un utilisateur (nom, email, rôle)..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-white"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rôle</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map(user => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium text-slate-900">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell className="text-slate-500">
                                                    {user.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="capitalize" variant="outline">
                                                        {user.role ? user.role.name.replace('_', ' ') : 'Aucun'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEditModal(user)}
                                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openDeleteModal(user)}
                                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
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

                    {/* Create Modal */}
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Ajouter un Utilisateur</DialogTitle>
                                <DialogDescription>Créez un nouveau compte pour un collaborateur.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Jean Dupont"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="jean@optimaone.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role_id">Rôle</Label>
                                    <select
                                        id="role_id"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={data.role_id}
                                        onChange={e => setData('role_id', e.target.value)}
                                    >
                                        <option value="">Sélectionner un rôle</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>
                                                {role.name.replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.role_id && <p className="text-red-500 text-xs">{errors.role_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Annuler</Button>
                                    <Button type="submit" disabled={processing} className="bg-blue-600 text-white">Créer</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Modal */}
                    <Dialog open={!!selectedUser && !isDeleteModalOpen} onOpenChange={(open) => !open && setSelectedUser(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Modifier l'Utilisateur</DialogTitle>
                                <DialogDescription>Mettez à jour les informations du collaborateur.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEdit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Nom</Label>
                                    <Input
                                        id="edit-name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-role_id">Rôle</Label>
                                    <select
                                        id="edit-role_id"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={data.role_id}
                                        onChange={e => setData('role_id', e.target.value)}
                                    >
                                        <option value="">Sélectionner un rôle</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>
                                                {role.name.replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.role_id && <p className="text-red-500 text-xs">{errors.role_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-password">Nouveau mot de passe (laisser vide pour ne pas modifier)</Label>
                                    <Input
                                        id="edit-password"
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setSelectedUser(null)}>Annuler</Button>
                                    <Button type="submit" disabled={processing} className="bg-blue-600 text-white">Enregistrer</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Confirm Modal */}
                    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirmer la suppression</DialogTitle>
                                <DialogDescription>
                                    Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.name} ? Cette action est irréversible.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Annuler</Button>
                                <Button type="button" variant="destructive" onClick={handleDelete} disabled={processing}>
                                    Supprimer
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>
            </div>
        </AppLayout>
    );
}
