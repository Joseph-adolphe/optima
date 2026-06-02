<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MaintenanceCycle extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
    ];

    public function rules(): HasMany
    {
        return $this->hasMany(MaintenanceRule::class);
    }

    public function locomotives(): HasMany
    {
        return $this->hasMany(Locomotive::class);
    }
}
