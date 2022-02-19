<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Embrapa Birdview</title>

        <!-- FONTES -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

        <!-- ÍCONES - MATERIAL UI -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

        <!-- CSS GLOBAL - public/css/global.css -->
        <link rel="stylesheet" type="text/css" href="{{asset('css/global.css')}}" />

    </head>
    <body>

        <div id = "root" >

            <!-- AQUI OS COMPONENTES REACT SÃO RENDERIZADOS -->

        </div>
        
    </body>
    <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
    <script src = "js/app.js"></script>
</html>
