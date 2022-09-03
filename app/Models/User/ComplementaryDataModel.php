<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComplementaryDataModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "complementary_data";
    protected $guarded = [];
    public $timestamps = false;

    /*
    * Relationship with users table
    */
    function user()
    {
        return $this->belongsTo("App\Models\User\UserModel", "user_id");
    }

    /*
    * Relationship with address table
    */
    function address()
    {
        return $this->belongsTo("App\Models\User\UserAddressModel", "address_id");
    }
}
