<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Custom
use App\Models\Incidents\Incident;

class LoadIncidentsController extends Controller
{

    function __construct(Incident $incidentModel)
    {
        $this->incidentModel = $incidentModel;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        return $this->incidentModel->all();
    }
}
