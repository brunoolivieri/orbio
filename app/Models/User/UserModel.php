<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
// Custom Models
use Database\Factories\UserFactory;

class UserModel extends Authenticatable
{
    use HasFactory, SoftDeletes, Notifiable;

    protected $table = "users";
    protected $guarded = [];

    /*
    * Relationship with user_complementary_data table
    */
    function complementary_data(){
        return $this->belongsTo("App\Models\User\UserComplementaryDataModel", "complementary_data_id");
    }

    /*
    * Relationship with sessions table
    */
    function sessions(){
        return $this->hasMany("App\Models\SessionModel", "user_id");
    }

    /*
    * Relationship with profile table
    */
    function profile(){
        return $this->belongsTo("App\Models\Profiles\ProfileModel", "profile_id");
    }

    /**
    * Distant relationship with profile_has_module table through profile table
    */
    function profile_modules_relationship(){
        return $this->hasManyThrough("App\Models\Pivot\ProfileHasModuleModel", "App\Models\Profiles\ProfileModel");
    }

    /*
    * Relationship with service_order_has_user table
    */
    function service_order_has_user(){
        return $this->hasMany("App\Models\Pivot\ServiceOrderHasUserModel", "user_id");
    }

    /*
    * Relationship with password_resets table
    */
    function password_resets(){
        return $this->hasOne("App\Models\PasswordReset\PasswordResetModel", "user_id");
    }

    /**
    * Factory that uses this model for generate random users
    *
    * @return \Illuminate\Database\Eloquent\Factories\Factory
    */
    protected static function newFactory() : \Illuminate\Database\Eloquent\Factories\Factory
    {
        return UserFactory::new();
    }

    /**
     * Route notifications for the mail channel.
     *
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return string
     */
    public function routeNotificationForMail($notification)
    {
        return $this->email;
    }

}
