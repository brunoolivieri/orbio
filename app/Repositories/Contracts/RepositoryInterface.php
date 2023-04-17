<?php

namespace App\Repositories\Contracts;

interface RepositoryInterface
{
    function getPaginate(string $limit, string $page, string $search);
    function createOne(array $data);
    function updateOne(array $data, string $id);
    function delete(array $ids);
}
