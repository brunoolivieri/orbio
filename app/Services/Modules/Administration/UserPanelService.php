<?php

namespace App\Services\Modules\Administration;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
// Custom
use App\Services\FormatDataService;
use App\Models\User\UserModel;
use App\Models\Orders\ServiceOrderModel;
use App\Events\Modules\Admin\UserCreatedEvent;

class UserPanelService{

    private FormatDataService $format_data_service;
    private UserModel $user_model;

    /**
     * Dependency injection.
     * 
     * @param App\Models\User\UserModel $user
     * @param App\Services\FormatDataService $service
     */
    public function __construct(UserModel $user, FormatDataService $service){
        $this->format_data_service = $service;
        $this->user_model = $user;
    }

     /**
     * Load all users with their profiles with pagination.
     *
     * @param int $limit
     * @param int $actual_page
     * @param int|string $where_value
     * @return \Illuminate\Http\Response
     */
    public function loadPagination(int $limit, int $current_page, int|string $where_value) {

        $data = DB::table('users')
        ->join('profiles', 'users.profile_id', '=', 'profiles.id')
        ->select('users.id', 'users.name', 'users.email', 'users.profile_id', 'profiles.name as profile_name' , 'users.status', 'users.created_at', 'users.updated_at', 'users.last_access')
        ->where("users.deleted_at", null)
        ->when($where_value, function ($query, $where_value) {

            $query->when(is_numeric($where_value), function($query) use ($where_value){

                $query->where('users.id', $where_value);

            }, function($query) use ($where_value){

                $query->where('users.name', 'LIKE', '%'.$where_value.'%')->orWhere('users.email', 'LIKE', '%'.$where_value.'%');

            });

        })->orderBy('users.id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

        if($data->total() > 0){

            $data_formated = $this->format_data_service->userPanelDataFormatting($data);

            return response($data_formated, 200);

        }else{

            return response(["error" => "Nenhum usuário encontrado."], 404);

        }

    }

    /**
     * Create User and send access data for his email.
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function createUser($request) {

        DB::transaction(function () use ($request) {

            $this->user_model->profile_id = intval($request->profile_id);
            $this->user_model->name = $request->name;
            $this->user_model->email = $request->email;
            $this->user_model->password = Hash::make($request->password);
    
            $this->user_model->save();

            $data_for_email = [
                "name" => $this->user_model->name,
                "email" => $this->user_model->email,
                "profile" => $this->user_model->profile->name,
                "password" => $request->password
            ];

            event(new UserCreatedEvent($data_for_email));

        });

        return response(["message" => "Usuário criado com sucesso!"], 200);

    }

    /**
     * Soft delete user.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function deleteUser($id) {
        
        DB::transaction(function() use ($id){

            $user = UserModel::findOrFail($id);

            // If user is linked to a service order
            if(!empty($user->service_order_has_user)){

                // Desvinculations with service_orders table
                foreach($user->service_order_has_user as $index => $record){

                    // If user is a pilot and his name is the same of the pilot of the actual service order
                    if($user->profile_id == 3 && ($record->service_order->pilot_name === $user->name)){

                        ServiceOrderModel::where("id", $record->service_order_id)
                        ->where("pilot_name", $user->name)
                        ->update(["pilot_name" => null]);
                    
                    // If user is a client and his name is the same of the client of the actual service order
                    }else if($user->profile_id == 4 && ($record->service_order->client_name === $user->name)){

                        ServiceOrderModel::where("id", $record->service_order_id)
                        ->where("client_name", $user->name)
                        ->update(["client_name" => null]);
                    
                    // If the name of the user is the same of the creator of the actual service order
                    }else if(($record->service_order->creator_name === $user->name)){

                        ServiceOrderModel::where("id", $record->service_order_id)
                        ->where("creator_name", $user->name)
                        ->update(["creator_name" => null]);

                    }

                }

            }

            // Desvinculations with service_orders_has_user table 
            $user->service_order_has_user()->delete();

            // The user record is soft deleted
            UserModel::where('id', $id)->update(["status" => false]);
            UserModel::where('id', $id)->delete();

        });

        return response(["message" => "Usuário deletado com sucesso!"], 200);

    }
}