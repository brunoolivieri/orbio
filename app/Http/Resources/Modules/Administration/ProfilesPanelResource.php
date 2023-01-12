<?php

namespace App\Http\Resources\Modules\Administration;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;
use App\Models\Modules\Module;

class ProfilesPanelResource extends JsonResource
{

    private LengthAwarePaginator $data;
    private array $formatedData = [];

    function __construct(LengthAwarePaginator $data)
    {
        $this->data = $data;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
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
                    "access_data" => json_decode($profile->access_data)
                ];
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
