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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('artwork_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('edition_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('type', ['original', 'edition']);
            $table->integer('quantity')->default(1);
            $table->decimal('price', 10, 2);
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('metadata')->nullable(); // For storing additional info like size, etc.
            $table->timestamps();
            
            // Note: Check constraint would be added manually if needed
            // $table->check('(artwork_id IS NOT NULL AND edition_id IS NULL) OR (artwork_id IS NULL AND edition_id IS NOT NULL)');
            
            // Prevent duplicate items for same user
            $table->unique(['user_id', 'artwork_id', 'edition_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
