<?php

namespace App\Http\Controllers\Modules\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User\UserModel;
use App\Models\ProfileAndModule\ProfileModel;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
// Classes de validação das requisições store/update
use App\Http\Requests\Modules\Administration\UserPanel\UserPanelStoreRequest;
use App\Http\Requests\Modules\Administration\UserPanel\UserPanelUpdateRequest;
// Log
use Illuminate\Support\Facades\Log;

class AdministrationModuleUserPanelController extends Controller
{
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model = new UserModel();
            
        $model_response = $model->loadUsersWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->formatDataForTable($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('administration_error')->error("[Nenhum registro de usuário encontrado no sistema]");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('administration_error')->error("[Erro no carregamento dos usuários] | Erro: ".$model_response["error"]);

            return response(["error" => $model_response->content()], 500);

        }  

    }

    private function formatDataForTable(LengthAwarePaginator $data) : array {

        $arr_with_formated_data = [];

        foreach($data->items() as $row => $record){

            $created_at_formated = date( 'd-m-Y h:i', strtotime($record->dh_criacao));
            $updated_at_formated = $record->dh_atualizacao == null ? "Sem dados" : date( 'd-m-Y h:i', strtotime($record->dh_atualizacao));
            $last_access_formated = $record->dh_ultimo_acesso == null ? "Sem dados" : date( 'd-m-Y h:i', strtotime($record->dh_ultimo_acesso));
            
            if($record->status == 1){

                $badge_status = ["Ativo", "success"];
            
            }else if($record->status == 0 && $record->dh_ultimo_acesso == null){

                $badge_status = ["Inativo", "error"];
            
            }else if($record->status == 0 && $record->dh_ultimo_acesso != null){

                $badge_status = ["Desativado", "error"];

            }

            $arr_with_formated_data["records"][$row] = array(
                "user_id" => $record->id,
                "name" => $record->nome,
                "email" => $record->email,
                "status_badge" => $badge_status,
                "status" => $record->status,
                "access" => $record->id_perfil,
                "profile_name" => $record->nome_perfil,
                "created_at" => $created_at_formated,
                "updated_at" => $updated_at_formated,
                "last_access" => $last_access_formated
            );

        }

        $arr_with_formated_data["total_records_founded"] = $data->total();
        $arr_with_formated_data["records_per_page"] = $data->perPage();
        $arr_with_formated_data["total_pages"] = $data->lastPage();

        return $arr_with_formated_data;

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() : \Illuminate\Http\Response
    {
        
        try{

            $data = ProfileModel::all();

            return response($data, 200);
    
        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 500);

        }

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserPanelStoreRequest $request) : \Illuminate\Http\Response
    {

        $model = new UserModel();

        // A senha não criptografada será utilizada no conteúdo do email
        $model_response = $model->createUser([
            "nome" => $request->name,
            "email" => $request->email,
            "senha" => Hash::make($request->password),
            "id_perfil" => $request->profile_id
        ], $request->password);

        if($model_response["status"] && !$model_response["error"]){

            Log::channel('administration_action')->info("[Cadastro de usuário realizado] | Email do usuário: ".$request->email." | Perfil do usuário: ". $request->profile_id);

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('administration_error')->error("[Erro no cadastro de usuário] | Erro: ".$model_response["error"]);

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

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];
        
        $model = new UserModel();
            
        $model_response = $model->loadUsersWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->formatDataForTable($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('administration_error')->error("[Nenhum registro de usuário encontrado na pesquisa]");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('administration_error')->error("[Erro no carregamentos dos usuários pesquisados] | Erro: ".$model_response["error"]);

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
    public function update(UserPanelUpdateRequest $request, $id) : \Illuminate\Http\Response
    {

        try{

            UserModel::where('id', $id)->update([
                "nome" => $request->name,
                "email" => $request->email,
                "id_perfil" => $request->profile_id,
                "status" => $request->status
            ]);

            Log::channel('administration_action')->info("[Atualização de usuário realizada] | ID do usuário: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('administration_error')->error("[Atualização de usuário falhou] | Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

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

        try{

            UserModel::where('id', $id)->delete();

            Log::channel('administration_action')->error("[Deleção de usuário realizada] | ID do usuário: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('administration_error')->error("[Deleção de usuário falhou] | Erro: ".$e->getMessage());

            return response(["error"=> $e->getMessage()], 500);

        }

    }
    
}
