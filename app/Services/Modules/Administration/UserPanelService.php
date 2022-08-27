<?php

namespace App\Services\Modules\Administration;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
// Custom
use App\Contracts\Services\ModuleServiceInterface;
use App\Models\User\UserModel;
use App\Models\Orders\ServiceOrderModel;
use App\Models\Pivot\ServiceOrderHasUserModel;
use App\Notifications\Modules\Administration\User\UserCreatedNotification;
use App\Notifications\Modules\Administration\User\UserUpdatedNotification;
use App\Notifications\Modules\Administration\User\UserDisabledNotification;
use App\Http\Resources\Modules\Administration\UsersPanelResource;

class UserPanelService
{

    private UserModel $model;

    /**
     * Dependency injection.
     * 
     * @param App\Models\User\UserModel $user
     * @param App\Services\FormatDataService $service
     */
    public function __construct(UserModel $model)
    {
        $this->model = $model;
    }

    /**
     * Load all users with their profiles with eloquent pagination.
     *
     * @param int $limit
     * @param int $actual_page
     * @param int|string $typed_search
     * @return \Illuminate\Http\Response
     */
    public function loadResourceWithPagination(int $limit, int $current_page, int|string $typed_search): \Illuminate\Http\Response
    {

        // Add: when trashed = ->withTrashed()
        // Add: when active = by active

        $data = UserModel::with(["profile:id,name", "complementary_data:id"])
            ->when($typed_search, function ($query, $typed_search) {

                $query->when(is_numeric($typed_search), function ($query) use ($typed_search) {

                    $query->where('users.id', $typed_search);
                }, function ($query) use ($typed_search) {

                    $query->where('users.name', 'LIKE', '%' . $typed_search . '%')->orWhere('users.email', 'LIKE', '%' . $typed_search . '%');
                });
            })
            ->orderBy("id")
            ->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

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

            $user = $this->model->create([
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

        $user = $this->model->findOrFail($user_id);

        $user->update($request->validated());

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

            $user = UserModel::findOrFail($user_id);

            // If user is related to any service order as creator
            if ($user->service_order_has_user("creator_id")) {

                ServiceOrderHasUserModel::where("creator_id", $user->id)->update(["creator_id" => null]);

                // If user is related to any service order as pilot
            } else if ($user->service_order_has_user("pilot_id")) {

                ServiceOrderHasUserModel::where("pilot_id", $user->id)->update(["pilot_id" => null]);

                // If user is related to any service order as client
            } else if ($user->service_order_has_user("client_id")) {

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
