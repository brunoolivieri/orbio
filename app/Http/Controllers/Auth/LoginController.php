<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\User;
// Custom
use App\Http\Requests\Auth\Login\LoginRequest;
use App\Services\Auth\LoginService;

class LoginController extends Controller
{
    private LoginService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\Auth\LoginService $login_service
     * @param App\Models\User\UserModel $user
     */
    public function __construct(LoginService $service){
        $this->service = $service;
    }
    
    /**
     * Method for login processing
     * 
     * @param Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    function index(LoginRequest $request) :  \Illuminate\Http\Response {

        return $this->service->login($request);

    }

}
