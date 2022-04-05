<?php

namespace App\Http\Controllers\Modules\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User\UserModel;

class AdministrationModuleUserPanelController extends Controller
{
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {

        $limit = request()->limit;

        $model = new UserModel();
            
        $model_response = $model->loadUsersWithPagination((int) $limit);

        dd($model_response["data"]);

        if($model_response["status"] && !$model_response["error"]){

            return response($model_response["data"], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response->content()], 500);

        }  

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) : \Illuminate\Http\Response
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
    public function show($id) : \Illuminate\Http\Response
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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) : \Illuminate\Http\Response
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
    public function destroy($id) : \Illuminate\Http\Response
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
