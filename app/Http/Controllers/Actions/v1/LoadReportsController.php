<?php

namespace App\Http\Controllers\Actions\v1;

use App\Http\Controllers\Controller;
use App\Models\Reports\Report;

class LoadReportsController extends Controller
{

    function __construct(Report $reportModel)
    {
        $this->model = $reportModel;
    }

    public function __invoke()
    {
        try {
            $data = $this->model->all();
            return response()->json($data)->setStatusCode(200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()])->setStatusCode($e->getCode());
        }
    }
}
