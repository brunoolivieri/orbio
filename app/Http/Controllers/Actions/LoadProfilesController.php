<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Custom
use App\Models\Profiles\Profile;

class LoadProfilesController extends Controller
{

    function __construct(Profile $profileModel)
    {
        $this->model = $profileModel;
    }

    public function __invoke(): \Illuminate\Http\Response
    {
        $data = $this->model->all();

        return response($data, 200);
    }
}
