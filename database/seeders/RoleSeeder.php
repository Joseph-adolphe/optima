<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'directeur',
                'description' => 'Directeur Général avec accès global',
            ],
            [
                'name' => 'chef_atelier',
                'description' => 'Chef d\'Atelier gérant les opérations et l\'administration',
            ],
            [
                'name' => 'coordinateur',
                'description' => 'Coordinateur des pannes et fiches d\'intervention',
            ],
            [
                'name' => 'responsable',
                'description' => 'Responsable de base (accès en lecture)',
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['name' => $role['name']],
                ['description' => $role['description']]
            );
        }
    }
}
