<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureNotBanned
{
    /**
     * If the user is banned, log them out and redirect to login with message.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) {
            return $next($request);
        }

        if ($user->is_shadow_banned ?? false) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            $message = 'Your account has been banned. If you believe this is an error, please contact us via the contact page.';
            if ($request->expectsJson()) {
                return response()->json(['message' => $message], 403);
            }
            $loginRoute = str_starts_with($request->path(), 'admin') ? 'admin.login' : 'login';
            return redirect()->route($loginRoute)->with('error', $message);
        }

        return $next($request);
    }
}
