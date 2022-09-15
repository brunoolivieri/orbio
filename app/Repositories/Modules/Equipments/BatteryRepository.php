<?php

namespace App\Repositories\Modules\Equipments;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
// Model
use App\Models\Batteries\Battery;

class BatteryRepository implements RepositoryInterface
{
    public function __construct(Battery $batteryModel)
    {
        $this->batteryModel = $batteryModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->batteryModel->with('image')
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page_number));
    }

    function createOne(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            $battery = $this->batteryModel->create($data->only(["name", "manufacturer", "model", "serial_number", "last_charge"])->all());

            $battery->image()->create([
                "path" => $data->get('path')
            ]);

            // Image is stored just if does not already exists
            if (!Storage::disk('public')->exists($data->get('path'))) {
                Storage::disk('public')->put($data->get('path'), $data->get('file_content'));
            }

            return $battery;
        });
    }

    function updateOne(Collection $data, string $identifier)
    {
        return DB::transaction(function () use ($data, $identifier) {

            $battery = $this->batteryModel->findOrFail($identifier);

            $battery->update($data->only(["name", "manufacturer", "model", "serial_number", "last_charge"])->all());

            if ($data->get('change_file') === 1) {

                $battery->image()->update([
                    "path" => $data->get('path')
                ]);

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($data->get('path'))) {
                    Storage::disk('public')->put($data->get('path'), $data->get('file_content'));
                }
            }

            return $battery;
        });
    }

    function deleteOne(string $identifier)
    {
        return DB::transaction(function () use ($identifier) {

            $battery = $this->batteryModel->findOrFail($identifier);

            $battery->delete();

            return $battery;
        });
    }
}
