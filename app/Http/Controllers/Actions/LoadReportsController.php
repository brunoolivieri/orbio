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
        $this->reportModel = $reportModel;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        return $this->reportModel->all();
    }
}
