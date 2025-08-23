<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'label',
        'name',
        'company',
        'address_line_1',
        'address_line_2',
        'city',
        'state_province',
        'postal_code',
        'country',
        'phone',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shippingOrders()
    {
        return $this->hasMany(Order::class, 'shipping_address_id');
    }

    public function billingOrders()
    {
        return $this->hasMany(Order::class, 'billing_address_id');
    }

    // Get name (alias for consistency)
    public function getFullNameAttribute()
    {
        return $this->name;
    }

    // Get formatted address
    public function getFormattedAddressAttribute()
    {
        $parts = [
            $this->address_line_1,
            $this->address_line_2,
            $this->city . ', ' . $this->state_province . ' ' . $this->postal_code,
            $this->country,
        ];

        return implode("\n", array_filter($parts));
    }

    // Get compact address (for display in lists)
    public function getCompactAddressAttribute()
    {
        return $this->city . ', ' . $this->state_province;
    }

    // Scope for default addresses
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    // Scope for shipping addresses
    public function scopeShipping($query)
    {
        return $query->where('type', 'shipping');
    }

    // Scope for billing addresses
    public function scopeBilling($query)
    {
        return $query->where('type', 'billing');
    }
}
