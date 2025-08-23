<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            ArtworkSeeder::class,
            EditionSeeder::class,
            AddressSeeder::class,
            OrderSeeder::class,
            CartSeeder::class,
            FavoritesSeeder::class,
            RecentViewsSeeder::class,
        ]);
    }
}
