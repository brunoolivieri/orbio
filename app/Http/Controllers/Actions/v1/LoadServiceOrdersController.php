<?php

namespace App\Http\Controllers\Actions\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ServiceOrders\ServiceOrder;

class LoadServiceOrdersController extends Controller
{

    function __construct(ServiceOrder $serviceOrderModel)
    {
        $this->model = $serviceOrderModel;
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
