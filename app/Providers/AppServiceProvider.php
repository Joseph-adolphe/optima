<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        \Illuminate\Support\Facades\Gate::policy(
            \App\Models\Locomotive::class,
            \App\Policies\LocomotivePolicy::class
        );

        \Illuminate\Support\Facades\Gate::policy(
            \App\Models\Panne::class,
            \App\Policies\PannePolicy::class
        );

        // Intercepteur de Gate pour les permissions dynamiques avec points (ex: kpi.view)
        \Illuminate\Support\Facades\Gate::before(function ($user, $ability) {
            if (str_contains($ability, '.')) {
                return $user->hasPermission($ability);
            }
        });

        // Observer : auto-close panne quand les 4 fiches sont complètes
        \App\Models\Fiche::observe(\App\Observers\PanneObserver::class);
    }
}
