<?php

namespace App\Services\Modules\Equipment;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
// Custom
use App\Models\Batteries\BatteryModel;
use App\Http\Resources\Modules\Equipments\BatteriesPanelResource;
// Contract
use App\Contracts\ServiceInterface;

class BatteryService implements ServiceInterface
{

    function __construct(BatteryModel $batteryModel)
    {
        $this->batteryModel = $batteryModel;
    }

    /**
     * Load all batteries with pagination.
     *
     * @param int $limit
     * @param int $current_page
     * @param int|string $typed_search
     * @return \Illuminate\Http\Response
     */
    public function loadResourceWithPagination(int $limit, string $order_by, int $page_number, int|string $search, int|array $filters) : \Illuminate\Http\Response
    {

        $data = $this->batteryModel->with('image')
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page_number);

        if ($data->total() > 0) {
            return response(new BatteriesPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhuma bateria encontrada."], 404);
        }
    }

    /**
     * Create battery.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function createResource(Request $request) : \Illuminate\Http\Response
    {

        DB::transaction(function () use ($request) {

            // Filename is the hash of the content
            $content_hash = md5(file_get_contents($request->file('image')));
            $filename = "$content_hash.jpg";
            $storage_folder = "public/images/battery/";

            $battery = $this->batteryModel->create($request->only(["name", "manufacturer", "model", "serial_number", "last_charge", "image"]));

            $battery->image()->create([
                "path" => $filename
            ]);

            // Image is stored just if does not already exists
            if (!Storage::disk('public')->exists($storage_folder . $filename)) {
                $request->file('image')->storeAs($storage_folder, $filename);
            }
        });

        return response(["message" => "Bateria criada com sucesso!"], 200);
    }

    /**
     * Update battery.
     *
     * @param  \Illuminate\Http\Request $request
     * @param $battery_id
     * @return \Illuminate\Http\Response
     */
    public function updateResource(Request $request, int $battery_id) : \Illuminate\Http\Response
    {

        DB::transaction(function () use ($request, $battery_id) {

            $battery = $this->batteryModel->findOrFail($battery_id);

            if (!is_null($request->image)) {

                // Filename is the hash of the content
                $content_hash = md5(file_get_contents($request->file('image')));
                $filename = "$content_hash.jpg";
                $storage_folder = "public/images/battery/";

                $battery = $battery->update($request->only(["name", "manufacturer", "model", "serial_number", "last_charge", "image"]));

                $battery->image()->update([
                    "path" => $filename
                ]);

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($storage_folder . $filename)) {
                    $request->file('image')->storeAs($storage_folder, $filename);
                }
            } else {

                $battery->update($request->only(["name", "manufacturer", "model", "serial_number", "last_charge"]));
            }
        });

        return response(["message" => "Bateria atualizada com sucesso!"], 200);
    }

    /**
     * Soft delete battery.
     *
     * @param $battery_id
     * @return \Illuminate\Http\Response
     */
    public function deleteResource(int $battery_id) : \Illuminate\Http\Response
    {

        DB::transaction(function () use ($battery_id) {

            $battery = $this->batteryModel->findOrFail($battery_id);

            Storage::disk('public')->delete("images/batteries/" . $battery->image);

            $battery->delete();
            
        });

        return response(["message" => "Bateria deletada com sucesso!"], 200);
    }
}
