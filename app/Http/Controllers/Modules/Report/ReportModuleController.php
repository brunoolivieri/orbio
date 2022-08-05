<?php

namespace App\Http\Controllers\Modules\Report;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
// Custom
use App\Http\Requests\Modules\Reports\ReportStoreRequest;
use App\Http\Requests\Modules\Reports\ReportUpdateRequest;
use App\Services\Modules\Report\ReportService;

class ReportModuleController extends Controller
{

    private ReportService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\Modules\Report\ReportService $service
     */
    public function __construct(ReportService $service){
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {
        Gate::authorize('reports_read');

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        return $this->service->loadResourceWithPagination($limit, $actual_page, $where_value);

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ReportStoreRequest $request) : \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');

        return $this->service->createResource($request);

    }

     /**
     * Display the specified resource.
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function show($request) : \Illuminate\Http\Response
    {
        Gate::authorize('reports_read');

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        return $this->service->loadResourceWithPagination($limit, $actual_page, $where_value);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ReportUpdateRequest $request, $id) : \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');
        
        return $this->service->updateResource($request, $id);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) : \Illuminate\Http\Response
    {
        Gate::authorize('reports_write');
        
        return $this->service->deleteResource($request, $id);
 
    }
}
