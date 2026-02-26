<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Blotter extends Model
{
    use HasFactory;

    protected $fillable = [
        'complainant_id',
        'respondent_id',
        'incident_date',
        'incident_details',
        'status',
    ];

    protected $casts = [
        'incident_date' => 'datetime',
    ];

    public function complainant(): BelongsTo
    {
        return $this->belongsTo(Constituent::class, 'complainant_id');
    }

    public function respondent(): BelongsTo
    {
        return $this->belongsTo(Constituent::class, 'respondent_id');
    }
}
