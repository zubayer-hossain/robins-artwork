<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="auth-status" content="{{ auth()->check() ? 'authenticated' : 'guest' }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @inertiaHead
        
        @if (app()->environment('local'))
            @viteReactRefresh
            @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @else
            @php
                $manifestPath = public_path('build/manifest.json');
                $manifest = file_exists($manifestPath) ? json_decode(file_get_contents($manifestPath), true) : [];
            @endphp
            
            @if (isset($manifest['resources/js/app.jsx']))
                <script type="module" src="{{ asset('build/' . $manifest['resources/js/app.jsx']['file']) }}"></script>
            @endif
            
            @if (isset($manifest["resources/js/Pages/{$page['component']}.jsx"]))
                <script type="module" src="{{ asset('build/' . $manifest["resources/js/Pages/{$page['component']}.jsx"]['file']) }}"></script>
            @endif
            
            @if (isset($manifest['resources/js/app.jsx']))
                <link rel="stylesheet" href="{{ asset('build/' . $manifest['resources/js/app.jsx']['css'][0]) }}">
            @endif
        @endif
    </head>
    <body class="font-sans antialiased" 
          data-auth="{{ auth()->check() ? 'true' : 'false' }}"
          data-user-roles="{{ auth()->check() && auth()->user()->roles ? auth()->user()->roles->pluck('name')->implode(',') : '' }}">
        @inertia
    </body>
</html>
