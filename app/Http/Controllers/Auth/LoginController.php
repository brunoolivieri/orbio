<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
// Custom
use App\Models\User\UserModel;
use App\Http\Requests\Auth\Login\LoginRequest;
use App\Events\Auth\LoginEvent;
use App\Services\Auth\LoginService;

class LoginController extends Controller
{

    private UserModel $user_model;
    private LoginService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\Auth\LoginService $login_service
     * @param App\Models\User\UserModel $user
     */
    public function __construct(UserModel $user, LoginService $service){
        $this->user_model = $user;
        $this->service = $service;
    }
    
    /**
     * Method for login processing
     * 
     * @param Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    function index(LoginRequest $request) :  \Illuminate\Http\Response {

        $response = $this->service->login($request);

        if($response["status"]){
            return response(["message" => $response["message"]], 200);
        }else{
            return response(["error" => $response["message"]], 500);
        }

    }

}
