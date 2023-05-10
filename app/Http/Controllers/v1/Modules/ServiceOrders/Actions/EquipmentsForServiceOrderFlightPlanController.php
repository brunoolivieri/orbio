<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Equipments\Equipment;
use App\Http\Resources\v1\Modules\Equipments\EquipmentsPaginationResource;

class EquipmentsForServiceOrderFlightPlanController extends Controller
{
    public function __construct(Equipment $equipmentModel)
    {
        $this->model = $equipmentModel;
    }

    public function __invoke(Request $request)
    {
        try {

            $limit = request()->limit;
            $page = request()->page;
            $search = request()->search;

            $equipments = $this->model
                ->search($search) // scope
                ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page));

            if ($equipments->total() == 0) {
                throw new \Exception("Nenhum equipamento encontrada.", 404);
            }

            return response(new EquipmentsPaginationResource($equipments), 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
