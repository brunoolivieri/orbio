<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Drones\Drone;

class LoadDronesController extends Controller
{

    function __construct(Drone $droneModel)
    {
        $this->model = $droneModel;
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
