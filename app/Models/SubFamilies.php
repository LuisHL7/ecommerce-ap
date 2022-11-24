<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubFamilies extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'family_id'
    ];

    public function family()
    {
        return $this->belongsTo(Families::class);
    }

    public function products()
    {
        return $this->hasMany(Products::class);
    }
}
