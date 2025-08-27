<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     * Laravel 12: Prevents authenticated users from accessing login pages
     * and redirects them to appropriate dashboard based on their role.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $guard = null): Response
    {
        if (Auth::guard($guard)->check()) {
            $user = Auth::guard($guard)->user();
            
            // Laravel 12: Log access attempt for security audit
            Log::info('Authenticated user attempted to access login page', [
                'user_id' => $user->id,
                'email' => $user->email,
                'roles' => $user->getRoleNames()->toArray(),
                'attempted_url' => $request->fullUrl(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);
            
            // Laravel 12: Redirect based on user role
            if ($user->hasRole('admin')) {
                return redirect()->route('admin.dashboard')
                    ->with('info', 'You are already logged in as an administrator.');
            } elseif ($user->hasRole('customer')) {
                return redirect()->route('dashboard')
                    ->with('info', 'You are already logged in as a customer.');
            }
            
            // Fallback redirect for users without specific roles
            return redirect()->route('home')
                ->with('info', 'You are already logged in.');
        }

        return $next($request);
    }
}
