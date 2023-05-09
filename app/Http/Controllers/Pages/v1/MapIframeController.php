<?php

namespace App\Http\Controllers\Pages\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MapIframeController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        return view("map_for_iframe");
    }
}
