<?php

namespace App\Models\Users;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
// Custom Models
use Database\Factories\UserFactory;

class User extends Authenticatable
{
    use HasFactory, SoftDeletes, Notifiable;

    protected $guarded = [];

    /*
    * Scope for search
    */
    function scopeSearch($query, $value_searched)
    {
        return $query->when((bool) $value_searched, function ($query) use ($value_searched) {

            if (is_numeric($value_searched)) {
                $query->where('users.id', $value_searched);
            } else {
                $query->where('users.name', 'LIKE', '%' . $value_searched . '%')->orWhere('users.email', 'LIKE', '%' . $value_searched . '%');
            }
        });
    }

    /*
    * Scope for filter
    */
    function scopeFilter($query, $filters)
    {
        return $query->when((bool) $filters, function ($query) use ($filters) {

            foreach ($filters as $index => $filter) {
                $query->where($filter["column"], $filter["value"]);
            }
        });
    }

    /*
    * Relationship with user_complementary_data table
    */
    function personal_document()
    {
        return $this->hasOne("App\Models\PersonalDocuments\PersonalDocument", "user_id");
    }

    /*
    * Relationship with sessions table
    */
    function sessions()
    {
        return $this->hasMany("App\Models\SessionModel", "user_id");
    }

    /*
    * Relationship with profile table
    */
    function profile()
    {
        return $this->belongsTo("App\Models\Profiles\Profile", "profile_id");
    }

    /**
     * Distant relationship with profile_has_module table through profile table
     */
    function profile_modules_relationship()
    {
        return $this->hasManyThrough("App\Models\Pivot\ProfileModule", "App\Models\Profiles\Profile");
    }

    /*
    * Relationship with service_order_has_user table as creator
    */
    function service_order_has_user(string $field)
    {
        return $this->hasMany("App\Models\Pivot\ServiceOrderUser", $field);
    }

    /*
    * Relationship with password_resets table
    */
    function password_reset()
    {
        return $this->hasOne("App\Models\PasswordResets\PasswordReset", "user_id");
    }

    /*
    * Relationship with annual_accesses table
    */
    function annual_accesses()
    {
        return $this->hasOne("App\Models\Accesses\AnnualTraffic", "user_id");
    }

    /*
    * Relationship with devices_accessed table
    */
    function devices_acessed()
    {
        return $this->hasOne("App\Models\Accesses\AccessedDevice", "user_id");
    }

    /**
     * Factory that uses this model for generate random users
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory(): \Illuminate\Database\Eloquent\Factories\Factory
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

    /**
     * First name acessor.
     *
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return string
     */
    public function getFirstNameAttribute()
    {
        return explode(" ", $this->name)[0];
    }

    /**
     * Password mutator.
     *
     * @param $value
     * @return string
     */
    public function setPasswordAttribute(string $password)
    {
        $this->attributes['password'] = Hash::make($password);
    }
}
