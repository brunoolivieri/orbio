<?php

namespace App\Models\PasswordResets;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Models\Users\User;

class PasswordReset extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = "user_id";
    protected $guarded = [];
    const UPDATED_AT = null;

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }
}
