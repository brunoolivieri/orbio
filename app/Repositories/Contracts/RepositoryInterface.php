<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface RepositoryInterface
{
    function getPaginate(string $limit, string $page_number, string $search);
    function createOne(Collection $data);
    function updateOne(Collection $data, string $identifier);
    function delete(array $ids);
}
