<?php

namespace App\Models\PersonalDocuments;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PersonalDocument extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "personal_document";
    protected $guarded = [];
    public $timestamps = false;

    /*
    * Relationship with users table
    */
    function user()
    {
        return $this->belongsTo("App\Models\Users\User", "user_id");
    }

    /*
    * Relationship with address table
    */
    function address()
    {
        return $this->belongsTo("App\Models\Addresses\Address", "address_id");
    }
}
