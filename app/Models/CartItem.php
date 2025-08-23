<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = [
        'user_id',
        'artwork_id',
        'edition_id',
        'type',
        'quantity',
        'price',
        'name',
        'description',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'price' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function artwork(): BelongsTo
    {
        return $this->belongsTo(Artwork::class);
    }

    public function edition(): BelongsTo
    {
        return $this->belongsTo(Edition::class);
    }

    // Get the item (either artwork or edition)
    public function getItemAttribute()
    {
        return $this->type === 'original' ? $this->artwork : $this->edition;
    }

    // Get total price for this cart item
    public function getTotalPriceAttribute()
    {
        return $this->price * $this->quantity;
    }
}
