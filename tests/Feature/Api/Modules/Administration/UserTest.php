<?php

namespace Tests\Feature\Api\Modules\Administration;

use Tests\TestCase;

class UserTest extends TestCase
{

    public function test_get_users()
    {
        $response = $this->getJson('/api/admin-module-user');

        $response->assertStatus(200);
    }

    public function test_create_user()
    {
        //
    }

    public function test_update_user()
    {
        //
    }

    public function test_delete_user()
    {
        //
    }
}
