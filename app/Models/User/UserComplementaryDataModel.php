<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\SoftDeletes;
// Models
use App\Models\User\UserModel;

class UserComplementaryDataModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "user_complementary_data";
    public $timestamps = ["deleted_at"];

    /*
    * Relationship with users table
    */
    function user(){

        return $this->hasOne("App\Models\User\UserModel", "id_dados_complementares");

    }

    /*
    * Relationship with address table
    */
    function address(){

        return $this->belongsTo("App\Models\User\UserAddressModel", "id_endereco");

    }

}
