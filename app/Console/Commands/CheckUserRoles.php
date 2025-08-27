<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Spatie\Permission\Models\Role;

class CheckUserRoles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'security:audit-roles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Audit user roles for security issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== SECURITY AUDIT: USER ROLES ===');
        $this->newLine();

        $this->info('Users and their roles:');
        $this->info('---------------------');

        $users = User::with('roles')->get();
        $securityIssues = 0;

        foreach ($users as $user) {
            $roles = $user->roles->pluck('name')->toArray();
            
            $this->info("User ID: {$user->id}");
            $this->info("Name: {$user->name}");
            $this->info("Email: {$user->email}");
            $this->info("Roles: " . (empty($roles) ? 'NONE' : implode(', ', $roles)));
            
            // Check for security issues
            if (count($roles) > 1) {
                $this->error("⚠️  SECURITY ISSUE: User has multiple roles!");
                $securityIssues++;
            }
            if (in_array('admin', $roles) && in_array('customer', $roles)) {
                $this->error("🚨 CRITICAL: User has both admin AND customer roles!");
                $securityIssues++;
            }
            $this->newLine();
        }

        $this->info('Available roles:');
        $this->info('---------------');
        $roles = Role::all();
        foreach ($roles as $role) {
            $this->info("Role: {$role->name}");
        }

        $this->newLine();
        if ($securityIssues > 0) {
            $this->error("🚨 FOUND {$securityIssues} SECURITY ISSUE(S)!");
            $this->error('Immediate action required to fix role conflicts.');
        } else {
            $this->info('✅ No security issues found with user roles.');
        }
        
        $this->info('=== END AUDIT ===');
    }
}
