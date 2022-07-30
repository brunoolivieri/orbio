<?php

namespace App\Services\Modules\Administration;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
// Custom
use App\Services\FormatDataService;
use App\Models\User\UserModel;
use App\Models\Orders\ServiceOrderModel;
use App\Models\Pivot\ServiceOrderHasUserModel;
use App\Notifications\Modules\Administration\User\UserCreatedNotification;
use App\Notifications\Modules\Administration\User\UserUpdatedNotification;
use App\Notifications\Modules\Administration\User\UserDisabledNotification;

class UserPanelService{

    private FormatDataService $format_data_service;
    private UserModel $model;

    /**
     * Dependency injection.
     * 
     * @param App\Models\User\UserModel $user
     * @param App\Services\FormatDataService $service
     */
    public function __construct(UserModel $model, FormatDataService $service){
        $this->format_data_service = $service;
        $this->model = $model;
    }

     /**
     * Load all users with their profiles with pagination.
     *
     * @param int $limit
     * @param int $actual_page
     * @param int|string $where_value
     * @return \Illuminate\Http\Response
     */
    public function loadUsersWithPagination(int $limit, int $current_page, int|string $where_value) : \Illuminate\Http\Response {

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

            return response(["message" => "Nenhum usuário encontrado."], 404);

        }

    }

    /**
     * Create User and send access data for his email.
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function createUser(Request $request) : \Illuminate\Http\Response {

        DB::transaction(function () use ($request) {

            $this->model->profile_id = intval($request->profile_id);
            $this->model->name = $request->name;
            $this->model->email = $request->email;
            $this->model->password = Hash::make($request->password);

            $this->model->save();

            $user = UserModel::findOrFail($this->model->id);

            $user->notify(new UserCreatedNotification($user, $request->password));

        });

        return response(["message" => "Usuário criado com sucesso!"], 200);

    }

     /**
     * Update User.
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function updateUser(Request $request, $user_id) : \Illuminate\Http\Response{

        $user = $this->model->findOrFail($user_id);

        $user->update([
            "name" => $request->name,
            "email" => $request->email,
            "profile_id" =>  $request->profile_id,
            "status" =>  $request->boolean("status")
        ]);

        $user->notify(new UserUpdatedNotification($user));

        return response(["message" => "Usuário atualizado com sucesso!"], 200); 

    }

    /**
     * Soft delete user.
     *
     * @param int $user_id
     * @return \Illuminate\Http\Response
     */
    public function deleteUser(int $user_id) : \Illuminate\Http\Response {
        
        DB::transaction(function() use ($user_id){

            $user = UserModel::findOrFail($user_id);

            // If user is related to any service order as creator
            if($user->service_order_has_user("creator_id")){
                
                ServiceOrderHasUserModel::where("creator_id", $user->id)->update(["creator_id" => null]);
            
            // If user is related to any service order as pilot
            }else if($user->service_order_has_user("pilot_id")){

                ServiceOrderHasUserModel::where("pilot_id", $user->id)->update(["pilot_id" => null]);
            
            // If user is related to any service order as client
            }else if($user->service_order_has_user("client_id")){

                ServiceOrderHasUserModel::where("client_id", $user->id)->update(["client_id" => null]);

            }

            // The user record is soft deleted
            $user->update(["status" => false]);
            $user->delete();

            $user->notify(new UserDisabledNotification($user));

        });

        return response(["message" => "Usuário deletado com sucesso!"], 200);

    }
}