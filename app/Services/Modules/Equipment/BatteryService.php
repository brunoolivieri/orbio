<?php

namespace App\Services\Modules\Equipment;

// Contracts
use App\Services\Contracts\ServiceInterface;
// Repository
use App\Repositories\Modules\Equipments\BatteryRepository;
// Resources
use App\Http\Resources\Modules\Equipments\BatteriesPanelResource;

class BatteryService implements ServiceInterface
{
    function __construct(BatteryRepository $batteryRepository)
    {
        $this->repository = $batteryRepository;
    }

    public function getPaginate(string $limit, string $page, string $search)
    {
        $data = $this->repository->getPaginate($limit, $page, $search);

        if ($data->total() > 0) {
            return response(new BatteriesPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhuma bateria encontrada."], 404);
        }
    }

    public function createOne(array $data)
    {
        // Filename is the hash of the content
        $file_content = file_get_contents($data['image']);
        $content_hash = md5($file_content);
        $filename = "$content_hash.jpg";
        $path = "images/equipments/" . $filename;

        $data["file_content"] = $file_content;
        $data["path"] = $path;

        $battery = $this->repository->createOne(collect($data));

        return response(["message" => "Bateria criada com sucesso!"], 201);
    }

    public function updateOne(array $data, string $identifier)
    {
        if (isset($data['image'])) {

            // Filename is the hash of the content
            $file_content = file_get_contents($data['image']);
            $content_hash = md5($file_content);
            $filename = "$content_hash.jpg";
            $path = "images/equipments/" . $filename;

            $data["change_file"] = 1;
            $data["file_content"] = $file_content;
            $data["path"] = $path;
        } else {
            $data["change_file"] = 0;
        }

        $battery = $this->repository->updateOne(collect($data), $identifier);

        return response(["message" => "Bateria atualizada com sucesso!"], 200);
    }

    /**
     * Soft delete battery.
     *
     * @param $battery_id
     * @return \Illuminate\Http\Response
     */
    public function delete(array $ids)
    {
        $undeleteable_ids = $this->repository->delete($ids);
       
        if (count($undeleteable_ids) === 0) {
            return response(["message" => "Deleção realizada com sucesso!"], 200);
        } else {

            if (count($undeleteable_ids) === count($ids)) {

                if (count($undeleteable_ids) === 1) {
                    return response(["message" => "Erro! A bateria possui vínculo com ordem de serviço ativa!"], 409);
                } else {
                    return response(["message" => "Erro! As baterias possuem vínculo com ordem de serviço ativa!"], 409);
                }
            } else if (count($undeleteable_ids) < count($ids)) {

                $message = "Erro! As baterias de id ";
                foreach ($undeleteable_ids as $index => $undeleteable_log_id) {

                    if (count($undeleteable_ids) > ($index + 1)) {
                        $message .= $undeleteable_log_id . ", ";
                    } else if (count($undeleteable_ids) === ($index + 1)) {
                        $message .= $undeleteable_log_id . " possuem vínculo com ordem de serviço ativa!";
                    }
                }

                return response(["message" => $message], 409);
            }
        }
    }
}
