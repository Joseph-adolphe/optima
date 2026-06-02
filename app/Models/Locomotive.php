<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Locomotive extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'model',
        'commissioned_at',
        'photo_path',
        'categorie_id',
        'famille_id',
        'serie_id',
        'maintenance_cycle_id',
        'kilometrage_actuel',
    ];

    protected function casts(): array
    {
        return [
            'commissioned_at' => 'date',
        ];
    }

    protected $appends = ['photo_url'];

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }

    public function famille(): BelongsTo
    {
        return $this->belongsTo(Famille::class);
    }

    public function serie(): BelongsTo
    {
        return $this->belongsTo(Serie::class);
    }

    public function pannes(): HasMany
    {
        return $this->hasMany(Panne::class);
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo_path ? Storage::url($this->photo_path) : null;
    }

    public function maintenanceCycle(): BelongsTo
    {
        return $this->belongsTo(MaintenanceCycle::class);
    }

    public function ordresTravail(): HasMany
    {
        return $this->hasMany(OrdreTravail::class);
    }
}
