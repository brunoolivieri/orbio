<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Custom
use App\Models\Users\User;

class LoadUsersController extends Controller
{

    function __construct(User $userModel)
    {
        $this->userModel = $userModel;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        if (isset($request->where)) {
            $where = explode(".", $request->where);
            $data = $this->userModel->where($where[0], $where[1])->get();
        } else {
            $data = $this->userModel->all();
        }

        return $data;
    }
}
