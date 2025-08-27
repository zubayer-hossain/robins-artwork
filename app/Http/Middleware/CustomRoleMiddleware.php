<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpFoundation\Response;

class CustomRoleMiddleware
{
    /**
     * Handle an incoming request.
     * Laravel 12: Custom role middleware that redirects instead of throwing 403 errors.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role, $guard = null): Response
    {
        $authGuard = app('auth')->guard($guard);
        
        if ($authGuard->guest()) {
            throw UnauthorizedException::notLoggedIn();
        }
        
        $user = $authGuard->user();
        
        // Laravel 12: Check if user has the required role
        if (!$user->hasRole($role)) {
            Log::warning('CustomRoleMiddleware: Role access denied', [
                'user_id' => $user->id,
                'email' => $user->email,
                'required_role' => $role,
                'user_roles' => $user->getRoleNames()->toArray(),
                'ip' => $request->ip(),
                'url' => $request->fullUrl(),
                'referer' => $request->header('referer')
            ]);
            
            // Laravel 12: User-friendly redirect based on role and previous page
            if ($user->hasRole('customer') && $role === 'admin') {
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
            } elseif ($user->hasRole('admin') && $role === 'customer') {
                // Admin trying to access customer area - redirect to admin dashboard
                return redirect()->route('admin.dashboard')
                    ->with('info', 'Access restricted to customers only.');
            }
            
            // Fallback for users without proper roles
            return redirect()->route('home')
                ->with('error', 'Access denied. Please contact support.');
        }
        
        return $next($request);
    }
}
