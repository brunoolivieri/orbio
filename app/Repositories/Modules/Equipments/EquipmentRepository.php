<?php

namespace App\Repositories\Modules\Equipments;

use App\Repositories\Contracts\RepositoryInterface;
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

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->equipmentModel->with('image')
            ->search($search) // scope
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page));
    }

    function createOne(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            $equipment = $this->equipmentModel->create($data->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date"])->all());

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

            $equipment->update($data->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date"])->all());

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

    function delete(array $ids)
    {
        foreach ($ids as $equipment_id) {
            $equipment = $this->equipmentModel->find($equipment_id);

            $equipment->delete();
        }

        return $equipment;
    }
}
