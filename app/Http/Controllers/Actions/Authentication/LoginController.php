<?php

namespace App\Http\Controllers\Actions\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
// Custom
use App\Http\Requests\Auth\Login\LoginRequest;
use App\Models\User\UserComplementaryDataModel;
use App\Models\User\UserAddressModel;
use App\Models\User\UserModel;
use App\Notifications\Auth\LoginNotification;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(LoginRequest $request)
    {
        if (Auth::attempt($request->validated())) {

            $user = UserModel::find(Auth::user()->id);

            // User account is active
            if (Auth::user()->status && !is_null(Auth::user()->last_access)) {

                // To disable observer
                $user->withoutEvents(function () use ($user) {
                    $user->update(["last_access" => Carbon::now()]);
                });

                $user->notify(new LoginNotification($user));

                return response()->json(["message" => "Acesso autorizado!"], 200);

                // User account is inactive
            } else if (!Auth::user()->status && is_null(Auth::user()->last_access)) {

                $this->activateAccount();

                // To disable observer
                $user->withoutEvents(function () use ($user) {
                    $user->update(["last_access" => Carbon::now()]);
                });

                $user->notify(new LoginNotification($user));

                return response()->json(["message" => "Ativação e acesso realizados!"], 200);

                // User account is disabled or deleted
            } else if (!Auth::user()->status && !is_null(Auth::user()->last_access) || !is_null(Auth::user()->deleted_at)) {

                return response()->json(["message" => "Conta desabilitada!"], 500);
            }
        } else {

            return response()->json(["message" => "Credenciais inválidas!"], 500);
        }
    }

    /**
     * Method for activate user account
     * 
     * @return bool
     */
    private function activateAccount()
    {

        DB::transaction(function () {

            $user = UserModel::find(Auth::user()->id);

            $user->update(["status" => 1]);

            $new_address = UserAddressModel::create();

            $new_complementary_data = UserComplementaryDataModel::create([
                "address_id" => $new_address->id
            ]);

            // To disable observer
            $user->withoutEvents(function () use ($user, $new_complementary_data) {
                $user->where('id', Auth::user()->id)->update(["complementary_data_id" => $new_complementary_data->id]);
            });
        });
    }
}
