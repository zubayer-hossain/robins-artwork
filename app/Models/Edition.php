<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Edition extends Model
{
    use HasFactory;

    protected $fillable = [
        'artwork_id',
        'sku',
        'edition_total',
        'price',
        'stock',
        'is_limited',
    ];

    protected $casts = [
        'edition_total' => 'integer',
        'stock' => 'integer',
        'price' => 'decimal:2',
        'is_limited' => 'boolean',
    ];

    public function artwork()
    {
        return $this->belongsTo(Artwork::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }
}
