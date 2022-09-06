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
        $this->profileModel = $profileModel;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        return $this->profileModel->all();
    }
}
