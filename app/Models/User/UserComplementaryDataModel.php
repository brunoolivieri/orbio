<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserComplementaryDataModel extends Model
{
    use HasFactory;

    protected $table = "user_complementary_data";
    public $timestamps = false;

}
