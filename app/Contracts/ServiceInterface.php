<?php

namespace App\Contracts;

use Illuminate\Http\Request;;

interface ServiceInterface
{
    public function loadResourceWithPagination(int $limit, string $order_by, int $page_number, int|string $search, int|array $filters): \Illuminate\Http\Response;
    public function createResource(Request $request): \Illuminate\Http\Response;
    public function updateResource(Request $request, int $user_id): \Illuminate\Http\Response;
    public function deleteResource(int $user_id): \Illuminate\Http\Response;
}
