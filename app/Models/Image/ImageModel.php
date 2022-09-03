<?php

namespace App\Models\Image;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageModel extends Model
{
    use HasFactory;

    public $table = "images";
    protected $guarded = [];

    // To polymorphic relationship
    public function imageable()
    {
        return $this->morphTo();
    }
}
