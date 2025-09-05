<?php

namespace App\Http\Controllers;

use App\Models\CmsSetting;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    /**
     * Display the about page with CMS settings.
     */
    public function index(): Response
    {
        // Get all About page CMS settings
        $cmsSettings = CmsSetting::getPageSettings('about');

        return Inertia::render('About', [
            'cmsSettings' => $cmsSettings
        ]);
    }
}