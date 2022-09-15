<?php

namespace App\Models\Sessions;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Users\User;

class Session extends Model
{
    use HasFactory;

    protected $table = "sessions";

    function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
}
