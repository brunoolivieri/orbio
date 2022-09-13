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
        $this->model = $userModel;
    }

    public function __invoke(Request $request): \Illuminate\Http\Response
    {
        if (isset($request->where)) {
            $where = explode(".", $request->where);
            $data = $this->model->where($where[0], $where[1])->get();
        } else {
            $data = $this->model->all();
        }

        return response($data, 200);
    }
}
