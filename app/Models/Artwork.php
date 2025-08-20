<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Artwork extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'slug',
        'title',
        'medium',
        'year',
        'size_text',
        'price',
        'status',
        'story',
        'tags',
        'is_original',
        'is_print_available',
    ];

    protected $casts = [
        'story' => 'array',
        'tags' => 'array',
        'is_original' => 'boolean',
        'is_print_available' => 'boolean',
        'year' => 'integer',
        'price' => 'decimal:2',
    ];

    public function editions()
    {
        return $this->hasMany(Edition::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getPrimaryImageAttribute()
    {
        return $this->getMedia('artwork-images')
            ->where('custom_properties->is_primary', true)
            ->first();
    }

    public function getImagesAttribute()
    {
        return $this->getMedia('artwork-images')->sortBy('order_column');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('artwork-images')
            ->useDisk('public')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->registerMediaConversions(function (Media $media) {
                $this->addMediaConversion('thumb')
                    ->width(400)
                    ->height(400)
                    ->fit('crop', 400, 400)
                    ->performOnCollections('artwork-images');

                $this->addMediaConversion('medium')
                    ->width(1000)
                    ->height(1000)
                    ->fit('crop', 1000, 1000)
                    ->performOnCollections('artwork-images');

                $this->addMediaConversion('xl')
                    ->width(2000)
                    ->height(2000)
                    ->fit('crop', 2000, 2000)
                    ->performOnCollections('artwork-images');
            });
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'published')
            ->where(function ($q) {
                $q->whereNotNull('price')
                    ->orWhereHas('editions', function ($eq) {
                        $eq->where('stock', '>', 0);
                    });
            });
    }

    public function scopePriceMin($query, $value)
    {
        if ($value && is_numeric($value)) {
            return $query->where('price', '>=', $value);
        }
        return $query;
    }

    public function scopePriceMax($query, $value)
    {
        if ($value && is_numeric($value)) {
            return $query->where('price', '<=', $value);
        }
        return $query;
    }
}
