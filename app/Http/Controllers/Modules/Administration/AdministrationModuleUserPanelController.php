<?php

namespace App\Http\Controllers\Modules\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Models\User\UserModel;
use App\Models\Profiles\ProfileModel;
use App\Http\Requests\Modules\Administration\UserPanel\UserPanelStoreRequest;
use App\Http\Requests\Modules\Administration\UserPanel\UserPanelUpdateRequest;
use App\Services\Modules\Administration\UserPanelService;

class AdministrationModuleUserPanelController extends Controller
{

    private UserPanelService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\Modules\Administration\UserPanelService $service
     */
    public function __construct(UserPanelService $service){
        $this->service = $service;
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
        $limit = (int) $args[0];
        $where_value = $args[1];
        $current_page = (int) $args[2];

        return $this->service->loadPagination($limit, $current_page, $where_value);

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
     * @param App\Http\Requests\Modules\Administration\UserPanel\UserPanelUpdateRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserPanelStoreRequest $request) : \Illuminate\Http\Response
    {

        Gate::authorize('administration_write');

        return $this->service->createUser($request);

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
        $limit = (int) $args[0];
        $where_value = $args[1];
        $current_page = (int) $args[2];

        return $this->service->loadPagination($limit, $current_page, $where_value);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\Administration\UserPanel\UserPanelStoreRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(UserPanelUpdateRequest $request, $id) : \Illuminate\Http\Response
    {

        Gate::authorize('administration_write');

        UserModel::where('id', $id)->update($request->only(["name", "email", "profile_id", "status"]));

        return response(["message" => "Usuário atualizado com sucesso!"], 200); 

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

        return $this->service->deleteUser($id);

    }
    
}
