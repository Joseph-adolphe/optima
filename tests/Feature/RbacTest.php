<?php

namespace Tests\Feature;

use App\Models\Fiche;
use App\Models\Locomotive;
use App\Models\Panne;
use App\Models\Permission;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RbacTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PermissionSeeder::class);
    }

    public function test_roles_have_default_permissions_after_seeding(): void
    {
        $chefAtelier = User::factory()->chefAtelier()->create();
        $coordinateur = User::factory()->coordinateur()->create();
        $directeur = User::factory()->directeur()->create();
        $responsable = User::factory()->responsable()->create();

        $this->assertTrue($chefAtelier->hasPermission('locomotives.create'));
        $this->assertTrue($chefAtelier->hasPermission('admin.view'));

        $this->assertFalse($coordinateur->hasPermission('locomotives.create'));
        $this->assertTrue($coordinateur->hasPermission('pannes.create'));
        $this->assertFalse($coordinateur->hasPermission('admin.view'));

        $this->assertFalse($directeur->hasPermission('pannes.create'));
        $this->assertTrue($directeur->hasPermission('kpi.view'));
        $this->assertFalse($directeur->hasPermission('admin.view'));

        $this->assertFalse($responsable->hasPermission('kpi.view'));
        $this->assertFalse($responsable->hasPermission('admin.view'));
    }

    public function test_kpi_routes_are_guarded_by_permissions(): void
    {
        $directeur = User::factory()->directeur()->create();
        $responsable = User::factory()->responsable()->create();
        $locomotive = Locomotive::factory()->create();

        // Directeur has kpi.view permission -> can access
        $response = $this->actingAs($directeur)->get(route('kpi.index'));
        $response->assertStatus(200);

        // Responsable does not have kpi.view permission -> 403 Forbidden
        $response = $this->actingAs($responsable)->get(route('kpi.index'));
        $response->assertStatus(403);
    }

    public function test_admin_routes_are_guarded_by_permissions(): void
    {
        $chefAtelier = User::factory()->chefAtelier()->create();
        $coordinateur = User::factory()->coordinateur()->create();

        // Chef Atelier has admin.view permission -> can access
        $response = $this->actingAs($chefAtelier)->get(route('admin.roles.index'));
        $response->assertStatus(200);

        // Coordinateur does not have admin.view permission -> 403 Forbidden
        $response = $this->actingAs($coordinateur)->get(route('admin.roles.index'));
        $response->assertStatus(403);
    }

    public function test_fiche_creation_requires_fiche_fill_permission(): void
    {
        $chefAtelier = User::factory()->chefAtelier()->create();
        $coordinateur = User::factory()->coordinateur()->create();
        $panne = Panne::factory()->create();

        // Chef Atelier has fiches.fill permission -> can submit
        $response = $this->actingAs($chefAtelier)->post(route('pannes.fiches.store', $panne), [
            'step' => 1,
            'payload' => [
                'composant' => 'Compresseur',
                'type_defaut' => 'fuite',
                'date_detection' => '2026-06-01',
                'observations' => 'Fuite d\'air importante',
            ]
        ]);
        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('pannes.show', $panne));

        // Coordinateur does not have fiches.fill permission -> 403 Forbidden
        $response = $this->actingAs($coordinateur)->post(route('pannes.fiches.store', $panne), [
            'step' => 1,
            'payload' => [
                'composant' => 'Compresseur',
                'type_defaut' => 'fuite',
                'date_detection' => '2026-06-01',
                'observations' => 'Fuite d\'air importante',
            ]
        ]);
        $response->assertStatus(403);
    }

    public function test_user_direct_permission_overrides_grant_access(): void
    {
        $responsable = User::factory()->responsable()->create();
        $kpiPermission = Permission::where('name', 'kpi.view')->first();

        // By default, Responsable cannot access KPIs
        $this->assertFalse($responsable->hasPermission('kpi.view'));
        $response = $this->actingAs($responsable)->get(route('kpi.index'));
        $response->assertStatus(403);

        // Assign kpi.view permission directly to this user
        $responsable->directPermissions()->attach($kpiPermission);

        // Reload user to clear cached permissions list
        $responsable = $responsable->fresh();

        // Now, they can access KPIs
        $this->assertTrue($responsable->hasPermission('kpi.view'));
        $response = $this->actingAs($responsable)->get(route('kpi.index'));
        $response->assertStatus(200);
    }
}
