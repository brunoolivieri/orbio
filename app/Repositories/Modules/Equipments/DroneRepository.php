<?php

namespace App\Repositories\Modules\Equipment;

use App\Contracts\RepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
// Model
use App\Models\Drones\Drone;

class DroneRepository implements RepositoryInterface
{
    public function __construct(Drone $droneModel)
    {
        $this->droneModel = $droneModel;
    }

    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters)
    {
        return $this->droneModel->with('image')
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
            $path = "public/images/drone/" . $filename;

            $drone = $this->droneModel->create($data->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"]));

            $drone->image()->create([
                "path" => $path
            ]);

            // Image is stored just if does not already exists
            if (!Storage::disk('public')->exists($path)) {
                Storage::disk('public')->put($path, $file_content);
            }

            return $drone;
        });
    }

    function updateOne(Collection $data, string $identifier)
    {
        return DB::transaction(function () use ($data, $identifier) {

            $drone = $this->droneModel->findOrFail($identifier);

            if (!is_null($data->get('image'))) {

                // Filename is the hash of the content
                $file_content = file_get_contents($data->get('image'));
                $content_hash = md5($file_content);
                $filename = "$content_hash.jpg";
                $path = "public/images/drone/" . $filename;

                $drone = $drone->update($data->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"]));

                $drone->image()->update([
                    "path" => $path
                ]);

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->put($path, $file_content);
                }
            } else {

                $drone->update($data->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"]));
            }

            return $drone;
        });
    }

    function deleteOne(string $identifier)
    {
        return DB::transaction(function () use ($identifier) {

            $drone = $this->droneModel->findOrFail($identifier);

            $drone->delete();

            return $drone;
        });
    }
}
