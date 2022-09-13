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
        $this->model = $incidentModel;
    }

    public function __invoke(): \Illuminate\Http\Response
    {
        $data = $this->model->all();

        return response($data, 200);
    }
}
