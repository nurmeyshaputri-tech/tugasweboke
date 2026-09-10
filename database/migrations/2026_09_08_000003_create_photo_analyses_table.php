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
        Schema::create('photo_analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photo_id')->nullable()->constrained('photos')->nullOnDelete();
            $table->integer('lighting_score')->default(95);
            $table->integer('expression_score')->default(88);
            $table->integer('composition_score')->default(90);
            $table->integer('clarity_score')->default(94);
            $table->integer('overall_score')->default(92);
            $table->string('mood_tag')->default('Ceria');
            $table->json('recommendations')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photo_analyses');
    }
};
