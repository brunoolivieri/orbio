<?php

namespace App\Repositories\Modules\Equipments;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Batteries\Battery;

class BatteryRepository implements RepositoryInterface
{
    public function __construct(Battery $batteryModel)
    {
        $this->batteryModel = $batteryModel;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->batteryModel
            ->withTrashed()
            ->search($search) // scope
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page));
    }

    function createOne(array $data)
    {
        return DB::transaction(function () use ($data) {

            $battery = $this->batteryModel->create([
                "name" => $data["name"],
                "manufacturer" => $data["manufacturer"],
                "model" => $data["model"],
                "serial_number" => $data["serial_number"],
                "observation" => $data["observation"],
                "last_charge" => $data["last_charge"],
                "image_path" => $data["image_path"]
            ]);

            if (!Storage::disk('public')->exists($data['image_path'])) {
                Storage::disk('public')->put($data['image_path'], $data['image_content']);
            }

            return $battery;
        });
    }

    function updateOne(array $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {

            $battery = $this->batteryModel->withTrashed()->findOrFail($id);

            $battery->update([
                "name" => $data["name"],
                "manufacturer" => $data["manufacturer"],
                "model" => $data["model"],
                "serial_number" => $data["serial_number"],
                "observation" => $data["observation"],
                "last_charge" => $data["last_charge"]
            ]);

            if ($data['change_image'] === 1) {
                $battery->update([
                    "image_path" => $data['image_path']
                ]);
                if (!Storage::disk('public')->exists($data['image_path'])) {
                    Storage::disk('public')->put($data['image_path'], $data['image_content']);
                }
            }

            if ($battery->trashed() && (bool) $data["undelete"]) {
                $battery->restore();
            }

            return $battery;
        });
    }

    function delete(array $ids)
    {
        return DB::transaction(function () use ($ids) {
            $undeleteable_ids = [];
            foreach ($ids as $battery_id) {

                $battery = $this->batteryModel->findOrFail($battery_id);

                if ($battery->service_orders()->exists()) {
                    foreach ($battery->service_orders as $service_order) {
                        if ((bool) $service_order->status) {
                            array_push($undeleteable_ids, $battery->id);
                        }
                    }
                }
            }

            if (count($undeleteable_ids) === 0) {
                $battery->whereIn("id", $ids)->delete();
            }

            return $undeleteable_ids;
        });
    }
}
