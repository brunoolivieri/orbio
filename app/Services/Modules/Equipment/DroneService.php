<?php

namespace App\Services\Modules\Equipment;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
// Models
use App\Models\Drones\Drone;
// Resources
use App\Http\Resources\Modules\Equipments\DronesPanelResource;
// Contracts
use App\Contracts\ServiceInterface;

class DroneService implements ServiceInterface
{

    function __construct(Drone $droneModel)
    {
        $this->droneModel = $droneModel;
    }

    /**
     * Load all drones with pagination.
     *
     * @param int $limit
     * @param int $current_page
     * @param int|string $typed_search
     * @return \Illuminate\Http\Response
     */
    public function loadResourceWithPagination(int $limit, string $order_by, int $page_number, int|string $search, int|array $filters): \Illuminate\Http\Response
    {

        $data = $this->droneModel->with('image')
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page_number);

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
    public function createResource(Request $request): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($request) {

            // Filename is the hash of the content
            $content_hash = md5(file_get_contents($request->file('image')));
            $filename = "$content_hash.jpg";
            $storage_folder = "public/images/drone/";

            $drone = $this->droneModel->create($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation"]));

            $drone->image()->create([
                "path" => $filename
            ]);

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
    public function updateResource(Request $request, int $drone_id): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($request, $drone_id) {

            $drone = $this->droneModel->findOrFail($drone_id);

            if (isset($request->image)) {

                // Filename is the hash of the content
                $content_hash = md5(file_get_contents($request->file('image')));
                $filename = "$content_hash.jpg";
                $storage_folder = "public/images/drone/";

                $drone = $drone->update($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "image"]));

                $drone->image()->update([
                    "path" => $filename
                ]);

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($storage_folder . $filename)) {
                    $request->file('image')->storeAs($storage_folder, $filename);
                }

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
    public function deleteResource(int $drone_id): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($drone_id) {

            $drone = $this->droneModel->findOrFail($drone_id);

            Storage::disk('public')->delete("images/drone/" . $drone->image);

            $drone->delete();

        });

        return response(["message" => "Drone deletado com sucesso!"], 200);
    }
}
