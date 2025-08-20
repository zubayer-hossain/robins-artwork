<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('artwork_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('edition_id')->nullable()->constrained()->onDelete('set null');
            $table->integer('qty');
            $table->decimal('unit_price', 10, 2);
            $table->string('title_snapshot');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
