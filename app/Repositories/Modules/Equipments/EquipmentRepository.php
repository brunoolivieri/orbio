<?php

namespace App\Repositories\Modules\Equipment;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
// Model
use App\Models\Equipments\Equipment;

class EquipmentRepository implements RepositoryInterface
{
    public function __construct(Equipment $equipmentModel)
    {
        $this->equipmentModel = $equipmentModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->equipmentModel->with('image')
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page_number));
    }

    function createOne(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            $equipment = $this->equipmentModel->create($data->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date"]));

            $equipment->image()->create([
                "path" => $data->get('path')
            ]);

            // Image is stored just if does not already exists
            if (!Storage::disk('public')->exists($data->get('path'))) {
                Storage::disk('public')->put($data->get('path'), $data->get('file_content'));
            }

            return $equipment;
        });
    }

    function updateOne(Collection $data, string $identifier)
    {
        return DB::transaction(function () use ($data, $identifier) {

            $equipment = $this->equipmentModel->findOrFail($identifier);

            $equipment->update($data->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date"]));

            if ($data->get('change_file') === 1) {

                $equipment->image()->update([
                    "path" => $data->get('path')
                ]);

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($data->get('path'))) {
                    Storage::disk('public')->put($data->get('path'), $data->get('file_content'));
                }
            }

            return $equipment;
        });
    }

    function deleteOne(string $identifier)
    {
        return DB::transaction(function () use ($identifier) {

            $equipment = $this->equipmentModel->find($identifier);

            $equipment->delete();

            return $equipment;
        });
    }
}
