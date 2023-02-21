<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;
use App\Models\Users\User;

class UserAuthenticatedData extends Controller
{
    function __construct(User $userModel)
    {
        $this->model = $userModel;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        try {

            $user = $this->model->findOrFail(Auth::user()->id);

            $data = [
                "id" =>  $user->id,
                "name" =>  $user->name,
                "email" =>  $user->email,
                "profile_id" =>  $user->profile_id,
                "profile" =>  $user->profile->name
            ];

            $profile =  $user->profile;

            foreach ($profile->modules as $module) {

                $module_first_name = explode(" ", $module->name);

                $data["user_powers"][$module->id] = ["module" => $module_first_name, "profile_powers" => ["read" => $module->pivot->read, "write" => $module->pivot->write]];
            }

            return response($data, 200);
        } catch (Exception $e) {
            return response(["message" => $e->getMessage()], 500);
        }
    }
}
