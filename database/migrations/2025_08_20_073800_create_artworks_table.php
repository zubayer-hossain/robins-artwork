<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artworks', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('medium');
            $table->integer('year')->nullable();
            $table->string('size_text')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->enum('status', ['draft', 'published', 'sold'])->default('draft');
            $table->json('story')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_original')->default(true);
            $table->boolean('is_print_available')->default(false);
            $table->timestamps();

            // Fulltext index for search (MySQL 5.7+)
            // Note: JSON columns cannot be used in fulltext indexes directly
            $table->fullText(['title']);
            
            // Add regular indexes for better performance
            $table->index(['status', 'medium']);
            $table->index(['price']);
            $table->index(['year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artworks');
    }
};
