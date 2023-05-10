<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Batteries\Battery;
use App\Http\Resources\v1\Modules\Equipments\BatteriesPaginationResource;

class BatteriesForServiceOrderFlightPlanController extends Controller
{
    public function __construct(Battery $batteryModel)
    {
        $this->model = $batteryModel;
    }

    public function __invoke(Request $request)
    {
        try {

            $limit = request()->limit;
            $page = request()->page;
            $search = request()->search;

            $batteries = $this->model
                ->search($search) // scope
                ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page));

            if ($batteries->total() == 0) {
                throw new \Exception("Nenhuma bateria encontrada.", 404);
            }

            return response(new BatteriesPaginationResource($batteries), 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
