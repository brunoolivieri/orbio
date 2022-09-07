<?php

namespace App\Models\Pivot;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileModule extends Model
{
    use HasFactory;

    protected $table = "profile_has_module";
    public $incrementing = false;
    public $timestamps = false;
    protected $guarded = [];

    function profile()
    {
        return $this->belongsTo("App\Models\Profiles\Profile", "profile_id");
    }

    function module()
    {
        return $this->belongsTo("App\Models\Modules\Module", "module_id");
    }
}