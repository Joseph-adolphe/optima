<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\RolePermission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Définition des permissions par module
        $permissions = [
            // Module Locomotives
            [
                'name' => 'locomotives.view',
                'module' => 'locomotives',
                'description' => 'Consulter la liste et les détails des locomotives',
            ],
            [
                'name' => 'locomotives.create',
                'module' => 'locomotives',
                'description' => 'Ajouter une nouvelle locomotive',
            ],
            [
                'name' => 'locomotives.update',
                'module' => 'locomotives',
                'description' => 'Modifier les informations d\'une locomotive',
            ],
            [
                'name' => 'locomotives.delete',
                'module' => 'locomotives',
                'description' => 'Supprimer une locomotive de la flotte',
            ],

            // Module Pannes
            [
                'name' => 'pannes.view',
                'module' => 'pannes',
                'description' => 'Consulter la liste et les détails des dossiers de pannes',
            ],
            [
                'name' => 'pannes.create',
                'module' => 'pannes',
                'description' => 'Déclarer une nouvelle panne ou intervention',
            ],
            [
                'name' => 'pannes.update',
                'module' => 'pannes',
                'description' => 'Modifier les symptômes ou détails d\'une panne existante',
            ],
            [
                'name' => 'pannes.delete',
                'module' => 'pannes',
                'description' => 'Supprimer un dossier de panne',
            ],

            // Module Fiches
            [
                'name' => 'fiches.view',
                'module' => 'fiches',
                'description' => 'Consulter les fiches d\'intervention associées à une panne',
            ],
            [
                'name' => 'fiches.fill',
                'module' => 'fiches',
                'description' => 'Remplir et mettre à jour les étapes des fiches (Steps 1 à 4)',
            ],

            // Module KPI
            [
                'name' => 'kpi.view',
                'module' => 'kpi',
                'description' => 'Consulter le tableau de bord de fiabilité, Pareto et AMDEC',
            ],
            [
                'name' => 'kpi.refresh',
                'module' => 'kpi',
                'description' => 'Forcer le recalcul des indicateurs de fiabilité',
            ],

            // Module Admin
            [
                'name' => 'admin.view',
                'module' => 'admin',
                'description' => 'Accéder à l\'interface d\'administration',
            ],
            [
                'name' => 'admin.roles.manage',
                'module' => 'admin',
                'description' => 'Modifier les permissions associées à chaque rôle',
            ],
        ];

        $permissionIdsByName = [];

        foreach ($permissions as $perm) {
            $permission = Permission::updateOrCreate(
                ['name' => $perm['name']],
                [
                    'module' => $perm['module'],
                    'description' => $perm['description'],
                ]
            );
            $permissionIdsByName[$perm['name']] = $permission->id;
        }

        // 2. Attribution des permissions par rôle par défaut
        $defaultRolesPermissions = [
            'chef_atelier' => [
                'locomotives.view', 'locomotives.create', 'locomotives.update', 'locomotives.delete',
                'pannes.view', 'pannes.create', 'pannes.update', 'pannes.delete',
                'fiches.view', 'fiches.fill',
                'kpi.view', 'kpi.refresh',
                'admin.view', 'admin.roles.manage',
            ],
            'coordinateur' => [
                'locomotives.view',
                'pannes.view', 'pannes.create',
                'fiches.view',
                'kpi.view', 'kpi.refresh',
            ],
            'directeur' => [
                'locomotives.view', 'locomotives.create', 'locomotives.update', 'locomotives.delete',
                'pannes.view', 'pannes.create', 'pannes.update', 'pannes.delete',
                'fiches.view', 'fiches.fill',
                'kpi.view', 'kpi.refresh',
                'admin.view', 'admin.roles.manage',
            ],
            'responsable' => [
                'locomotives.view',
                'pannes.view',
                'fiches.view',
            ],
        ];

        // Désactiver temporairement les contraintes pour vider
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        RolePermission::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $rolesInDb = \App\Models\Role::all()->keyBy('name');

        foreach ($defaultRolesPermissions as $roleName => $perms) {
            if (!isset($rolesInDb[$roleName])) continue;
            
            $roleId = $rolesInDb[$roleName]->id;

            foreach ($perms as $permName) {
                if (isset($permissionIdsByName[$permName])) {
                    RolePermission::create([
                        'role_id' => $roleId,
                        'permission_id' => $permissionIdsByName[$permName],
                    ]);
                }
            }
        }
    }
}
