<?php

namespace App\Http\Resources\Modules\Administration;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
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
            foreach ($profile->modules as $row => $profile_module) {

                $profile_modules[$row] = [
                    "module_id" => $profile_module->module->id,
                    "module_name" => $profile_module->module->name,
                    "read" => $profile_module->read,
                    "write" => $profile_module->write
                ];
            }

            // Actual profile and its relationships with modules are stored in actual array key ($profile->id) of $this->formatedData 
            $this->formatedData["records"][$profile->id] = ["profile_id" => $profile->id, "profile_name" =>  $profile->name, "profile_modules_relationship" => $profile_modules];
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
