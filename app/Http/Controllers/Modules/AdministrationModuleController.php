<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;

// Models
use App\Models\User\UserModel;
use App\Models\Auth\AuthenticationModel;
use App\Models\ProfileAndModule\ProfileModel;
use App\Models\ProfileAndModule\ProfileHasModuleModel;



class AdministrationModuleController extends Controller
{

    /**
     * Carrega e retorna os dados para compor o painel
     * O painel pode ser de administração de usuários
     * O painel pode ser de administração de perfis
     * Para determinar o caso a rota é acessada enviando uma query string de nome "panel"
     * Para os argumentos do SELECT, é enviada uma query string de nome "args"
     * 
     * MÉTODO: GET
     * 
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {

        $request_values = explode(".", request()->args);
        $limit = $request_values[1];

        if(request()->panel === "users_panel"){

            $model = new UserModel();
            
            $response = $model->loadUsersWithPagination((int) $limit);
    
            if($response["status"] && !$response["error"]){

                return response($response["data"], 200);
    
            }else if(!$response["status"] && $response["error"]){

                return response(["error" => $response->content()], 500);
    
            }  

        }else if(request()->panel === "profiles_panel"){

            $model = new ProfileHasModuleModel();

            // O LIMIT e o OFFSET originais devem ser multiplicados por 5
            // Isso ocorre porque cada grupo de cinco registros da tabela do BD serão agrupados em um
            $up_limit = $limit*5;
            $up_offset = $offset*5;

            $model_response = $model->loadAllRecords((int) $up_offset, (int) $up_limit);

            if($model_response["status"] && !$model_response["error"]){

                $dataFormated = $this->profilesPanelDataFormat($model_response["data"]["selectedRecords"], $model_response["data"]["referencialValueForCalcPages"], $limit);

                return response(["status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

            }else if(!$model_response["status"] && $model_response["error"]){

                return response(["status" => false, "error" => $response["error"]], 500);

            }  

        }

    }

     

    /**
     * Função para composição do formulário de criação de registro de usuário
     * 
     * MÉTODO: GET
     *
     * @return \Illuminate\Http\Response
     */
    public function create() : \Illuminate\Http\Response {

        try{

            $data = ProfileModel::all();

            return response($data, 200);
    
        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 500);

        }
 
    }
    
    /**
     * Função para processar a requisição da criação de um registro
     * Esse registro pode ser um novo usuário
     * Esse registro pode ser um novo perfil
     * Para determinar o caso a rota é acessada enviando uma query string de nome "panel"
     * 
     * MÉTODO: POST
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) : \Illuminate\Http\Response {

        if($request->panel === "users_panel"){

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
    
        }else if($request->panel === "profiles_panel"){

            $model = new ProfileModel();

            $model_response = $model->newProfile($request->except("auth", "panel"));

            if($model_response["status"] === true && !$model_response["error"]){

                return response(["error" => $model_response["error"]], 200);

            }else if(!$model_response["status"] && $model_response["error"]){

                return response(["error" => $model_response["error"]], 500);

            }


        }

    }

    /**
     * Função para mostrar um ou mais registros pesquisados
     * 
     * MÉTODO: GET
     *
     * @param string $request
     * @return array
     */
    public function show($param) : \Illuminate\Http\Response {
        
        $request_values = explode(".", $param);
        $panel = $request_values[0];
        $value_searched = $request_values[1];
        $offset = $request_values[2];
        $limit = $request_values[3];

        if($panel === "users_panel"){

            $model = new UserModel();
            
            $model_response = $model->loadSpecificUsers($value_searched, (int) $offset, (int) $limit);
    
            if($model_response["status"] && !$model_response["error"]){
    
                $dataFormated = $this->usersPanelDataFormat($model_response["data"], $limit);

                return response(["records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);
    
            }else if(!$model_response["status"] && $model_response["error"]){

                return response(["error" => $model_response["error"]], 500);
    
            }  

        }else if($panel === "profiles_panel"){

            $model = new ProfileHasModuleModel();

            // O LIMIT e o OFFSET originais devem ser multiplicados por 5
            // Isso ocorre porque cada grupo de cinco registros da tabela do BD serão agrupados em um
            $up_limit = $limit*5;
            $up_offset = $offset*5;

            $model_response = $model->loadRecordCompatibleWithTheSearchedValue($value_searched, (int) $up_offset, (int) $up_limit);

            if($model_response["status"] && !$model_response["error"]){
                
                $dataFormated = $this->profilesPanelDataFormat($model_response["data"]["selectedRecords"], (int) $model_response["data"]["referencialValueForCalcPages"], $limit);

                return response(["records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);
    
            }else if(!$model_response["status"] && $model_response["error"]){
                
                return response(["error" => $model_response["error"]], 500);
    
            } 

        }

    }

    /**
     * Função para processar a edição de um registro
     * 
     * MÉTODO: PATCH
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) : \Illuminate\Http\Response {

        if($request->panel === "users_panel"){

            $model = new UserModel();

            $model_response = $model->updateUserDataAndSendNotificationEmail((int) $id, $request->except("auth", "panel"));

            if($model_response["status"] && !$model_response["error"]){

                return response("", 200);

            }else if(!$model_response["status"] && $model_response["error"]){

                return response(["error" => $model_response["error"]], 500);

            }

        }else if($request->panel === "profiles_panel"){

            $model = new ProfileModel();

            $model_response = $model->updateProfile((int) $id, $request->profile_name, $request->profile_modules_relationship);

            if($model_response["status"] && !$model_response["error"]){

                return response("", 200);

            }else if(!$model_response["status"] && $model_response["error"]){

                return response(["error" => $model_response["error"]], 500);

            }

        }

    }
    
    /**
     * Função para processar a remoção de um registro
     * 
     * MÉTODO: DELETE
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($param) : \Illuminate\Http\Response {

        $query_params = explode(".", $param);
        $panel = $query_params[0];
        $id = $query_params[1];

        if($panel === "users_panel"){

            $model = new UserModel();

            $model_response = $model->deleteUser($id);

            if($model_response["status"]){

                return response("", 200);

            }else{

                return response("", 500);

            }

        }else if($panel === "profiles_panel"){

            $model = new ProfileModel();

            $model_response = $model->deleteProfile($id);

            if($model_response["status"] && !$model_response["error"]){

                return response("", 200);

            }else if(!$model_response["status"] && $model_response["error"]){

                return response(["error" => $model_response["error"]], 500);

            }

        }

    }
    


}
