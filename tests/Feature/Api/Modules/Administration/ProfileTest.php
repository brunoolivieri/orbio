<?php

namespace Tests\Feature\Api\Modules\Administration;

use Tests\TestCase;

class ProfileTest extends TestCase
{
    
    public function test_get_profiles()
    {
        $response = $this->getJson('/');

        $response->assertStatus(200);
    }

    public function test_create_profile()
    {
        //
    }

    public function test_update_profile()
    {
        //
    }

    public function test_delete_profile()
    {
        //
    }
}
