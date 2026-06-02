<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index()
    {
        Gate::authorize('admin.view');

        return Inertia::render('Admin/Users/Index', [
            'users' => User::with('role')->get(),
            'roles' => Role::all(),
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('admin.view');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        User::create($validated);

        return redirect()->back()->with('success', 'Utilisateur créé avec succès.');
    }

    public function update(Request $request, User $user)
    {
        Gate::authorize('admin.view');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'role_id' => 'required|exists:roles,id',
        ]);

        if ($request->filled('password')) {
            $request->validate(['password' => 'string|min:8']);
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'Utilisateur mis à jour.');
    }

    public function destroy(User $user)
    {
        Gate::authorize('admin.view');
        $user->delete();
        return redirect()->back()->with('success', 'Utilisateur supprimé.');
    }
}
