<?php

namespace App\Policies;

use App\Models\Artwork;
use App\Models\User;

class ArtworksPolicy
{
    public function viewAny(?User $user): bool
    {
        return true; // Public can view gallery
    }

    public function view(?User $user, Artwork $artwork): bool
    {
        if ($artwork->status === 'published') {
            return true; // Public can view published artworks
        }

        return $user && $user->hasRole('admin'); // Only admins can view drafts/sold
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Artwork $artwork): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Artwork $artwork): bool
    {
        return $user->hasRole('admin');
    }

    public function restore(User $user, Artwork $artwork): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, Artwork $artwork): bool
    {
        return $user->hasRole('admin');
    }
}
