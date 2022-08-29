<?php

namespace App\Services\Modules\Administration;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
// Custom
use App\Models\User\UserModel;
use App\Models\Pivot\ServiceOrderHasUserModel;
use App\Notifications\Modules\Administration\User\UserCreatedNotification;
use App\Notifications\Modules\Administration\User\UserUpdatedNotification;
use App\Notifications\Modules\Administration\User\UserDisabledNotification;
use App\Http\Resources\Modules\Administration\UsersPanelResource;

class UserPanelService
{

    /**
     * Dependency injection.
     * 
     * @param App\Models\User\UserModel $user
     * @param App\Models\Pivot\ServiceOrderHasFlightPlanModel $service_order_has_user_model
     */
    public function __construct(UserModel $user_model, ServiceOrderHasUserModel $service_order_has_user_model)
    {
        $this->user_model = $user_model;
        $this->$service_order_has_user_model = $service_order_has_user_model;
    }

    /**
     * Load all users with their profiles with eloquent pagination.
     *
     * @param int $limit
     * @param int $actual_page
     * @param int|string $typed_search
     * @return \Illuminate\Http\Response
     */
    public function loadResourceWithPagination(int $limit, string $order_by, int $page_number, int|string $search, int|array $filters): \Illuminate\Http\Response
    {

        $data = $this->user_model->with(["profile:id,name", "complementary_data:id"])
            ->search($search) // scope
            ->filter($filters) // scope
            ->orderBy($order_by)
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $page_number);

        if ($data->total() > 0) {
            return response(new UsersPanelResource($data), 200);
        } else {
            return response(["message" => "Nenhum usuário encontrado."], 404);
        }
    }

    /**
     * Create User and send access data for his email.
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function createResource(Request $request): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($request) {

            $random_password = Str::random(10);

            $user = $this->user_model->create([
                "name" => $request->name,
                "email" => $request->email,
                "profile_id" => $request->profile_id,
                "password" => $random_password
            ]);

            $user->notify(new UserCreatedNotification($user, $random_password));
        });

        return response(["message" => "Usuário criado com sucesso!"], 200);
    }

    /**
     * Update User.
     *
     * @param $request
     * @return \Illuminate\Http\Response
     */
    public function updateResource(Request $request, $user_id): \Illuminate\Http\Response
    {

        $user = $this->user_model->findOrFail($user_id);

        $user->update([
            "name" => $request->name,
            "email" => $request->email,
            "status" => intval($request->status)
        ]);

        $user->refresh();

        $user->notify(new UserUpdatedNotification($user));

        return response(["message" => "Usuário atualizado com sucesso!"], 200);
    }

    /**
     * Soft delete user.
     *
     * @param int $user_id
     * @return \Illuminate\Http\Response
     */
    public function deleteResource(int $user_id): \Illuminate\Http\Response
    {

        DB::transaction(function () use ($user_id) {

            $user = $this->user_model->findOrFail($user_id);

            // If user is related to any service order as creator
            if ($user->service_order_has_user("creator_id")) {

                $this->service_order_has_user_model->where("creator_id", $user->id)->update(["creator_id" => null]);

                // If user is related to any service order as pilot
            } else if ($user->service_order_has_user("pilot_id")) {

                $this->service_order_has_user_model->where("pilot_id", $user->id)->update(["pilot_id" => null]);

                // If user is related to any service order as client
            } else if ($user->service_order_has_user("client_id")) {

                $this->service_order_has_user_model->where("client_id", $user->id)->update(["client_id" => null]);
            }

            // The user record is soft deleted
            $user->update(["status" => false]);
            $user->delete();

            $user->notify(new UserDisabledNotification($user));
        });

        return response(["message" => "Usuário deletado com sucesso!"], 200);
    }
}
