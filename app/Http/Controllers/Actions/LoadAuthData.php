<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// Custom
use App\Models\Modules\ModuleModel;

class LoadAuthData extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {

        // If logged user is the Super Admin
        if(Auth::user()->profile_id == 1 && Auth::user()->profile->name == "Super-Admin"){

            $data = [
                "id" => Auth::user()->id, 
                "name"=> Auth::user()->name,  
                "email"=> Auth::user()->email, 
                "profile_id" => Auth::user()->profile_id,
                "profile" => Auth::user()->profile->name
            ];

        // If the logged user is not the Super Admin
        }else if(Auth::user()->profile_id != 1){

            $data = array(
                "id" => Auth::user()->id, 
                "name"=> Auth::user()->name, 
                "profile_id" => Auth::user()->profile_id, 
                "profile" => Auth::user()->profile->name
            );

        }

        foreach(Auth::user()->profile->module_privileges as $row => $record){

            $module_name_splited = explode(" ", ModuleModel::find($record->module_id));

            $data["user_powers"][$record->module_id] = ["module" => $module_name_splited[0], "profile_powers" => ["read" => $record->read, "write" => $record->write]];

        }

        return response($data, 200);
    }
}
