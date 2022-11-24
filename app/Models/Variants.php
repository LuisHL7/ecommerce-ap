<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variants extends Model
{
    use HasFactory;

    public function product()
    {
        return $this->belongsTo(Products::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Orders::class);
    }
}
