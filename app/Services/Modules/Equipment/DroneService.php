<?php

namespace App\Services\Modules\Equipment;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
// Custom
use App\Models\Drones\DroneModel;
use App\Http\Resources\Modules\Equipments\DronesPanelResource;
use App\Http\Requests\Modules\Equipments\Drone\StoreDroneRequest;
use App\Http\Requests\Modules\Equipments\Drone\UpdateDroneRequest;

class DroneService
{

    /**
     * Load all drones with pagination.
     *
     * @param int $limit
     * @param int $current_page
     * @param int|string $typed_search
     * @return \Illuminate\Http\Response
     */
    public function loadResourceWithPagination(int $limit, int $current_page, int|string $typed_search)
    {

        $data = DroneModel::where("drones.deleted_at", null)
            ->when($typed_search, function ($query, $typed_search) {

                $query->when(is_numeric($typed_search), function ($query) use ($typed_search) {

                    $query->where('id', $typed_search)
                        ->orWhere('weight', $typed_search);
                }, function ($query) use ($typed_search) {

                    $query->where('name', 'LIKE', '%' . $typed_search . '%')
                        ->orWhere('manufacturer', 'LIKE', '%' . $typed_search . '%')
                        ->orWhere('model', 'LIKE', '%' . $typed_search . '%')
                        ->orWhere('record_number', 'LIKE', '%' . $typed_search . '%')
                        ->orWhere('serial_number', 'LIKE', '%' . $typed_search . '%');
                });
            })
            ->orderBy('id')
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

        if ($data->total() > 0) {
            return response(new DronesPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum drone encontrado."], 404);
        }
    }

    /**
     * Create drone.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function createResource(Request $request)
    {

        DB::transaction(function () use ($request) {

            // Filename is the hash of the content
            $content_hash = md5(file_get_contents($request->file('image')));
            $filename = "$content_hash.jpg";
            $storage_folder = "public/images/drone/";

            $request->request->add(["image" => $filename]);

            DroneModel::create($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "image"]));

            // Image is stored just if does not already exists
            if (!Storage::disk('public')->exists($storage_folder . $filename)) {
                $path = $request->file('image')->storeAs($storage_folder, $filename);
            }
        });

        return response(["message" => "Drone criado com sucesso!"], 200);
    }

    /**
     * Update drone.
     *
     * @param  \Illuminate\Http\Request $request
     * @param $drone_id
     * @return \Illuminate\Http\Response
     */
    public function updateResource(Request $request, $drone_id)
    {

        DB::transaction(function () use ($request, $drone_id) {

            $drone = DroneModel::findOrFail($drone_id);

            if (isset($request->image)) {

                // Filename is the hash of the content
                $content_hash = md5(file_get_contents($request->file('image')));
                $filename = "$content_hash.jpg";
                $storage_folder = "public/images/drone/";

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($storage_folder . $filename)) {
                    $request->file('image')->storeAs($storage_folder, $filename);
                }

                $request->request->add(["image" => $filename]);

                $drone->update($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "image"]));
            } else {

                $drone->update($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"]));
            }
        });

        return response(["message" => "Drone atualizado com sucesso!"], 200);
    }

    /**
     * Soft delete drone.
     *
     * @param int $drone_id
     * @return \Illuminate\Http\Response
     */
    public function deleteResource($drone_id)
    {

        DB::transaction(function () use ($drone_id) {

            $drone = DroneModel::findOrFail($drone_id);

            Storage::disk('public')->delete("images/drone/" . $drone->image);

            $drone->delete();
        });

        return response(["message" => "Drone deletado com sucesso!"], 200);
    }
}
