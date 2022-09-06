<?php

namespace App\Models\Addresses;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "addresses";
    protected $guarded = [];
    public $timestamps = false;

    /*
    * Relationship with user_complementary_data table
    */
    function personal_document()
    {
        $this->hasOne("App\Models\PersonalDocuments\PersonalDocument", "address_id");
    }
}
