<?php

namespace App\Models\Modules;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
// Models
use App\Models\Profiles\Profile;

class Module extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['*'];
}
