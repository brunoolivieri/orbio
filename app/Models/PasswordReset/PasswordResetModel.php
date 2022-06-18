<?php

namespace App\Models\PasswordReset;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User\UserModel;

class PasswordResetModel extends Model
{
    use HasFactory;

    protected $table = "password_resets";
    protected $fillable = ["*"];

    public function user(){
        return $this->belongsTo(UserModel::class, "user_id");
    }
}
