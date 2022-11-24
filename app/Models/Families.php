<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Families extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function subFamilies()
    {
        return $this->hasMany(SubFamilies::class);
    }

    public function products()
    {
        return $this->hasMany(Products::class);
    }
}
