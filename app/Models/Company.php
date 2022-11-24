<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'holded_id',
        'currency',
        'language',
        'type',
        'code',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'users_companies');
    }

    public function orders()
    {
        return $this->hasMany(Orders::class);
    }

    public function address()
    {
        return $this->hasMany(Address::class);
    }
}
