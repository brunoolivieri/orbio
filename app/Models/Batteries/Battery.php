<?php

namespace App\Models\Batteries;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
// Custom
use App\Models\Images\Image;

class Battery extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    public $table = "batteries";

    /*
    * Scope for search
    */
    function scopeSearch($query, $value_searched)
    {
        return $query->when($value_searched, function ($query, $value_searched) {

            $query->when(is_numeric($value_searched), function ($query) use ($value_searched) {

                $query->where('id', $value_searched);
            }, function ($query) use ($value_searched) {

                $query->where('name', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('manufacturer', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('model', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('serial_number', 'LIKE', '%' . $value_searched . '%');
            });
        });
    }

    /*
    * Scope for filter
    */
    function scopeFilter($query, $filters)
    {
        return $query->when((bool) $filters, function ($query) use ($filters) {

            foreach ($filters as $index => $filter) {
                $query->where($filter["column"], $filter["value"]);
            }
        });
    }

    /*
    * Polymorphic relationship with table "images"
    */
    function image()
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}
