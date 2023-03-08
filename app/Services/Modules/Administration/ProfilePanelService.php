<?php

namespace App\Services\Modules\Administration;

use Exception;
use App\Services\Contracts\ServiceInterface;
use App\Repositories\Modules\Administration\ProfileRepository;

class ProfilePanelService implements ServiceInterface
{

    function __construct(ProfileRepository $profileRepository)
    {
        $this->repository = $profileRepository;
    }

    function getPaginate(string $limit, string $page, string $search)
    {
        return $this->repository->getPaginate($limit, $page, $search);
    }

    function createOne(array $data)
    {
        $profile = $this->repository->createOne(collect($data));
    }

    function updateOne(array $data, string $identifier)
    {
        $profile = $this->repository->updateOne(collect($data), $identifier);
    }

    function delete(array $ids)
    {
        $profile = $this->repository->delete($ids);
    }
}

?>
