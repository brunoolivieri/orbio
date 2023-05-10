<?php

namespace App\Http\Controllers\v1\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Users\User;

class LoadUsersController extends Controller
{

    function __construct(User $userModel)
    {
        $this->model = $userModel;
    }

    public function __invoke(Request $request)
    {
        try {

            if (isset($request->where)) {
                $where = explode(".", $request->where);
                $data = $this->model->where($where[0], $where[1])->get();
            } else {
                $data = $this->model->all();
            }

            return response()->json($data)->setStatusCode(200);
        } catch (\Exception $e) {
            return response()->json(["message" => $e->getMessage()])->setStatusCode($e->getCode());
        }
    }
}
