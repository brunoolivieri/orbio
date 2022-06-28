<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Custom
use App\Models\User\UserModel;

class LoadUsersController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        if(isset($request->where)){
            $where = explode(".", $request->where);
            $data = UserModel::where($where[0], $where[1])->get();
        }else{
            $data = UserModel::all();
        }

        return $data;
       
    }
}
