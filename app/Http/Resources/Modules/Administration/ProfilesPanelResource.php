<?php

namespace App\Http\Resources\Modules\Administration;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

class ProfilesPanelResource extends JsonResource
{

    private LengthAwarePaginator $data;
    private array $formatedData = [];

    function __construct(LengthAwarePaginator $data)
    {
        $this->data = $data;
    }

    public function toArray($request)
    {
        // Get each profile
        foreach ($this->data as $row => $profile) {
            // Get actual profile relationship with each module
            foreach ($profile->modules as $row => $module) {
                $modules_related[$row] = [
                    "module_id" => $module->id,
                    "module_name" => $module->name,
                    "read" => $module->pivot->read,
                    "write" => $module->pivot->write
                ];
            }

            // Actual profile and its relationships with modules are stored in actual array key ($profile->id) of $this->formatedData 
            $this->formatedData["records"][$profile->id] =
                [
                    "id" => $profile->id,
                    "name" =>  $profile->name,
                    "created_at" => $profile->created_at,
                    "updated_at" => $profile->updated_at,
                    "total_users" => $profile->users->count(),
                    "modules" => $modules_related,
                    "access_data" => json_decode($profile->access_data),
                    "deleted_at" => $profile->deleted_at
                ];

            if (is_null($profile->deleted_at)) {
                $this->formatedData["records"][$profile->id]["status_badge"] = [
                    "label" => "Ativo",
                    "color" => "success"
                ];
            } else {
                $this->formatedData["records"][$profile->id]["status_badge"] = [
                    "label" => "Deletado",
                    "color" => "error"
                ];
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
