<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KpiCache extends Model
{
    use HasFactory;

    protected $table = 'kpi_cache';

    protected $fillable = [
        'locomotive_id',
        'type',
        'period',
        'mtbf',
        'mttr',
        'availability',
        'computed_at',
    ];

    protected function casts(): array
    {
        return [
            'computed_at' => 'datetime',
            'mtbf' => 'decimal:2',
            'mttr' => 'decimal:2',
            'availability' => 'decimal:2',
        ];
    }

    public function locomotive(): BelongsTo
    {
        return $this->belongsTo(Locomotive::class);
    }
}
