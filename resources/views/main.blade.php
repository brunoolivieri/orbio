<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ env('APP_NAME'); }}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap" rel="stylesheet">
        <script src="https://kit.fontawesome.com/49b7b83709.js" crossorigin="anonymous"></script>
        <link rel="stylesheet" type="text/css" href="{{asset('css/root/index.css')}}" />
    </head>
    <body>
        <div id = "root" >
        </div>
    </body>
    <script src = "js/app.js"></script>
</html>
