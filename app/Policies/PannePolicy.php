<?php

namespace App\Policies;

use App\Models\Panne;
use App\Models\User;

class PannePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('pannes.view');
    }

    public function view(User $user, Panne $panne): bool
    {
        return $user->hasPermission('pannes.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('pannes.create');
    }

    public function update(User $user, Panne $panne): bool
    {
        return $user->hasPermission('pannes.update');
    }

    public function delete(User $user, Panne $panne): bool
    {
        return $user->hasPermission('pannes.delete');
    }

    public function restore(User $user, Panne $panne): bool
    {
        return $user->hasPermission('pannes.delete');
    }

    public function forceDelete(User $user, Panne $panne): bool
    {
        return $user->hasPermission('pannes.delete');
    }
}
