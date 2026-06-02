<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Panne extends Model
{
    use HasFactory;

    protected $fillable = [
        'locomotive_id',
        'type',
        'status',
        'description',
        'failed_at',
    ];

    protected function casts(): array
    {
        return [
            'failed_at' => 'datetime',
        ];
    }

    public function locomotive(): BelongsTo
    {
        return $this->belongsTo(Locomotive::class);
    }

    public function fiches(): HasMany
    {
        return $this->hasMany(Fiche::class);
    }
}
