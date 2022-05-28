<?php

namespace App\Http\Controllers\Modules\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;
// Form Requests
use App\Http\Requests\Modules\Administration\UserPanel\UserPanelStoreRequest;
use App\Http\Requests\Modules\Administration\UserPanel\UserPanelUpdateRequest;
// Models
use App\Models\Orders\ServiceOrderHasUserModel;
use App\Models\User\UserModel;
use App\Models\ProfileAndModule\ProfileModel;
use  App\Models\Orders\ServiceOrdersModel;
// Events
use App\Events\Modules\Admin\UserCreatedEvent;

class AdministrationModuleUserPanelController extends Controller
{
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {

        Gate::authorize('administration_read');

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

                Log::channel('administration_error')->info("[Método: Index][Controlador: AdministrationModuleUserPanelController] - Nenhum registro de usuário encontrado no sistema");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('administration_error')->error("[Método: Index][Controlador: AdministrationModuleUserPanelController] - Os registros não foram carregados - Erro: ".$model_response["error"]);

            return response(["error" => $model_response->content()], 500);

        }  

    }

    /**
     * Form data for frontend table.
     *
     * @return array
     */
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

        Gate::authorize('administration_write');

        try{

            DB::transaction(function () use ($request) {

                $user = new UserModel();

                $user->id_perfil = intval($request->profile_id);
                $user->nome = $request->name;
                $user->email = $request->email;
                $user->senha = Hash::make($request->password);
        
                $user->save();

                $data_for_email = [
                    "name" => $user->nome,
                    "email" => $user->email,
                    "profile" => $user->profile->nome,
                    "password" => $request->password
                ];

                event(new UserCreatedEvent($data_for_email));

                Log::channel('mail')->info("[Método: createUser][Model: UserModel] - Dados de acesso do novo usuário enviados com sucesso - Destinatário: ".$request->email);
                Log::channel('administration_action')->info("[Método: Store][Controlador: AdministrationModuleUserPanelController] - Usuário criado com sucesso - Email do usuário: ".$request->email." - Perfil do usuário: ". $request->profile_id);

            });

            return response("", 200);


        }catch(\Exception $e){

            Log::channel('administration_error')->error("[Método: Store][Controlador: AdministrationModuleUserPanelController] - Falha na criação do usuário - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

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

        Gate::authorize('administration_read');

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

                Log::channel('administration_error')->error("[Método: Show][Controlador: AdministrationModuleUserPanelController] - Nenhum registro encontrado na pesquisa");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('administration_error')->error("[Método: Show][Controlador: AdministrationModuleUserPanelController] - Erro: ".$model_response["error"]);

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

        Gate::authorize('administration_write');

        try{

            UserModel::where('id', $id)->update([
                "nome" => $request->name,
                "email" => $request->email,
                "id_perfil" => $request->profile_id,
                "status" => $request->status
            ]);

            Log::channel('administration_action')->info("[Método: Update][Controlador: AdministrationModuleUserPanelController] - Usuário atualizado com sucesso - ID do usuário: ".$id);

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('administration_error')->error("[Método: Update][Controlador: AdministrationModuleUserPanelController] - Falha na atualização do usuário - Erro: ".$e->getMessage());

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

        Gate::authorize('administration_write');

        try{

            DB::beginTransaction();

            $user = UserModel::find($id);

            // If user is linked to a service order
            if(!empty($user->service_order_has_user)){

                // Desvinculations with service_orders table
                // The user name must be removed from the service_order 
                foreach($user->service_order_has_user as $index => $record){

                    // If user is a pilot and his name is the same of the pilot of the actual service order
                    if($user->id_perfil == 3 && ($record->service_order->nome_piloto === $user->nome)){

                        ServiceOrdersModel::where("id", $record->id_ordem_servico)
                        ->where("nome_piloto", $user->nome)
                        ->update(["nome_piloto" => null]);
                    
                    // If user is a client and his name is the same of the client of the actual service order
                    }else if($user->id_perfil == 4 && ($record->service_order->nome_cliente === $user->nome)){

                        ServiceOrdersModel::where("id", $record->id_ordem_servico)
                        ->where("nome_cliente", $user->nome)
                        ->update(["nome_cliente" => null]);
                    
                    // If the name of the user is the same of the creator of the actual service order
                    }else if(($record->service_order->nome_criador === $user->nome)){

                        ServiceOrdersModel::where("id", $record->id_ordem_servico)
                        ->where("nome_criador", $user->nome)
                        ->update(["nome_criador" => null]);

                    }

                }

            }

            // Desvinculations with service_orders_has_user table 
            // The relations with the user id are deleted
            $user->service_order_has_user()->delete();

            // The user record is soft deleted
            UserModel::where('id', $id)->update(["status" => false]);
            UserModel::where('id', $id)->delete();

            // Destroy user session?

            Log::channel('administration_action')->info("[Método: Destroy][Controlador: AdministrationModuleUserPanelController] - Usuário removido com sucesso - ID do usuário: ".$id);

            DB::Commit();

            return response("", 200);

        }catch(\Exception $e){

            Log::channel('administration_error')->error("[Método: Destroy][Controlador: AdministrationModuleUserPanelController] - Falha na remoção do usuário - Erro: ".$e->getMessage());

            DB::rollBack();

            return response(["error"=> $e->getMessage()], 500);

        }

    }
    
}
