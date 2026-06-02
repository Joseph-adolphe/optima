<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrdreTravail extends Model
{
    use HasFactory;

    protected $table = 'ordres_travail';

    protected $fillable = [
        'locomotive_id',
        'maintenance_rule_id',
        'statut',
        'date_prevue',
        'kilometrage_prevu',
    ];

    protected $casts = [
        'date_prevue' => 'date',
    ];

    public function locomotive(): BelongsTo
    {
        return $this->belongsTo(Locomotive::class);
    }

    public function rule(): BelongsTo
    {
        return $this->belongsTo(MaintenanceRule::class, 'maintenance_rule_id');
    }

    public function fiches(): HasMany
    {
        return $this->hasMany(Fiche::class);
    }
}
