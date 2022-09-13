<?php

namespace App\Contracts;
use Illuminate\Support\Collection;

interface RepositoryInterface
{
    function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters);
    function createOne(Collection $data);
    function updateOne(Collection $data, string $identifier);
    function deleteOne(string $identifier);
}
