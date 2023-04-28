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
                "last_access" => $user->last_access,
                "created_at" => $user->created_at,
                "updated_at" => $user->updated_at,
                "deleted_at" => $user->deleted_at
            ];

            if ((bool) $user->status && is_null($user->deleted_at)) {
                $this->formatedData["records"][$user_index]["status_badge"] = ["label" => "Ativo", "color" => "success"];
            } else if ((bool) !$user->status && is_null($user->deleted_at)) {
                $this->formatedData["records"][$user_index]["status_badge"] = ["label" => "Inativo", "color" => "error"];
            } else if (!is_null($user->deleted_at)) {
                $this->formatedData["records"][$user_index]["status_badge"] = ["label" => "Deletado", "color" => "error"];
            }

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
            }
        }

        $this->formatedData["total_records"] = $this->data->total();
        $this->formatedData["records_per_page"] = $this->data->perPage();
        $this->formatedData["total_pages"] = $this->data->lastPage();

        return $this->formatedData;
    }
}
