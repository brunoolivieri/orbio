<?php

namespace App\Models\Users;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Database\Factories\UserFactory;
// Models
use App\Models\PersonalDocuments\PersonalDocument;
use App\Models\Profiles\Profile;
use App\Models\Modules\Module;
use App\Models\ServiceOrders\ServiceOrder;
use App\Models\PasswordResets\PasswordReset;
use App\Models\Accesses\AnnualTraffic;
use App\Models\Accesses\AccessedDevice;

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

            foreach ($filters as $filter) {
                $query->where($filter["column"], $filter["value"]);
            }
        });
    }

    /*
    * Relationship one to one with personal documents table
    */
    function personal_document()
    {
        return $this->hasOne(PersonalDocument::class, "user_id");
    }

    /*
    * Relationship with profile table
    */
    function profile()
    {
        return $this->belongsTo(Profile::class, "profile_id");
    }

    /**
     * Distant relationship with modules table through profile table
     */
    function modules()
    {
        return $this->hasManyThrough(Module::class, Profile::class);
    }

    /*
    * Relationship many to many with service orders table 
    */
    function service_orders()
    {
        return $this->hasMany(ServiceOrder::class, "user_id");
    }

    /*
    * Relationship one to one with password resets table
    */
    function password_reset()
    {
        return $this->hasOne(PasswordReset::class, "user_id");
    }

    /*
    * Relationship one to one with annual traffic table
    */
    function annual_traffic()
    {
        return $this->hasOne(AnnualTraffic::class, "user_id");
    }

    /*
    * Relationship one to one with devices accessed table
    */
    function devices_acessed()
    {
        return $this->hasOne(AccessedDevice::class, "user_id");
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
