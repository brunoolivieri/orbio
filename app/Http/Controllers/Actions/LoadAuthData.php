<?php

namespace App\Http\Controllers\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Modules\Module;

class LoadAuthData extends Controller
{
    public function __invoke(): \Illuminate\Http\Response
    {

        $data = [
            "id" => Auth::user()->id,
            "name" => Auth::user()->name,
            "email" => Auth::user()->email,
            "profile_id" => Auth::user()->profile_id,
            "profile" => Auth::user()->profile->name
        ];

        $profile = Auth::user()->profile;

        foreach ($profile->modules as $module) {

            $module_first_name = explode(" ", $module->name);

            $data["user_powers"][$module->id] = ["module" => $module_first_name, "profile_powers" => ["read" => $module->pivot->read, "write" => $module->pivot->write]];
        }

        return response($data, 200);
    }
}
