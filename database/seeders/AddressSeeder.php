<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Address;
use App\Models\User;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing users
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        foreach ($users as $user) {
            // Create shipping addresses
            Address::create([
                'user_id' => $user->id,
                'type' => 'shipping',
                'label' => 'Home',
                'name' => $user->name . ' Smith',
                'company' => null,
                'address_line_1' => '123 Highland Road',
                'address_line_2' => 'Apt 4B',
                'city' => 'Edinburgh',
                'state_province' => 'Scotland',
                'postal_code' => 'EH1 1AA',
                'country' => 'United Kingdom',
                'phone' => '+44 131 123 4567',
                'is_default' => true,
            ]);

            Address::create([
                'user_id' => $user->id,
                'type' => 'shipping',
                'label' => 'Office',
                'name' => $user->name . ' Smith',
                'company' => 'Highland Art Gallery',
                'address_line_1' => '456 Royal Mile',
                'address_line_2' => 'Floor 2',
                'city' => 'Edinburgh',
                'state_province' => 'Scotland',
                'postal_code' => 'EH2 2BB',
                'country' => 'United Kingdom',
                'phone' => '+44 131 987 6543',
                'is_default' => false,
            ]);

            // Create billing addresses
            Address::create([
                'user_id' => $user->id,
                'type' => 'billing',
                'label' => 'Primary Billing',
                'name' => $user->name . ' Smith',
                'company' => null,
                'address_line_1' => '123 Highland Road',
                'address_line_2' => 'Apt 4B',
                'city' => 'Edinburgh',
                'state_province' => 'Scotland',
                'postal_code' => 'EH1 1AA',
                'country' => 'United Kingdom',
                'phone' => '+44 131 123 4567',
                'is_default' => true,
            ]);

            // Create a combined address (both shipping and billing)
            Address::create([
                'user_id' => $user->id,
                'type' => 'shipping',
                'label' => 'Summer House',
                'name' => $user->name . ' Smith',
                'company' => null,
                'address_line_1' => '789 Loch View',
                'address_line_2' => null,
                'city' => 'Inverness',
                'state_province' => 'Highlands',
                'postal_code' => 'IV1 1CC',
                'country' => 'United Kingdom',
                'phone' => '+44 1463 123 456',
                'is_default' => false,
            ]);
        }

        $this->command->info('Addresses seeded successfully!');
    }
}
