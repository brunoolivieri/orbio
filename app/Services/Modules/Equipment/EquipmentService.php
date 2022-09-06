<?php

namespace App\Services\Modules\Equipment;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
// Custom
use App\Models\Equipments\Equipment;
use App\Http\Resources\Modules\Equipments\EquipmentsPanelResource;
// Contract
use App\Contracts\ServiceInterface;

class EquipmentService implements ServiceInterface
{

    function __construct(Equipment $equipmentModel)
    {
        $this->equipmentModel = $equipmentModel;
    }

    /**
     * Load all equipments with pagination.
     *
     * @param int $limit
     * @param int $current_page
     * @param int|string $typed_search
     * @return \Illuminate\Http\Response
     */
    public function loadResourceWithPagination(int $limit, string $order_by, int $page_number, int|string $search, int|array $filters): \Illuminate\Http\Response
    {

        $data = $this->equipmentModel->with('image')
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page_number);

        if ($data->total() > 0) {
            return response(new EquipmentsPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum equipamento encontrado."], 404);
        }
    }

    /**
     * Create equipment.
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function createResource(Request $request): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($request) {

            // Filename is the hash of the content
            $content_hash = md5(file_get_contents($request->file('image')));
            $filename = "$content_hash.jpg";
            $storage_folder = "public/images/equipment/";

            $equipment = $this->equipmentModel->create($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date", "image"]));

            $equipment->image()->create([
                "path" => $filename
            ]);

            // Image is stored just if does not already exists
            if (!Storage::disk('public')->exists($storage_folder . $filename)) {
                $request->file('image')->storeAs($storage_folder, $filename);
            }
        });

        return response(["message" => "Equipamento criado com sucesso!"], 200);
    }

    /**
     * Update equipment.
     *
     * @param $request
     * @param $equipment_id
     * @return \Illuminate\Http\Response
     */
    public function updateResource(Request $request, int $equipment_id): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($request, $equipment_id) {

            $equipment = $this->equipmentModel->findOrFail($equipment_id);

            if (!empty($request->image)) {

                // Filename is the hash of the content
                $content_hash = md5(file_get_contents($request->file('image')));
                $filename = "$content_hash.jpg";
                $storage_folder = "public/images/equipment/";

                $equipment = $equipment->update($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date"]));

                $equipment->image()->update([
                    "path" => $filename
                ]);

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($storage_folder . $filename)) {
                    $request->file('image')->storeAs($storage_folder, $filename);
                }
            } else {

                $equipment->update($request->only(["name", "manufacturer", "model", "record_number", "serial_number", "weight", "observation", "purchase_date"]));
            }
        });

        return response(["message" => "Equipamento atualizado com sucesso!"], 200);
    }

    /**
     * Soft delete equipment.
     *
     * @param $equipment_id
     * @return \Illuminate\Http\Response
     */
    public function deleteResource(int $equipment_id): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($equipment_id) {

            $equipment = $this->equipmentModel->find($equipment_id);

            Storage::disk('public')->delete("images/equipment/" . $equipment->image);

            $equipment->delete();
        });

        return response(["message" => "Equipamento deletado com sucesso!"], 200);
    }
}
