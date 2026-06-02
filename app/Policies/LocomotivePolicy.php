<?php

namespace App\Policies;

use App\Models\Locomotive;
use App\Models\User;

class LocomotivePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('locomotives.view');
    }

    public function view(User $user, Locomotive $locomotive): bool
    {
        return $user->hasPermission('locomotives.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('locomotives.create');
    }

    public function update(User $user, Locomotive $locomotive): bool
    {
        return $user->hasPermission('locomotives.update');
    }

    public function delete(User $user, Locomotive $locomotive): bool
    {
        return $user->hasPermission('locomotives.delete');
    }

    public function restore(User $user, Locomotive $locomotive): bool
    {
        return $user->hasPermission('locomotives.delete');
    }

    public function forceDelete(User $user, Locomotive $locomotive): bool
    {
        return $user->hasPermission('locomotives.delete');
    }
}
