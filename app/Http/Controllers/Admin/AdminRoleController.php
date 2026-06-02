<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\RolePermission;
use App\Models\User;
use App\Models\UserPermission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AdminRoleController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('admin.view');

        $permissions = Permission::all()->groupBy('module');

        $dbRoles = \App\Models\Role::orderBy('name')->get();
        $roles = $dbRoles->pluck('name')->toArray();
        $rolePermissions = [];

        foreach ($dbRoles as $role) {
            $rolePermissions[$role->name] = RolePermission::where('role_id', $role->id)
                ->pluck('permission_id')
                ->toArray();
        }

        $users = User::with('role')->orderBy('name')
            ->get(['id', 'name', 'email', 'role_id'])
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role ? $u->role->name : 'responsable',
                    'direct_permissions' => $u->directPermissions()->pluck('permissions.id')->toArray(),
                ];
            });

        return Inertia::render('Admin/Roles', [
            'permissionsGrouped' => $permissions,
            'rolePermissions' => $rolePermissions,
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function updateRolePermissions(Request $request): RedirectResponse
    {
        Gate::authorize('admin.roles.manage');

        $request->validate([
            'role' => 'required|string|exists:roles,name',
            'permissions' => 'present|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $roleName = $request->input('role');
        $roleModel = \App\Models\Role::where('name', $roleName)->firstOrFail();
        $permissionIds = $request->input('permissions');

        RolePermission::where('role_id', $roleModel->id)->delete();

        foreach ($permissionIds as $permId) {
            RolePermission::create([
                'role_id' => $roleModel->id,
                'permission_id' => $permId,
            ]);
        }

        return redirect()->back()->with('success', "Permissions du rôle '{$roleName}' mises à jour avec succès.");
    }

    public function updateUserPermissions(Request $request): RedirectResponse
    {
        Gate::authorize('admin.roles.manage');

        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'permissions' => 'present|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $userId = $request->input('user_id');
        $permissionIds = $request->input('permissions');

        UserPermission::where('user_id', $userId)->delete();

        foreach ($permissionIds as $permId) {
            UserPermission::create([
                'user_id' => $userId,
                'permission_id' => $permId,
            ]);
        }

        return redirect()->back()->with('success', 'Permissions directes de l\'utilisateur mises à jour avec succès.');
    }
}
