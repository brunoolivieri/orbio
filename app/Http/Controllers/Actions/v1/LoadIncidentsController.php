<?php

namespace App\Http\Controllers\Actions\v1;

use App\Http\Controllers\Controller;
use App\Models\Incidents\Incident;

class LoadIncidentsController extends Controller
{

    function __construct(Incident $incidentModel)
    {
        $this->model = $incidentModel;
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
