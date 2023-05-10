<?php

namespace App\Http\Controllers\v1\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Logs\Log;

class LoadLogsController extends Controller
{

    function __construct(Log $model)
    {
        $this->model = $model;
    }

    public function __invoke(Request $request)
    {
        try {
            $data = $this->model->all();
            return response()->json($data)->setStatusCode(200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()])->setStatusCode($e->getCode());
        }
    }
}
