<?php

namespace App\Http\Controllers\Modules\ServiceOrder;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Http\Requests\Modules\ServiceOrders\ServiceOrderStoreRequest;
use App\Http\Requests\Modules\ServiceOrders\ServiceOrderUpdateRequest;
use App\Services\Modules\ServiceOrder\ServiceOrderService;

class ServiceOrderModuleController extends Controller
{

    private ServiceOrderService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\Modules\ServiceOrder\ServiceOrderService $service
     */
    public function __construct(ServiceOrderService $service){
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_read');

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        return $this->service->loadPagination($limit, $actual_page, $where_value);

    }

    /**
     * Get data to fill the select inputs that exists in create and update formulary.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() : \Illuminate\Http\Response
    {
        $where = isset(request()->where) ? explode(".", request()->where) : false;
        $select = explode(".", request()->select_columns);

        try{

            $data = DB::table(request()->table)->where("deleted_at", null)->when( $where, function($query, $where){

                $query->where($where[0], $where[1]);

            })->select($select[0], $select[1])->get();

            return response($data, 200);

        }catch(\Exception $e){

            return response(["error" => $e->getMessage()]);

        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param App\Http\Requests\Modules\ServiceOrders\ServiceOrderStoreRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(ServiceOrderStoreRequest $request) : \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        return $this->service->createServiceOrder($request);

    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) : \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_read');
        
        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        return $this->service->loadPagination($limit, $actual_page, $where_value);
        
    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\ServiceOrders\ServiceOrderUpdateRequest $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(ServiceOrderUpdateRequest $request, $id) : \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        return $this->service->updateServiceOrder($request, $id);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) : \Illuminate\Http\Response
    {
        Gate::authorize('service_orders_write');

        return $this->service->deleteServiceOrder($id);
        
    }
}
