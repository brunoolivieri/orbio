<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdministrationModuleUserPanelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $request_values = explode(".", request()->args);
        $limit = $request_values[1];

        $model = new UserModel();
            
        $response = $model->loadUsersWithPagination((int) $limit);

        if($response["status"] && !$response["error"]){

            return response($response["data"], 200);

        }else if(!$response["status"] && $response["error"]){

            return response(["error" => $response->content()], 500);

        }  

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $model = new UserModel();

        // A senha não criptografada será utilizada no conteúdo do email
        $model_response = $model->createUserAndSendAccessData([
            "nome" => $request->nome,
            "email" => $request->email,
            "senha" => password_hash($request->senha, PASSWORD_DEFAULT),
            "id_perfil" => $request->id_perfil
        ], $request->senha);

        if($model_response["status"] && !$model_response["error"]){

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
        $model = new UserModel();
            
        $model_response = $model->loadSpecificUsers($value_searched, (int) $offset, (int) $limit);

        if($model_response["status"] && !$model_response["error"]){

            $dataFormated = $this->usersPanelDataFormat($model_response["data"], $limit);

            return response(["records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }  

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        
        $model = new UserModel();

        $model_response = $model->updateUserDataAndSendNotificationEmail((int) $id, $request->except("auth", "panel"));

        if($model_response["status"] && !$model_response["error"]){

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        
        $model = new UserModel();

        $model_response = $model->deleteUser($id);

        if($model_response["status"]){

            return response("", 200);

        }else{

            return response("", 500);

        }

    }
}
