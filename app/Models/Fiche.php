<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Fiche extends Model
{
    use HasFactory;

    protected $fillable = [
        'panne_id',
        'ordre_travail_id',
        'step',
        'payload',
        'started_at',
        'ended_at',
        'repair_duration',
        'technician',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
            'repair_duration' => 'integer',
        ];
    }

    public function panne(): BelongsTo
    {
        return $this->belongsTo(Panne::class);
    }

    public function ordreTravail(): BelongsTo
    {
        return $this->belongsTo(OrdreTravail::class, 'ordre_travail_id');
    }
}
