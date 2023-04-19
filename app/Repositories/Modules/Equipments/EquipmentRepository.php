<?php

namespace App\Repositories\Modules\Equipments;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Equipments\Equipment;

class EquipmentRepository implements RepositoryInterface
{
    public function __construct(Equipment $equipmentModel)
    {
        $this->equipmentModel = $equipmentModel;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->equipmentModel
            ->withTrashed()
            ->search($search) // scope
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page));
    }

    function createOne(array $data)
    {
        return DB::transaction(function () use ($data) {

            $equipment = $this->equipmentModel->create([
                "name" => $data["name"],
                "manufacturer" => $data["manufacturer"],
                "model" => $data["model"],
                "record_number" => $data["record_number"],
                "serial_number" => $data["serial_number"],
                "weight" => $data["weight"],
                "observation" => $data["observation"],
                "purchase_date" => $data["purchase_date"],
                "image_path" => $data["image_path"]
            ]);

            if (!Storage::disk('public')->exists($data['image_path'])) {
                Storage::disk('public')->put($data['image_path'], $data['image_content']);
            }

            if ($equipment->trashed() && $data["undelete"]) {
                $equipment->restore();
            }

            return $equipment;
        });
    }

    function updateOne(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {

            $equipment = $this->equipmentModel->withTrashed()->findOrFail($id);

            $equipment->update([
                "name" => $data["name"],
                "manufacturer" => $data["manufacturer"],
                "model" => $data["model"],
                "record_number" => $data["record_number"],
                "serial_number" => $data["serial_number"],
                "weight" => $data["weight"],
                "observation" => $data["observation"],
                "purchase_date" => $data["purchase_date"]
            ]);

            if ($data['change_image'] === 1) {
                $equipment->update([
                    "image_path" => $data['image_path']
                ]);
                if (!Storage::disk('public')->exists($data['image_path'])) {
                    Storage::disk('public')->put($data['image_path'], $data['image_content']);
                }
            }

            if ($equipment->trashed() && (bool) $data["undelete"]) {
                $equipment->restore();
            }

            return $equipment;
        });
    }

    function delete(array $ids)
    {
        return DB::transaction(function () use ($ids) {
            $undeleteable_ids = [];
            foreach ($ids as $battery_id) {

                $equipment = $this->equipmentModel->findOrFail($battery_id);

                if ($equipment->service_orders()->exists()) {
                    foreach ($equipment->service_orders as $service_order) {
                        if ((bool) $service_order->status) {
                            array_push($undeleteable_ids, $equipment->id);
                        }
                    }
                }
            }

            if (count($undeleteable_ids) === 0) {
                $equipment->whereIn("id", $ids)->delete();
            }

            return $undeleteable_ids;
        });
    }
}
