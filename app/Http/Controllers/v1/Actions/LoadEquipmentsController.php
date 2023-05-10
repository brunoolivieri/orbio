<?php

namespace App\Http\Controllers\v1\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Equipments\Equipment;

class LoadEquipmentsController extends Controller
{

    function __construct(Equipment $equipmentModel)
    {
        $this->model = $equipmentModel;
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
