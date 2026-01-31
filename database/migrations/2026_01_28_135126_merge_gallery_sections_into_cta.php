<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration merges the gallery 'features' and 'footer_info' sections into 'cta'
     */
    public function up(): void
    {
        // Move features section to cta
        DB::table('cms_settings')
            ->where('page', 'gallery')
            ->where('section', 'features')
            ->update(['section' => 'cta']);

        // Move footer_info section to cta
        DB::table('cms_settings')
            ->where('page', 'gallery')
            ->where('section', 'footer_info')
            ->update(['section' => 'cta']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Move feature fields back to features section
        DB::table('cms_settings')
            ->where('page', 'gallery')
            ->where('section', 'cta')
            ->where('key', 'like', 'feature%')
            ->update(['section' => 'features']);

        // Move info fields back to footer_info section
        DB::table('cms_settings')
            ->where('page', 'gallery')
            ->where('section', 'cta')
            ->where('key', 'like', 'info%')
            ->update(['section' => 'footer_info']);
    }
};
