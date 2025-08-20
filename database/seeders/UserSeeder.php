<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@demo.test',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Create demo customer
        $customer = User::create([
            'name' => 'Demo Customer',
            'email' => 'customer@demo.test',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $customer->assignRole('customer');

        // Create additional demo customers
        User::factory(5)->create()->each(function ($user) {
            $user->assignRole('customer');
        });
    }
}
