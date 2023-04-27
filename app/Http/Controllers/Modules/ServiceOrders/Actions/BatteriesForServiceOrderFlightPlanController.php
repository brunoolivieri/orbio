<?php

namespace App\Http\Controllers\Modules\ServiceOrders\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Batteries\Battery;
use App\Http\Resources\Modules\Equipments\BatteriesPanelResource;

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

            return response(new BatteriesPanelResource($batteries), 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
