<?php

namespace App\Http\Controllers\Modules\Report;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
// Custom
use App\Models\Reports\ReportModel;
use App\Http\Requests\Modules\Reports\ReportStoreRequest;
use App\Http\Requests\Modules\Reports\ReportUpdateRequest;
use App\Services\FormatDataTable;

class ReportModuleController extends Controller
{

    private FormatDataTable $format_data_service;
    private ReportModel $report_model;

    /**
     * Dependency injection.
     * 
     * @param App\Services\FormatDataTable $service
     * @param App\Models\Reports\ReportModel $report
     */
    public function __construct(FormatDataTable $service, ReportModel $report){
        $this->format_data_service = $service;
        $this->report_model = $report;
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

        return $this->report_model->loadAReportsWithPagination($limit, $actual_page, $where_value);

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
        
        return $this->createReport($request);

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

        return $this->report_model->loadAReportsWithPagination($limit, $actual_page, $where_value); 

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
        
        return $this->updateReport($request, $id);

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
        
        return $this->deleteReport($request, $id);
 
    }
}
