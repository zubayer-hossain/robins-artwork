<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the admin login form.
     */
    public function showLogin()
    {
        return Inertia::render('Admin/Auth/Login');
    }

    /**
     * Handle admin login request.
     * Laravel 12: Process admin authentication with enhanced security.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        // Laravel 12: Log login attempt for security audit
        Log::info('Admin login attempt', [
            'email' => $credentials['email'],
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'timestamp' => now()->toISOString()
        ]);

        if (Auth::attempt($credentials, $remember)) {
            $user = Auth::user();
            
            // Laravel 12: Verify user has admin role
            if (!$user->hasRole('admin')) {
                Log::warning('Non-admin user attempted admin login', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames()->toArray(),
                    'ip' => $request->ip()
                ]);
                
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                throw ValidationException::withMessages([
                    'email' => 'Access denied. Admin privileges required.'
                ]);
            }
            
            // Laravel 12: Regenerate session for security
            $request->session()->regenerate();
            
            Log::info('Successful admin login', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip()
            ]);
            
            return redirect()->intended(route('admin.dashboard'))
                ->with('success', 'Welcome back, ' . $user->name . '!');
        }
        
        // Laravel 12: Log failed login attempt
        Log::warning('Failed admin login attempt', [
            'email' => $credentials['email'],
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);
        
        throw ValidationException::withMessages([
            'email' => 'The provided credentials do not match our records.'
        ]);
    }
    
    /**
     * Handle admin logout.
     * Laravel 12: Secure admin logout with session cleanup.
     */
    public function logout(Request $request)
    {
        $user = Auth::user();
        
        if ($user) {
            Log::info('Admin logout', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip()
            ]);
        }
        
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('admin.login')
            ->with('success', 'You have been successfully logged out.');
    }
}
