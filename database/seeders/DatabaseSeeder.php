<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\Fiche;
use App\Models\Locomotive;
use App\Models\Panne;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RoleSeeder::class);
        $this->call(PermissionSeeder::class);
        $this->call(CategorieSeeder::class);

        // 1. Création des utilisateurs par rôle
        User::factory()->directeur()->create([
            'name'  => 'Directeur Général',
            'email' => 'directeur@optimaone.com',
        ]);

        User::factory()->chefAtelier()->create([
            'name'  => 'Chef Atelier',
            'email' => 'chef@optimaone.com',
        ]);

        User::factory()->coordinateur()->create([
            'name'  => 'Coordinateur Maintenance',
            'email' => 'coord@optimaone.com',
        ]);

        User::factory()->responsable()->create([
            'name'  => 'Responsable Sécurité',
            'email' => 'responsable@optimaone.com',
        ]);

        // 2. Création des cycles de maintenance
        $cycleFret = \App\Models\MaintenanceCycle::create([
            'nom' => 'Cycle Standard Fret',
            'description' => 'Cycle de maintenance pour les locomotives de fret lourd.',
        ]);

        \App\Models\MaintenanceRule::create([
            'maintenance_cycle_id' => $cycleFret->id,
            'nom' => 'Visite Annuelle (VA)',
            'type' => 'calendaire',
            'intervalle' => 365,
            'seuil_alerte' => 30,
        ]);

        \App\Models\MaintenanceRule::create([
            'maintenance_cycle_id' => $cycleFret->id,
            'nom' => 'Visite Bisannuelle (VB)',
            'type' => 'kilometrique',
            'intervalle' => 50000,
            'seuil_alerte' => 2000,
        ]);

        // 3. Création des locomotives réparties sur les catégories existantes
        $categories = Categorie::all();

        $locomotives = $categories->map(function ($cat) use ($cycleFret) {
            return Locomotive::factory(2)->create([
                'categorie_id' => $cat->id,
                'maintenance_cycle_id' => $cycleFret->id,
                'kilometrage_actuel' => rand(10000, 100000),
            ]);
        })->flatten();

        // 4. Création des pannes et fiches
        $locomotives->each(function ($loco) {
            Panne::factory(3)->create([
                'locomotive_id' => $loco->id,
            ])->each(function ($panne) {
                if ($panne->status === 'terminee') {
                    Fiche::factory()->create([
                        'panne_id'   => $panne->id,
                        'started_at' => $panne->failed_at->addDay(),
                    ]);
                }
            });
        });

        // 5. Générer les OTs initiaux
        \Illuminate\Support\Facades\Artisan::call('maintenance:generate');
    }
}
