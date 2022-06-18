<?php

namespace App\Models\PasswordReset;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User\UserModel;

class PasswordResetModel extends Model
{
    use HasFactory;

    protected $table = "password_resets";
    protected $guarded = [];
    const UPDATED_AT = null;

    public function user(){
        return $this->belongsTo(UserModel::class, "user_id");
    }
}
