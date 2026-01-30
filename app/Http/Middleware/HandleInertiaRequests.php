<?php

namespace App\Http\Middleware;

use App\Models\CmsSetting;
use App\Services\CmsService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        // Get global CMS settings for use across all pages (header, footer, etc.)
        $globalSettings = CmsSetting::getPageSettings('global');
        
        // Get currency settings
        $currencyCode = CmsService::getDefaultCurrency();
        $currencySymbol = CmsService::getCurrencySymbol($currencyCode);
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles ? $user->roles->pluck('name')->toArray() : [],
                ] : null,
            ],
            'globalSettings' => $globalSettings,
            'currency' => [
                'code' => $currencyCode,
                'symbol' => $currencySymbol,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
        ];
    }
}
