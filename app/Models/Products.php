<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'holded_id',
        'family_id',
        'subfamily_id',
        'season',
        'stock',
        'price_spain',
        'main_image',
        'second_image',
        'third_image',
        'dosier',
    ];

    public function subFamily()
    {
        return $this->belongsTo(SubFamilies::class);
    }

    public function family()
    {
        return $this->belongsTo(Families::class);
    }

    public function variants()
    {
        return $this->hasMany(Variants::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Orders::class);
    }
}
