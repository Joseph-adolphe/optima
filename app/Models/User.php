<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function hasRole(string ...$roles): bool
    {
        return $this->role && in_array($this->role->name, $roles);
    }

    protected ?array $cachedPermissions = null;

    public function directPermissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions', 'user_id', 'permission_id');
    }

    public function getPermissionsList(): array
    {
        if ($this->cachedPermissions === null) {
            $rolePermissionIds = RolePermission::where('role_id', $this->role_id)->pluck('permission_id');
            $directPermissionIds = UserPermission::where('user_id', $this->id)->pluck('permission_id');
            
            $this->cachedPermissions = Permission::whereIn('id', $rolePermissionIds->merge($directPermissionIds)->unique())
                ->pluck('name')
                ->toArray();
        }

        return $this->cachedPermissions;
    }

    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->getPermissionsList());
    }
}
