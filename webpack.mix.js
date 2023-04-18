const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
    .react()
    .postCss("resources/css/tailwind/index.css", "public/css/tailwind/index.css", [
        require("tailwindcss")
    ]);