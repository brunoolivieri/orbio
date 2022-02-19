<!-- CÓDIGO DO MAPA -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- FAVICON -->
    <link rel='shortcut icon' type='image/x-icon' href='favicon.ico'>
    <link rel="android-chrome" sizes="192x192" href="favicon/android-chrome-192x192.png">
    <link rel="android-chrome" sizes="512x512" href="favicon/android-chrome-512x512.png">
    <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
   <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
   <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
   <link rel="manifest" href="/site.webmanifest">


    <!-- MAPBOX-GL --> 
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js'></script>
   <link href='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css' rel='stylesheet' />

   <!-- TURF E MAPBOX-GL-DRAW -->
   <script src="https://unpkg.com/@turf/turf@6/turf.min.js"></script>
   <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.2.2/mapbox-gl-draw.js"></script>
   <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.2.2/mapbox-gl-draw.css" type="text/css">

   <!-- MAPBOX-GL-GEOCODER -->
   <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js"></script>
   <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css" type="text/css">

   <!-- Promise polyfill script required to use Mapbox GL Geocoder in IE 11 -->
   <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>

   <!-- BOOTSTRAP -->
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"> 

   <link href="css/map.css" type="text/css" rel="stylesheet">

   <!-- FILESAVER -->
   <script src="js/node_modules/file-saver/src/FileSaver.js"></script>

    <title>Página do Mapa</title>
</head>
<body>
    <div id='map'></div>

    <div class="calculation-box">
       <p>Desenhe um polígono</p>
       <div id="calculated-area">
           <p>0 m²</p>
       </div>
   </div>

   <div class="distance-box">
       <p>Distância Total da Rota</p> 	
       <div id="calculated-distance">0 Km</div>
   </div>

   <div class="logo-box">
       <img src="img/embrapa.png" alt="Embrapa Instrumentação"/>
       <img src="img/bv.png" alt="BirdView"/>
       <img src="img/ifsul.svg" alt="Instituto Federal Sul-rio-grandense"/>
       <img src="img/ufpel.svg" alt="Universidade Federal de Pelotas"/>
   </div>

       <div class="modal-content" id="modal">
           <form name="config">
               <h4 class="text-center">Parâmetros</h4>	
               <div class="mb-2">
                   <select class="form-select">
                     <option selected>Plantação</option>
                     <option value="1">#01</option>
                     <option value="2">#02</option>
                     <option value="3">#03</option>
                   </select>	
               </div>	
                   
               <div class="mb-2">	
                   <label for="altitude" class="form-label">Altitude:</label>
                   <input type="text" name="altitude" id="altitude" class="form-control" placeholder="em metros" />
               </div>

               <div class="mb-2">	
                   <label for="distance" class="form-label">Velocidade:</label>
                   <input type="text" name="speed" id="speed" class="form-control" placeholder="em m/s" />
               </div>
               
               <div>	
                   <label for="distance" id="label-distance" class="form-label">Distância de 50m</label>
                   <input type="range" min="1" max="100" value="50" name="distance" id="distance"/>
               </div>
              
           </form>
       </div>	

   <button id="btn" class="btn btn-primary">Configuração</button>

   <button id="btn-save" class="btn btn-success"><a href = "/sistema">Sair</a></button>

   <script src = "js/map.js"></script>
</body>
</html>