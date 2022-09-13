<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Modules\Module;

class LoadAuthData extends Controller
{
    public function __invoke(): \Illuminate\Http\Response
    {

        // If logged user is the Super Admin
        if (Auth::user()->profile_id == 1 && Auth::user()->profile->name == "Super-Admin") {

            $data = [
                "id" => Auth::user()->id,
                "name" => Auth::user()->name,
                "email" => Auth::user()->email,
                "profile_id" => Auth::user()->profile_id,
                "profile" => Auth::user()->profile->name
            ];

            // If the logged user is not the Super Admin
        } else if (Auth::user()->profile_id != 1) {

            $data = array(
                "id" => Auth::user()->id,
                "name" => Auth::user()->name,
                "profile_id" => Auth::user()->profile_id,
                "profile" => Auth::user()->profile->name
            );
        }

        foreach (Auth::user()->profile->modules as $record) {

            $module_name_splited = explode(" ", Module::find($record->module_id));

            $data["user_powers"][$record->module_id] = ["module" => $module_name_splited[0], "profile_powers" => ["read" => $record->read, "write" => $record->write]];
        }

        return response($data, 200);
    }
}
