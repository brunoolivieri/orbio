<?php

namespace App\Http\Controllers\Actions\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherDataController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $state = strtoupper(request()->state);
        $city = ucfirst(strtolower(request()->city));
        $key = env('HG_WEATHER_API_KEY');

        $response = Http::get("https://api.hgbrasil.com/weather?key=$key&city_name=$city,$state")["results"];

        return response([
            "temperature" => $response["temp"],
            "humidity" => $response["humidity"],
            "wind_speedy" => $response["wind_speedy"]
        ], 200);
    }
}
