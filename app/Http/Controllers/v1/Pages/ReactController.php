<?php

namespace App\Http\Controllers\v1\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReactController extends Controller
{
    public function __invoke(Request $request)
    {
        return view("main");
    }
}
