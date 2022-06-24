<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserComplementaryDataModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "user_complementary_data";
    protected $guarded = [];
    public $timestamps = false;

    /*
    * Relationship with users table
    */
    function user(){
        return $this->hasOne("App\Models\User\UserModel", "complementary_data_id");
    }

    /*
    * Relationship with address table
    */
    function address(){
        return $this->belongsTo("App\Models\User\UserAddressModel", "address_id");
    }

}
