<?php

namespace Tests\Feature\Api\Modules\Administration;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_get_users_for_panel()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
