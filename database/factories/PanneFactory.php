<?php

namespace Database\Factories;

use App\Models\Locomotive;
use Illuminate\Database\Eloquent\Factories\Factory;

class PanneFactory extends Factory
{
    public function definition(): array
    {
        return [
            'locomotive_id' => Locomotive::factory(),
            'type' => fake()->randomElement(['preventive', 'corrective']),
            'status' => fake()->randomElement(['en_cours', 'terminee']),
            'description' => fake()->sentence(10),
            'failed_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
