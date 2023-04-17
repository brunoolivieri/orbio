<?php

namespace App\Repositories\Modules\Equipments;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Repositories\Contracts\RepositoryInterface;
use App\Models\Drones\Drone;

class DroneRepository implements RepositoryInterface
{
    public function __construct(Drone $droneModel)
    {
        $this->droneModel = $droneModel;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->droneModel->with('image')
            ->withTrashed()
            ->search($search) // scope
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page));
    }

    function createOne(array $data)
    {
        return DB::transaction(function () use ($data) {

            $drone = $this->droneModel->create([
                "name" => $data["name"],
                "manufacturer" => $data["manufacturer"],
                "model" => $data["model"],
                "record_number" => $data["record_number"],
                "serial_number" => $data["serial_number"],
                "weight" => $data["weight"],
                "observation" => $data["observation"]
            ]);

            $drone->image()->create([
                "path" => $data->get('path')
            ]);

            // Image is stored just if does not already exists
            if (!Storage::disk('public')->exists($data->get('path'))) {
                Storage::disk('public')->put($data->get('path'), $data->get('file_content'));
            }

            return $drone;
        });
    }

    function updateOne(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {

            $drone = $this->droneModel->withTrashed()->findOrFail($id);
           
            $drone->update([
                "name" => $data["name"],
                "manufacturer" => $data["manufacturer"],
                "model" => $data["model"],
                "record_number" => $data["record_number"],
                "serial_number" => $data["serial_number"],
                "weight" => $data["weight"],
                "observation" => $data["observation"]
            ]);

            if ($data->get('change_file') === 1) {

                $drone->image()->update([
                    "path" => $data->get('path')
                ]);

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($data->get('path'))) {
                    Storage::disk('public')->put($data->get('path'), $data->get('file_content'));
                }
            }

            if ($drone->trashed() && (bool) $data->get("undelete")) {
                $drone->restore();
            }

            return $drone;
        });
    }

    function delete(array $ids)
    {
        return DB::transaction(function () use ($ids) {
            $undeleteable_ids = [];
            foreach ($ids as $drone_id) {

                $drone = $this->droneModel->findOrFail($drone_id);

                if ($drone->service_orders()->exists()) {
                    foreach ($drone->service_orders as $service_order) {
                        if ((bool) $service_order->status) {
                            array_push($undeleteable_ids, $drone->id);
                        }
                    }
                }
            }

            if (count($undeleteable_ids) === 0) {
                $drone->whereIn("id", $ids)->delete();
            }

            return $undeleteable_ids;
        });
    }
}
