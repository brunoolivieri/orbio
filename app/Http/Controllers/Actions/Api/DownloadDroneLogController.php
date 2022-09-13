<?php

namespace App\Http\Controllers\Actions\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DownloadDroneLogController extends Controller
{

    public function __invoke() : \Illuminate\Http\Response
    {
        // http://IP:porta/logdownload/tipoDoLog/nome
    }
}
