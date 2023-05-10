<?php

namespace App\Http\Controllers\Modules\v1\ServiceOrders\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Drones\Drone;
use App\Http\Resources\v1\Modules\Equipments\DronesPaginationResource;

class DronesForServiceOrderFlightPlanController extends Controller
{
    public function __construct(Drone $droneModel)
    {
        $this->model = $droneModel;
    }

    public function __invoke(Request $request)
    {
        try {

            $limit = request()->limit;
            $page = request()->page;
            $search = request()->search;

            $drones = $this->model
                ->search($search) // scope
                ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page));

            if ($drones->total() == 0) {
                throw new \Exception("Nenhum drone encontrado.", 404);
            }

            return response(new DronesPaginationResource($drones), 200);
        } catch (\Exception $e) {
            return response(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
