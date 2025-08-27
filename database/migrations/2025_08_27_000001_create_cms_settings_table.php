<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cms_settings', function (Blueprint $table) {
            $table->id();
            $table->string('page')->index(); // home, gallery, about, contact, global
            $table->string('section')->index(); // hero, stats, featured, etc.
            $table->string('key')->index(); // title, description, button_text, etc.
            $table->text('value')->nullable();
            $table->string('type')->default('text'); // text, textarea, image, boolean, number
            $table->text('description')->nullable(); // Help text for admin
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->unique(['page', 'section', 'key']);
            $table->index(['page', 'section']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cms_settings');
    }
};