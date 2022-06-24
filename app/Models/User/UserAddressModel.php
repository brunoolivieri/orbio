<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserAddressModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "address";
    protected $guarded = [];
    public $timestamps = false;


    /*
    * Relationship with user_complementary_data table
    */
    function complementary_data(){
        $this->hasOne("App\Models\User\UserComplementaryDataModel", "address_id");
    }

}
