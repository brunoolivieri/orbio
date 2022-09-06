<?php

namespace App\Models\PasswordResets;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    use HasFactory;

    protected $table = "password_resets";
    protected $primary = "user_id";
    protected $guarded = [];
    const UPDATED_AT = null;

    public function user()
    {
        return $this->belongsTo("App\Models\Users\User", "user_id");
    }
}
