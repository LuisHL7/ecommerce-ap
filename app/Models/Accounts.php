<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accounts extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'holded_id',
        'type',
    ];

    public function orders()
    {
        return $this->hasMany(Orders::class);
    }
}
