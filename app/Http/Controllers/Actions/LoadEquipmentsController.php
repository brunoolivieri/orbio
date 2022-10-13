<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Equipments\Equipment;

class LoadEquipmentsController extends Controller
{

    function __construct(Equipment $equipmentModel)
    {
        $this->model = $equipmentModel;
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
