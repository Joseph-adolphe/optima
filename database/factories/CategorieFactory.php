<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategorieFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => fake()->unique()->randomElement([
                'Locomotives Diesel',
                'Locomotives Électriques',
                'Locomotives Hybrides',
                'Locomotives à Vapeur',
                'Automotrices',
                'Autorails',
            ]),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
