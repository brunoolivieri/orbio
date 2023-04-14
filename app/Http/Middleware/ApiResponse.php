<?php

namespace App\Http\Middleware;

use Closure;

class ApiResponse
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        if (!$response->hasData()) {
            $response->setData(['data' => $response->getContent()]);
        }

        return $response;
    }
}
