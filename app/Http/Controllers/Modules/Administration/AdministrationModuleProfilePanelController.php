<?php

namespace App\Http\Controllers\Modules\Administration;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Http\Requests\Modules\Administration\ProfilePanel\ProfilePanelStoreRequest;
use App\Http\Requests\Modules\Administration\ProfilePanel\ProfilePanelUpdateRequest;
use App\Services\Modules\Administration\ProfilePanelService;

class AdministrationModuleProfilePanelController extends Controller
{
    private ProfilePanelService $service;

    /**
     * Dependency injection.
     * 
     * @param  App\Services\Administration\ProfilePanelService $service
     */
    public function __construct(ProfilePanelService $service){
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
        $limit = (int) $args[0]*5;
        $where_value = $args[1];
        $current_page = (int) $args[2];

        return $this->service->loadProfilesModulesWithPagination($limit, $current_page, $where_value);
        
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

        return $this->service->createProfile($request);

    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) :  \Illuminate\Http\Response
    {
        Gate::authorize('administration_read');
        
        $args = explode(".", request()->args);
        $limit = (int) $args[0]*5;
        $where_value = $args[1];
        $current_page = (int) $args[2];

        return $this->service->loadProfilesModulesWithPagination($limit, $current_page, $where_value);

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

        return $this->service->updateProfile($request, $id);

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

        return $this->service->deleteProfile($id);

    }
    
}
