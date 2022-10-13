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

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $data = $this->model->all();
        return response($data, 200);
    }
}
