<?php

namespace App\Models\Users;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use App\Models\PersonalDocuments\PersonalDocument;
use App\Models\Profiles\Profile;
use App\Models\Modules\Module;
use App\Models\ServiceOrders\ServiceOrder;
use App\Models\PasswordResets\PasswordReset;
use App\Models\Accesses\AnnualTraffic;
use App\Models\Sessions\Session;

class User extends Authenticatable
{
    use HasFactory, SoftDeletes, Notifiable;

    protected $guarded = [];

    function scopeSearch($query, $value_searched)
    {
        return $query->when((bool) $value_searched, function ($query) use ($value_searched) {

            if (is_numeric($value_searched)) {
                $query->where('users.id', $value_searched);
            } else {
                $query->where('users.name', 'LIKE', '%' . $value_searched . '%')->orWhere('users.email', 'LIKE', '%' . $value_searched);
            }
        });
    }

    function scopeFilter($query, $filters)
    {
        return $query->when((bool) $filters, function ($query) use ($filters) {

            foreach ($filters as $filter) {
                $query->where($filter["column"], $filter["value"]);
            }
        });
    }

    function personal_document()
    {
        return $this->hasOne(PersonalDocument::class, "user_id");
    }

    function profile()
    {
        return $this->belongsTo(Profile::class, "profile_id");
    }

    function modules()
    {
        return $this->hasManyThrough(Module::class, Profile::class);
    }

    function service_orders()
    {
        return $this->belongsToMany(ServiceOrder::class, "service_order_user", "user_id")->withPivot("role")->withTrashed();
    }

    function password_reset()
    {
        return $this->hasMany(PasswordReset::class, "user_id");
    }

    function annual_traffic()
    {
        return $this->hasOne(AnnualTraffic::class, "user_id");
    }

    function sessions()
    {
        return $this->hasMany(Session::class, "user_id");
    }

    public function routeNotificationForMail($notification)
    {
        return $this->email;
    }

    public function getFirstNameAttribute()
    {
        return explode(" ", $this->name)[0];
    }

    protected $casts = [
        'created_at' => 'date:Y-m-d',
        'updated_at' => 'date:Y-m-d',
        'last_access' => 'date:Y-m-d'
    ];
}
