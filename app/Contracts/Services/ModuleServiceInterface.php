<?php

namespace App\Contracts\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

interface ModuleServiceInterface {

    function __construct(Model $model);

    function loadResourceWithPagination(int $limit, int $current_page, int|string $where_value) : \Illuminate\Http\Response ;
    function createResource(Request $request) : \Illuminate\Http\Response ;
    function updateResource(Request $request, int $id) : \Illuminate\Http\Response ;
    function deleteResource(int $id) : \Illuminate\Http\Response ;

}