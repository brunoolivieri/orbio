<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ env('APP_NAME'); }}</title>

        <!-- FONT -->
        <link rel="preconnect" href="https://fonts.googleapis.com">

        <!-- FONTSAWESOME KIT -->
        <script src="https://kit.fontawesome.com/49b7b83709.js" crossorigin="anonymous"></script>

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
    <script src = "js/app.js"></script>
</html>
