<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Custom
use App\Models\Reports\Report;

class LoadReportsController extends Controller
{

    function __construct(Report $reportModel)
    {
        $this->model = $reportModel;
    }

    public function __invoke(): \Illuminate\Http\Response
    {
        $data = $this->model->all();

        return response($data, 200);
    }
}
