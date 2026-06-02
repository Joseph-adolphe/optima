<?php

namespace Database\Factories;

use App\Models\Panne;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class FicheFactory extends Factory
{
    public function definition(): array
    {
        $startedAt = Carbon::instance(fake()->dateTimeBetween('-5 months', 'now'));
        $endedAt = (clone $startedAt)->addHours(fake()->numberBetween(1, 48));
        
        return [
            'panne_id' => Panne::factory(),
            'step' => fake()->numberBetween(1, 5),
            'payload' => ['observations' => fake()->sentence(), 'pieces_remplacees' => ['Vanne 3 voies', 'Compresseur']],
            'started_at' => $startedAt,
            'ended_at' => clone $endedAt,
            'repair_duration' => $endedAt->diffInMinutes($startedAt),
            'technician' => fake()->name(),
            'notes' => fake()->paragraph(),
        ];
    }
}
