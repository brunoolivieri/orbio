<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ServiceOrders\ServiceOrder;

class LoadServiceOrdersController extends Controller
{

    function __construct(ServiceOrder $serviceOrderModel)
    {
        $this->model = $serviceOrderModel;
    }
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $service_orders = $this->model->all();

        return response($service_orders, 200);
    }
}
