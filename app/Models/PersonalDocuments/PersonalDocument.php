<?php

namespace App\Models\PersonalDocuments;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
// Models
use App\Models\Users\User;
use App\Models\Addresses\Address;

class PersonalDocument extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    public $timestamps = false;

    function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    function address()
    {
        return $this->belongsTo(Address::class, "address_id");
    }
}
