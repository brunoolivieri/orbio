<?php

namespace App\Repositories\Modules\Equipment;

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

            // Filename is the hash of the content
            $file_content = file_get_contents($data->get('image'));
            $content_hash = md5($file_content);
            $filename = "$content_hash.jpg";
            $path = "public/images/battery/" . $filename;

            $battery = $this->batteryModel->create($data->only(["name", "manufacturer", "model", "serial_number", "last_charge"]));

            $battery->image()->create([
                "path" => $path
            ]);

            // Image is stored just if does not already exists
            if (!Storage::disk('public')->exists($path)) {
                Storage::disk('public')->put($path, $file_content);
            }

            return $battery;
        });
    }

    function updateOne(Collection $data, string $identifier)
    {
        return DB::transaction(function () use ($data, $identifier) {

            $battery = $this->batteryModel->findOrFail($identifier);

            if (!is_null($data->get('image'))) {

                // Filename is the hash of the content
                $file_content = file_get_contents($data->get('image'));
                $content_hash = md5($file_content);
                $filename = "$content_hash.jpg";
                $path = "public/images/battery/" . $filename;

                $battery = $battery->update($data->only(["name", "manufacturer", "model", "serial_number", "last_charge"]));

                $battery->image()->update([
                    "path" => $path
                ]);

                // Image is stored just if does not already exists
                if (!Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->put($path, $file_content);
                }
            } else {

                $battery->update($data->only(["name", "manufacturer", "model", "serial_number", "last_charge"]));
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
