<?php

namespace App\Contracts;

interface ServiceInterface
{
    public function loadResourceWithPagination(string $limit, string $order_by, string $page_number, string $search, array $filters);
    public function createResource(array $data);
    public function updateResource(array $data, string $identifier);
    public function deleteResource(string $identifier);
}
