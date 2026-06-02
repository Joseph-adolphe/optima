<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MaintenanceRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'maintenance_cycle_id',
        'nom',
        'type',
        'intervalle',
        'seuil_alerte',
    ];

    public function cycle(): BelongsTo
    {
        return $this->belongsTo(MaintenanceCycle::class, 'maintenance_cycle_id');
    }

    public function ordresTravail(): HasMany
    {
        return $this->hasMany(OrdreTravail::class);
    }
}
