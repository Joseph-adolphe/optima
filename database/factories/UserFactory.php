<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role_id' => \App\Models\Role::where('name', 'responsable')->first()->id ?? 1,
            'remember_token' => Str::random(10),
        ];
    }

    public function directeur(): static
    {
        return $this->state(fn (array $attributes) => ['role_id' => \App\Models\Role::where('name', 'directeur')->first()->id]);
    }

    public function chefAtelier(): static
    {
        return $this->state(fn (array $attributes) => ['role_id' => \App\Models\Role::where('name', 'chef_atelier')->first()->id]);
    }

    public function coordinateur(): static
    {
        return $this->state(fn (array $attributes) => ['role_id' => \App\Models\Role::where('name', 'coordinateur')->first()->id]);
    }

    public function responsable(): static
    {
        return $this->state(fn (array $attributes) => ['role_id' => \App\Models\Role::where('name', 'responsable')->first()->id]);
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
