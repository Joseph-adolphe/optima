<?php

namespace Database\Factories;

use App\Models\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;

class LocomotiveFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'             => 'LOC-' . fake()->unique()->numberBetween(1000, 9999),
            'categorie_id'     => Categorie::factory(),
            'commissioned_at'  => fake()->dateTimeBetween('-10 years', '-1 year')->format('Y-m-d'),
            'photo_path'       => null,
        ];
    }
}

