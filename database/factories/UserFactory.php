<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User\UserModel;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{

    protected $model = UserModel::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'id_perfil' => Arr::random([1, 2, 3, 4, 5]),
            'nome' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'senha' => Hash::make("123456789User"),
            'status' => (bool) Arr::random([0, 1]),
            'dh_atualizacao' => Arr::random([now(), null]),
        ];
    }
}
