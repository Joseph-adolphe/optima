<?php

namespace Database\Seeders;

use App\Models\Categorie;
use Illuminate\Database\Seeder;

class CategorieSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'nom'         => 'Locomotives Diesel',
                'description' => 'Locomotives à traction diesel, utilisées principalement sur les lignes non électrifiées.',
            ],
            [
                'nom'         => 'Locomotives Électriques',
                'description' => 'Locomotives à traction électrique, alimentées par caténaire ou rail conducteur.',
            ],
            [
                'nom'         => 'Locomotives Hybrides',
                'description' => 'Locomotives combinant motorisation diesel et électrique pour une plus grande flexibilité.',
            ],
            [
                'nom'         => 'Automotrices',
                'description' => 'Rames automotrices intégrant leur propre motorisation sans locomotive séparée.',
            ],
            [
                'nom'         => 'Locomotives à Vapeur',
                'description' => 'Locomotives historiques à propulsion par vapeur d\'eau.',
            ],
        ];

        foreach ($categories as $data) {
            Categorie::updateOrCreate(
                ['nom' => $data['nom']],
                ['description' => $data['description']]
            );
        }
    }
}
