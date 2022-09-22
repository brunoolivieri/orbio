<?php

namespace App\Models\Logs;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;

    protected $guarded = [];

    // To polymorphic relationship
    public function logable()
    {
        return $this->morphTo();
    }
}
