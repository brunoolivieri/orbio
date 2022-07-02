<?php

namespace App\Models\Profiles;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProfileModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "profiles";
    protected $guarded=[];

    /*
    * Relationship with user table
    */
    function user(){

        return $this->hasMany("App\Models\User\UserModel", "profile_id");

    }

    /*
    * Relationship with profilehasmodule table
    */
    function module_privileges(){

        return $this->hasMany("App\Models\Pivot\ProfileHasModuleModel", "profile_id");

    }
   
}
