<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// Custom
use App\Http\Requests\Auth\ForgotPassword\PasswordResetTokenRequest;
use App\Services\Auth\PasswordResetService;

class PasswordResetTokenController extends Controller
{

    private PasswordResetService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\Auth\PasswordResetService $service
     */
    public function __construct(PasswordResetService $service){
        $this->service = $service;
    }

     /**
     * Method for handle change password token request.
     * 
     * @param App\Http\Requests\Auth\ForgotPassword\PasswordResetTokenRequest $request
     * @return \Illuminate\Http\Response
     */
    public function index(PasswordResetTokenRequest $request){

        return $this->service->getToken($request);

    }
}
