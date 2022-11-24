<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_id',
        'dueDate',
        'notes',
        'address',
        'city',
        'state',
        'zip',
        'country',
        'countryCode',
        'paymentMethod',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function products()
    {
        return $this->belongsToMany(Products::class)->withPivot('quantity');
    }

    public function variants()
    {
        return $this->belongsToMany(Variants::class)->withPivot('quantity');
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }
}
