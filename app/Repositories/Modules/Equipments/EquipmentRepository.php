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

            // Filename is the hash of the content
            $file_content = file_get_contents($data->get('image'));
            $content_hash = md5($file_content);
            $filename = "$content_hash.jpg";
            $path = "public/images/equipment/" . $filename;

            $equipment = $this->equipmentModel->create($data->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date"]));

            $equipment->image()->create([
                "path" => $path
            ]);

            // Image is stored just if does not already exists
            if (!Storage::disk('public')->exists($path)) {
                Storage::disk('public')->put($path, $file_content);
            }

            return $equipment;
        });
    }

    function updateOne(Collection $data, string $identifier)
    {
        return DB::transaction(function () use ($data, $identifier) {

            $equipment = $this->equipmentModel->findOrFail($identifier);

            if (!is_null($data->get('image'))) {

                // Filename is the hash of the content
                $file_content = file_get_contents($data->get('image'));
                $content_hash = md5($file_content);
                $filename = "$content_hash.jpg";
                $path = "public/images/equipment/" . $filename;

                $equipment = $equipment->update($data->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date"]));

                $equipment->image()->update([
                    "path" => $filename
                ]);

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->put($path, $file_content);
                }
            } else {

                $equipment->update($data->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date"]));
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
