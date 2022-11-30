<?php

namespace App\Repositories\Modules\Equipments;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
// Interface
use App\Repositories\Contracts\RepositoryInterface;
// Model
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
            ->search($search) // scope
            ->paginate(intval($limit), $columns = ['*'], $pageName = 'page', intval($page));
    }

    function createOne(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            $drone = $this->droneModel->create($data->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"])->all());

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

    function updateOne(Collection $data, string $identifier)
    {
        return DB::transaction(function () use ($data, $identifier) {

            $drone = $this->droneModel->findOrFail($identifier);

            $drone = $drone->update($data->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"])->all());

            if ($data->get('change_file') === 1) {

                $drone->image()->update([
                    "path" => $data->get('path')
                ]);

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($data->get('path'))) {
                    Storage::disk('public')->put($data->get('path'), $data->get('file_content'));
                }
            }

            return $drone;
        });
    }

    function delete(array $ids)
    {
        foreach ($ids as $drone_id) {

            $drone = $this->droneModel->findOrFail($drone_id);

            $drone->delete();
        }

        return $drone;
    }
}
