<?php

namespace App\Http\Resources\Modules\Administration;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

class UsersPanelResource extends JsonResource
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
        $formated_data["records"] = array();

        foreach ($this->data as $user_index => $user) {

            $this->formatedData["records"][$user_index] = [
                "id" => $user->id,
                "name" => $user->name,
                "profile" => [
                    "id" => $user->profile->id,
                    "name" => $user->profile->name
                ],
                "email" => $user->email,
                "status" => $user->status,
                "documents" => null,
                "address" => null,
                "service_order" => null,
                "last_access" => date('d-m-Y h:i', strtotime($user->last_access)),
                "created_at" => date('d-m-Y h:i', strtotime($user->created_at)),
                "updated_at" => date('d-m-Y h:i', strtotime($user->updated_at))
            ];

            if ($user->status && $user->personal_document) {

                $this->formatedData["records"][$user_index]["documents"] = [
                    'anac_license' => $user->personal_document->anac_license,
                    'cpf' => $user->personal_document->cpf,
                    'cnpj' => $user->personal_document->cnpj,
                    'telephone' => $user->personal_document->telephone,
                    'cellphone' => $user->personal_document->cellphone,
                    'company_name' => $user->personal_document->company_name,
                    'trading_name' => $user->personal_document->trading_name
                ];

                $this->formatedData["records"][$user_index]["address"] = [
                    'name' => $user->personal_document->address->address,
                    'number' => $user->personal_document->address->number,
                    'cep' => $user->personal_document->address->cep,
                    'city' => isset($user->personal_document->address->city) ? $user->personal_document->address->city : "N/A",
                    'state' => isset($user->personal_document->address->state) ? $user->personal_document->address->state : "N/A",
                    'complement' => $user->personal_document->address->complement
                ];

                if ($user->service_orders) {

                    foreach ($user->service_orders as $so_index => $service_order) {
                        $this->formatedData["records"][$user_index]["service_order"][$so_index] = [
                            "id" => $service_order->id,
                            "number" => $service_order->number,
                            "created_at" => $service_order->created_at,
                            "role" => $service_order->pivot->role,
                            "status" => $service_order->status,
                            "finished" => !is_null($service_order->report)
                        ];
                    }
                }
            }

            if ((bool) $user->status && empty($user->deleted_at)) {
                $this->formatedData["records"][$user_index]["status_badge"] = ["Ativo", "success"];
            } else if ((bool) !$user->status && empty($user->deleted_at)) {
                $this->formatedData["records"][$user_index]["status_badge"] = ["Inativo", "error"];
            } else if (!empty($user->deleted_at)) {
                $this->formatedData["records"][$user_index]["status_badge"] = ["Removido", "error"];
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
