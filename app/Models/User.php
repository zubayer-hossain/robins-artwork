<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Spatie\Permission\Traits\HasRoles;
use MeShaon\RequestAnalytics\Contracts\CanAccessAnalyticsDashboard;

class User extends Authenticatable implements CanAccessAnalyticsDashboard
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, Billable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_shadow_banned',
        'shadow_banned_at',
        'shadow_ban_reason',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_shadow_banned' => 'boolean',
            'shadow_banned_at' => 'datetime',
        ];
    }

    public function isShadowBanned(): bool
    {
        return (bool) $this->is_shadow_banned;
    }

    public function scopeShadowBanned($query)
    {
        return $query->where('is_shadow_banned', true);
    }

    public function scopeNotShadowBanned($query)
    {
        return $query->where('is_shadow_banned', false);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function favorites()
    {
        return $this->hasMany(UserFavorite::class);
    }

    public function recentViews()
    {
        return $this->hasMany(UserRecentView::class);
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function defaultShippingAddress()
    {
        return $this->hasOne(Address::class)->where('type', 'shipping')->where('is_default', true);
    }

    public function defaultBillingAddress()
    {
        return $this->hasOne(Address::class)->where('type', 'billing')->where('is_default', true);
    }

    /**
     * Determine if the user can access the analytics dashboard.
     * Only users with the 'admin' role can access analytics.
     *
     * @return bool
     */
    public function canAccessAnalyticsDashboard(): bool
    {
        return $this->hasRole('admin');
    }
}
