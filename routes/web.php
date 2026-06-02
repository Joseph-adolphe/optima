<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('locomotives', \App\Http\Controllers\LocomotiveController::class);
    Route::resource('categories', \App\Http\Controllers\CategorieController::class)
        ->except(['show'])
        ->parameters(['categories' => 'categorie']);

    Route::resource('pannes', \App\Http\Controllers\PanneController::class);

    // Ordres de Travail (Maintenance Préventive)
    Route::get('ordres-travail', [\App\Http\Controllers\OrdreTravailController::class, 'index'])->name('ordres-travail.index');
    Route::put('ordres-travail/{ordreTravail}/statut', [\App\Http\Controllers\OrdreTravailController::class, 'updateStatut'])->name('ordres-travail.updateStatut');

    // Fiches imbriquées sous une panne
    Route::post('pannes/{panne}/fiches', [\App\Http\Controllers\FicheController::class, 'store'])
        ->name('pannes.fiches.store');
    Route::get('pannes/{panne}/fiches/{fiche}', [\App\Http\Controllers\FicheController::class, 'show'])
        ->name('pannes.fiches.show');

    // KPI & Analyse de fiabilité
    Route::get('kpi', [\App\Http\Controllers\KpiController::class, 'index'])
        ->middleware('can:kpi.view')
        ->name('kpi.index');
    Route::get('kpi/{locomotive}', [\App\Http\Controllers\KpiController::class, 'show'])
        ->middleware('can:kpi.view')
        ->name('kpi.show');
    Route::post('kpi/{locomotive}/refresh', [\App\Http\Controllers\KpiController::class, 'refresh'])
        ->middleware('can:kpi.refresh')
        ->name('kpi.refresh');

    // Administration Rôles & Permissions
    Route::get('admin/roles', [\App\Http\Controllers\Admin\AdminRoleController::class, 'index'])
        ->middleware('can:admin.view')
        ->name('admin.roles.index');
    Route::post('admin/roles/update', [\App\Http\Controllers\Admin\AdminRoleController::class, 'updateRolePermissions'])
        ->middleware('can:admin.roles.manage')
        ->name('admin.roles.update');
    Route::post('admin/users/permissions', [\App\Http\Controllers\Admin\AdminRoleController::class, 'updateUserPermissions'])
        ->middleware('can:admin.roles.manage')
        ->name('admin.users.update');
    
    // Administration Utilisateurs
    Route::resource('admin/users', \App\Http\Controllers\Admin\AdminUserController::class)
        ->except(['create', 'edit', 'show'])
        ->names('admin.users');

    // Administration Maintenance Préventive
    Route::get('admin/maintenance', [\App\Http\Controllers\Admin\AdminMaintenanceController::class, 'index'])->name('admin.maintenance.index');
    Route::post('admin/maintenance/cycles', [\App\Http\Controllers\Admin\AdminMaintenanceController::class, 'storeCycle'])->name('admin.maintenance.cycles.store');
    Route::put('admin/maintenance/cycles/{cycle}', [\App\Http\Controllers\Admin\AdminMaintenanceController::class, 'updateCycle'])->name('admin.maintenance.cycles.update');
    Route::delete('admin/maintenance/cycles/{cycle}', [\App\Http\Controllers\Admin\AdminMaintenanceController::class, 'destroyCycle'])->name('admin.maintenance.cycles.destroy');
    Route::post('admin/maintenance/cycles/{cycle}/rules', [\App\Http\Controllers\Admin\AdminMaintenanceController::class, 'storeRule'])->name('admin.maintenance.rules.store');
    Route::put('admin/maintenance/rules/{rule}', [\App\Http\Controllers\Admin\AdminMaintenanceController::class, 'updateRule'])->name('admin.maintenance.rules.update');
    Route::delete('admin/maintenance/rules/{rule}', [\App\Http\Controllers\Admin\AdminMaintenanceController::class, 'destroyRule'])->name('admin.maintenance.rules.destroy');
});

require __DIR__.'/auth.php';
