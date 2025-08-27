<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureSingleRole
{
    /**
     * Handle an incoming request.
     * Laravel 12: Prevents users from having multiple roles that could cause security issues.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $requiredRole): Response
    {
        $user = $request->user();
        
        if (!$user) {
            Log::warning('EnsureSingleRole middleware: Unauthenticated access attempt', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl()
            ]);
            return redirect()->route('login');
        }

        // Laravel 12: Check if user has the required role
        if (!$user->hasRole($requiredRole)) {
            Log::warning('EnsureSingleRole middleware: Role access denied', [
                'user_id' => $user->id,
                'email' => $user->email,
                'required_role' => $requiredRole,
                'user_roles' => $user->getRoleNames()->toArray(),
                'ip' => $request->ip(),
                'url' => $request->fullUrl(),
                'referer' => $request->header('referer')
            ]);
            
            // Laravel 12: User-friendly redirect based on role and previous page
            if ($user->hasRole('customer') && $requiredRole === 'admin') {
                // Customer trying to access admin area - redirect to previous page or dashboard
                $previousUrl = $request->header('referer');
                
                // Ensure we don't redirect back to another admin URL
                if ($previousUrl && !str_contains($previousUrl, '/admin')) {
                    return redirect($previousUrl)
                        ->with('info', 'Access restricted to administrators only.');
                }
                
                // Fallback to customer dashboard if no valid previous page
                return redirect()->route('dashboard')
                    ->with('info', 'Access restricted to administrators only.');
            } elseif ($user->hasRole('admin') && $requiredRole === 'customer') {
                // Admin trying to access customer area - redirect to admin dashboard
                return redirect()->route('admin.dashboard')
                    ->with('info', 'Access restricted to customers only.');
            }
            
            // Fallback for users without proper roles
            return redirect()->route('home')
                ->with('error', 'Access denied. Please contact support.');
        }

        // Laravel 12: Extra security - Ensure user ONLY has the required role (no mixed roles)
        $userRoles = $user->getRoleNames();
        
        if ($requiredRole === 'admin') {
            // Admin users should ONLY have admin role
            if ($userRoles->count() > 1 || !$userRoles->contains('admin')) {
                Log::critical('SECURITY ALERT: User with mixed roles attempted admin access', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'roles' => $userRoles->toArray(),
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'url' => $request->fullUrl(),
                    'timestamp' => now()->toISOString()
                ]);
                
                // Laravel 12: Force logout for security
                auth()->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                return redirect()->route('home')
                    ->with('error', 'Security violation detected. You have been logged out. Contact administrator.');
            }
        } elseif ($requiredRole === 'customer') {
            // Customer users should ONLY have customer role
            if ($userRoles->count() > 1 || !$userRoles->contains('customer')) {
                Log::critical('SECURITY ALERT: User with mixed roles attempted customer access', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'roles' => $userRoles->toArray(),
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'url' => $request->fullUrl(),
                    'timestamp' => now()->toISOString()
                ]);
                
                // Laravel 12: Force logout for security
                auth()->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                return redirect()->route('home')
                    ->with('error', 'Security violation detected. You have been logged out. Contact administrator.');
            }
        }

        // Laravel 12: Log successful access for audit trail
        Log::info('Successful role-based access', [
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $requiredRole,
            'url' => $request->fullUrl()
        ]);

        return $next($request);
    }
}