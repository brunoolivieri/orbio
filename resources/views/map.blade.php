<!DOCTYPE html>
 <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
 <head>
 	<meta charset="UTF-8">
 	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	 <!-- FONT -->
	 <link rel="preconnect" href="https://fonts.googleapis.com">

 	<!-- FAVICON -->
 	<link rel='shortcut icon' type='image/x-icon' href="{{ asset('images/map/favicon/favicon.ico') }}">
 	<link rel="android-chrome" sizes="192x192" href="{{ asset('images/map/favicon/android-chrome-192x192.png') }}">
 	<link rel="android-chrome" sizes="512x512" href="{{ asset('images/map/favicon/android-chrome-512x512.png') }}">
 	<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/map/favicon/apple-touch-icon.png') }}">
	<link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/map/favicon/favicon-32x32.png') }}">
	<link rel="icon" type="image/png" sizes="16x16" href="{{ asset('images/map/favicon/favicon-16x16.png') }}">
	<link rel="manifest" href="/site.webmanifest">

	<!-- MAPBOX-GL --> 
	<script src="{{ asset('js/map/mapbox-gl.js') }}"></script>
	<link href="{{ asset('css/map/mapbox-gl.css') }}" type="text/css" rel='stylesheet' />

	<!-- TURF E MAPBOX-GL-DRAW -->
	<script src="{{ asset('js/map/turf.min.js') }}"></script>
	<script src="{{ asset('js/map/mapbox-gl-draw.js') }}"></script>
	<link href="{{ asset('css/map/mapbox-gl-draw.css') }}" type="text/css" rel="stylesheet">

	<!-- MAPBOX-GL-GEOCODER -->
	<script src="{{ asset('js/map/mapbox-gl-geocoder.min.js') }}"></script>
	<link href="{{ asset('css/map/mapbox-gl-geocoder.css') }}" type="text/css" rel="stylesheet">

	<!-- Promise polyfill script required to use Mapbox GL Geocoder in IE 11 -->
	<script src="{{ asset('js/map/es6-promise.min.js') }}"></script>
	<script src="{{ asset('js/map/es6-promise.auto.min.js') }}"></script>

	<!-- AXIOS -->
	<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

	<!-- BOOTSTRAP -->
	<link href="{{ asset('css/map/bootstrap.min.css') }}" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<script src="{{ asset('js/map/jquery-3.3.1.slim.min.js') }}" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="{{ asset('js/map/popper.min.js') }}" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="{{ asset('js/map/bootstrap.min.js') }}" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
	<script src="{{ asset('js/map/bootstrap.bundle.min.js') }}" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

	<!-- FOLHA DE ESTILO PADRÃO -->
	<link href="{{ asset('css/map/estilo.css') }}" type="text/css" rel="stylesheet">

	<!-- FILESAVER -->
	<script src="{{ asset('js/map/file_saver/src/FileSaver.js') }}"></script> 

 	<title>{{ env('APP_NAME'); }}</title>
 </head>
 <body>

 	<div id='map'></div>

	<div class="calculation-box">
		<p>Desenhe um polígono</p>
		<span id="calculated-area">0 ha</span> | 
		<span id="calculated-distance">0 Km</span> | 
		<span id="calculated-time">0 s</span>
	</div>

	<div class="logo-box">
		<img src="{{ asset('images/map/embrapa.png') }}" alt="Embrapa Instrumentação"/>
		<img src="{{ asset('images/map/bv.png') }}" alt="BirdView"/>
	</div>

	<div class="mapboxgl-ctrl-group mapboxgl-ctrl side-menu">
		<button class="mapbox-gl-draw_ctrl-draw-btn marker" id="marker" style="background-image: url('img/mapmarker.png');"></button>
		<button type="button" class="mapbox-gl-draw_ctrl-draw-btn" id="question-mark" data-bs-toggle="modal" data-bs-target="#myModal">?</button>
	</div>

	<!-- Modal de Ajuda -->
	<div class="modal fade" id="myModal" role="dialog">
		<div class="modal-dialog">

		<!-- Modal content-->
		<div class="modal-content">
		<div class="modal-header">
			<h4 class="modal-title">Central de Ajuda</h4>	
		</div>
		<div class="help-options">
			<button class="btn btn-secondary" id="video">Missão</button>
				<button class="btn btn-light" id="novo">Novo</button>
				<button class="btn btn-light" id="abrir">Abrir</button>
				<button class="btn btn-light" id="salvar">Salvar</button>
				<button class="btn btn-light" id="importar">Importar</button>
				<button class="btn btn-light" id="configurar">Configuração</button>
			</div>
		<div class="modal-body" id="modal-body">
			<p>Assista ao vídeo demonstrativo da ferramenta:</p>
				<iframe width="496" height="280" src="https://www.youtube.com/embed/DWsPhE_rRSk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
		</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-dark" data-bs-dismiss="modal">Fechar</button>
			</div>
		</div>
		
	</div>
	</div>

	<div class="modal-config" id="modal">

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
			<input type="checkbox" name="wp-grid" id="wp-grid" checked="checked" />
			<label for="wp-grid" id="label-grid" class="form-label">WP Grid</label>
		</div>

		<div class="mb-2">	
			<label for="altitude" id="label-altitude" class="form-label">Altitude: 10m</label>
			<input type="range" min="10" max="50" value="10" name="altitude" id="altitude"/>
		</div>

		<div class="mb-2">	
			<label for="speed" id="label-speed" class="form-label">Velocidade: 8m/s</label>
			<input type="range" min="1" max="15" value="8" name="speed" id="speed"/>
		</div>
		
		<div>	
			<label for="distance" id="label-distance" class="form-label">Distância: 50m</label>
			<input type="range" min="1" max="100" value="50" name="distance" id="distance"/>
		</div>

	</form>
	</div>	

	<nav id="menu-options" style="display: none">
	<ul class="menu-options">
		<li id="btn-clean">Novo</li>
		<li>
			<label>Abrir
				<input type="file" id="file-input" hidden/>
			</label>	
		</li>
		<li id="btn-save">Salvar</li>
		<li>
			<label>Importar Ponto
				<input type="file" id="file-import" hidden/>
			</label>
		</li>
		<li>
			<label>Importar Poly
				<input type="file" id="file-import-poly" hidden/>
			</label>
		</li>
	</ul>
	</nav>

	<button id="btn-mission" class="btn btn-success">Missão</button>

	<button id="btn" class="btn btn-primary">Configuração</button>
	
	<script src="{{ asset('js/map/lib.js') }}"></script>
	<script> 
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    </script>
 </body>
 </html>