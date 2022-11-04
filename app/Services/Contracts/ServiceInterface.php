<?php

namespace App\Services\Contracts;

interface ServiceInterface
{
    public function getPaginate(string $limit, string $order_by, string $page_number, string $search, array $filters);
    public function createOne(array $data);
    public function updateOne(array $data, string $identifier);
    public function deleteOne(string $identifier);
}
