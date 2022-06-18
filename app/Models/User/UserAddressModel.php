<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserAddressModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "address";
    public $timestamps = false;

    /*
    * Relationship with user_complementary_data table
    */
    function complementary_data(){
        $this->hasOne("App\Models\User\UserComplementaryDataModel", "address_id");
    }

}
