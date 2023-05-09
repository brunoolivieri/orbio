<?php

namespace App\Http\Controllers\Actions\v1;

use App\Http\Controllers\Controller;
use App\Models\Profiles\Profile;

class LoadProfilesController extends Controller
{

    function __construct(Profile $profileModel)
    {
        $this->model = $profileModel;
    }

    public function __invoke()
    {
        try {
            $data = $this->model->all();
            return response()->json($data)->setStatusCode(200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()])->setStatusCode($e->getCode());
        }
    }
}
