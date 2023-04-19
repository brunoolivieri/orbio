<?php

namespace App\Services\Modules\Equipment;

use App\Services\Contracts\ServiceInterface;
use App\Repositories\Modules\Equipments\EquipmentRepository;

class EquipmentService implements ServiceInterface
{
    function __construct(EquipmentRepository $equipmentRepository)
    {
        $this->repository = $equipmentRepository;
    }

    public function getPaginate(string $limit, string $page, string $search)
    {
        return $this->repository->getPaginate($limit, $page, $search);
    }

    public function createOne(array $data)
    {
        $image_content = file_get_contents($data['image']);
        $image_content_hash = md5($image_content);
        $filename = "$image_content_hash.jpeg";
        $path = "equipments/images/equipments/" . $filename;

        $data["image_content"] = $image_content;
        $data["image_path"] = $path;

        $equipment = $this->repository->createOne($data);
    }

    public function updateOne(array $data, string $identifier)
    {
        $data["change_image"] = 0;

        if (isset($data['image'])) {
            $image_content = file_get_contents($data['image']);
            $image_content_hash = md5($image_content);
            $filename = "$image_content_hash.jpeg";
            $path = "equipments/images/equipments/" . $filename;

            $data["change_image"] = 1;
            $data["image_content"] = $image_content;
            $data["image_path"] = $path;
        }

        $equipment = $this->repository->updateOne($data, $identifier);
    }

    public function delete(array $ids)
    {
        $undeleteable_ids = $this->repository->delete($ids);

        if (count($undeleteable_ids) > 0) {

            $message = "";

            if (count($undeleteable_ids) === count($ids)) {
                if (count($undeleteable_ids) === 1) {
                    $message = "Erro! O equipamento possui vínculo com ordem de serviço ativa!";
                } else {
                    $message = "Erro! Os equipamentos possuem vínculo com ordem de serviço ativa!";
                }
            } else if (count($undeleteable_ids) < count($ids)) {

                $message = "Erro! Os equipamentos de id ";
                foreach ($undeleteable_ids as $index => $undeleteable_log_id) {

                    if (count($undeleteable_ids) > ($index + 1)) {
                        $message .= $undeleteable_log_id . ", ";
                    } else if (count($undeleteable_ids) === ($index + 1)) {
                        $message .= $undeleteable_log_id . " possuem vínculo com ordem de serviço ativa!";
                    }
                }
            }

            throw new \Exception($message, 409);
        }
    }
}
