<?php

namespace App\Http\Controllers\Modules\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Models\Pivot\ProfileHasModuleModel;
use App\Models\Profiles\ProfileModel;
use App\Models\Modules\ModuleModel;
use App\Http\Requests\Modules\Administration\ProfilePanel\ProfilePanelStoreRequest;
use App\Http\Requests\Modules\Administration\ProfilePanel\ProfilePanelUpdateRequest;
use App\Services\FormatDataService;

class AdministrationModuleProfilePanelController extends Controller
{
    private FormatDataService $format_data_service;
    private ProfileModel $profile_model;
    private ProfileHasModuleModel $profile_module_model;

    /**
     * Dependency injection.
     * 
     * @param App\Services\FormatDataService $service
     * @param App\Models\Pivot\ProfileModel $profile
     * @param App\Models\User\UserModel $user
     */
    public function __construct(FormatDataService $service, ProfileModel $profile, ProfileHasModuleModel $profile_module){
        $this->format_data_service = $service;
        $this->profile_model = $profile;
        $this->profile_module_model = $profile_module;
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {

        Gate::authorize('administration_read');

        $args = explode(".", request()->args);
        $limit = (int) $args[0]*5;
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model_response = $this->profile_module_model->loadProfilesModulesRelationshipWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){

            if($model_response["data"]->total() > 0){

                $data_formated = $this->format_data_service->profilePanelDataFormatting($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('administration_error')->error("[Método: Index][Controlador: AdministrationModuleProfilePanelController] - Nenhum perfil encontrado");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('administration_error')->error("[Método: Index][Controlador: AdministrationModuleProfilePanelController] - Erro no carregamento dos perfis - Erro: ".$model_response["error"]);

            return response(["status" => false, "error" => $response["error"]], 500);

        } 
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param App\Http\Requests\Modules\Administration\ProfilePanel\ProfilePanelStoreRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProfilePanelStoreRequest $request) : \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        $model_response = $this->profile_model->newProfile($request->name);

        if($model_response["status"] === true && !$model_response["error"]){

            Log::channel('administration_action')->info("[Método: Store][Controlador: AdministrationModuleProfilePanelController] - Perfil criado com sucesso - Nome do perfil: ".$request->name);

            return response(["error" => $model_response["error"]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('administration_error')->error("[Método: Store][Controlador: AdministrationModuleProfilePanelController] - Falha na criação do perfil - Erro: ".$model_response["error"]);

            return response(["error" => $model_response["error"]], 500);

        }

    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) : \Illuminate\Http\Response
    {
        Gate::authorize('administration_read');
        
        $args = explode(".", request()->args);
        $limit = (int) $args[0]*5;
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        $model_response = $this->profile_module_model->loadProfilesModulesRelationshipWithPagination($limit, $actual_page, $where_value);

        if($model_response["status"] && !$model_response["error"]){
            
            if($model_response["data"]->total() > 0){

                $data_formated = $this->format_data_service->profilePanelDataFormatting($model_response["data"]);

                return response($data_formated, 200);

            }else{

                Log::channel('administration_error')->error("[Método: Show][Controlador: AdministrationModuleProfilePanelController] - Nenhum perfil encontrado na pesquisa");

                return response(["error" => "records_not_founded"], 404);

            }

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('administration_error')->error("[Método: Show][Controlador: AdministrationModuleProfilePanelController] - Falha na realização da pesquisa - Erro: ".$model_response["error"]);
            
            return response(["error" => $model_response["error"]], 500);

        } 

    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\Administration\ProfilePanel\ProfilePanelUpdateRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(ProfilePanelUpdateRequest $request, $id) : \Illuminate\Http\Response
    {
        Gate::authorize('administration_write');

        $model_response = $this->profile_model->updateProfile((int) $id, $request->profile_name, $request->profile_modules_relationship);

        if($model_response["status"] && !$model_response["error"]){

            Log::channel('administration_action')->info("[Método: Update][Controlador: AdministrationModuleProfilePanelController] - Perfil atualizado com sucesso - ID do perfil: ".$id);

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            Log::channel('administration_error')->error("[Método: Update][Controlador: AdministrationModuleProfilePanelController] - Registro não foi atualizado - ID do perfil: ".$id." - Erro: ".$model_response["error"]);

            return response(["error" => $model_response["error"]], 500);

        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) : \Illuminate\Http\Response
    {

        Gate::authorize('administration_write');

        try{

            DB::BeginTransaction();

            $profile = ProfileModel::find($id);

            // Desvinculation with user table
            if(!empty($profile->user)){ 
                $profile->user()->update(["profile_id" => 5]);
            }

            // Desvinculation with profile_has_module table
            //$profile->module_privileges()->delete();
            
            // The record will be soft deleted
            $profile->delete();

            Log::channel('administration_action')->info("[Método: Destroy][Controlador: AdministrationModuleProfilePanelController] - Perfil removido com sucesso - ID do perfil: ".$id);

            DB::Commit();

            return response("", 200);

        }catch(\Exception $e){

            DB::rollBack();

            Log::channel('administration_error')->error("[Método: Destroy][Controlador: AdministrationModuleProfilePanelController] - Perfil não foi removido - ID do perfil: ".$id." - Erro: ".$e->getMessage());

            return response(["error" => $e->getMessage()], 500);

        }

    }
    
}
