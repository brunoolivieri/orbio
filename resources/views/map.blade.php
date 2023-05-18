<!DOCTYPE html>
 <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
 <head>
 	<meta charset="UTF-8">
 	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel='shortcut icon' type='image/x-icon' href="{{ asset('images/map/favicon/favicon.ico') }}">
 	<link rel="android-chrome" sizes="192x192" href="{{ asset('images/map/favicon/android-chrome-192x192.png') }}">
 	<link rel="android-chrome" sizes="512x512" href="{{ asset('images/map/favicon/android-chrome-512x512.png') }}">
 	<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/map/favicon/apple-touch-icon.png') }}">
	<link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/map/favicon/favicon-32x32.png') }}">
	<link rel="icon" type="image/png" sizes="16x16" href="{{ asset('images/map/favicon/favicon-16x16.png') }}">
	<link rel="manifest" href="/site.webmanifest">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css" rel="stylesheet" />

	<!--- STYLES --->
	<link href="{{ asset('css/map/index.css') }}" type="text/css" rel="stylesheet">
	<link href="{{ asset('css/tailwind/index.css') }}" type="text/css" rel="stylesheet">
	<!-- MAPBOX-GL --> 
	<script src="{{ asset('js/map/libs/mapbox/mapbox-gl.js') }}"></script>
	<link href="{{ asset('css/map/mapbox-gl.css') }}" type="text/css" rel='stylesheet' />
	<!-- TURF E MAPBOX-GL-DRAW -->
	<script src="{{ asset('js/map/libs/mapbox/turf.min.js') }}"></script>
	<script src="{{ asset('js/map/libs/mapbox/mapbox-gl-draw.js') }}"></script>
	<link href="{{ asset('css/map/mapbox-gl-draw.css') }}" type="text/css" rel="stylesheet">
	<!-- MAPBOX-GL-GEOCODER -->
	<script src="{{ asset('js/map/libs/mapbox/mapbox-gl-geocoder.min.js') }}"></script>
	<link href="{{ asset('css/map/mapbox-gl-geocoder.css') }}" type="text/css" rel="stylesheet">
	<!-- Promise polyfill script required to use Mapbox GL Geocoder in IE 11 -->
	<script src="{{ asset('js/map/libs/mapbox/es6-promise.min.js') }}"></script>
	<script src="{{ asset('js/map/libs/mapbox/es6-promise.auto.min.js') }}"></script>
	<!-- AXIOS -->
	<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
	<!-- FILESAVER -->
	<script src="{{ asset('js/map/libs/file_saver/src/FileSaver.js') }}"></script>
	<!-- HTML2CANVAS -->
	<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js"></script>

 	<title>{{ env('APP_NAME'); }}</title>
 </head>
 <body>

 	<div id='map'></div>

	<!-- MARKER MENU -->
	 <div id="right-menu" class="mapboxgl-ctrl-group mapboxgl-ctrl right-menu show-marker">
		<button class="mapbox-gl-draw_ctrl-draw-btn marker" id="marker">
			<img class="text-center m-auto" src="https://cdn-icons-png.flaticon.com/512/447/447031.png" width="20px" height="20px" >
		</button>
	</div>

	<!-- SIDENAV -->
	<aside id="left-menu" class="w-24 h-screen fixed top-0 left-0 bg-white z-[100]">

		<!--- BTN NEW + TOOLTIP --->
		<div id="btn-clean-tooltip" class="absolute z-10 invisible inline-block px-2 py-1 text-sm font-medium text-stone-800 transition-opacity duration-300 bg-white rounded-lg shadow-sm opacity-0 tooltip">
			Novo plano
			<div class="tooltip-arrow" data-popper-arrow></div>
		</div>
		<div id="btn-clean" class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100" data-tooltip-placement="right" data-tooltip-target="btn-clean-tooltip">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
				class="h-6 w-6 text-stone-800" id="btn-clean-icon" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round"
					d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
			</svg>
		</div>
		<!--- BTN UPLOAD + TOOLTIP + MENU --->
		<div id="btn-upload-tooltip" class="absolute z-10 invisible inline-block px-2 py-1 text-sm font-medium text-stone-800 transition-opacity duration-300 bg-white rounded-lg shadow-sm opacity-0 tooltip">
			Abrir
			<div class="tooltip-arrow" data-popper-arrow></div>
		</div>
		<div id="btn-upload" class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100" data-tooltip-placement="right" data-tooltip-target="btn-upload-tooltip">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
				class="h-6 w-6 text-stone-800" id="btn-upload-icon" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round"
					d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
			</svg>
		</div>
		<div id="menu-upload" class="w-full h-[320px] bg-gray-100 hidden">
			<label
				class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100"
				role="menuitem" tabindex="-1" id="menu-item-0">
				<input type="file" id="file-import-txt" hidden>
				Txt
			</label>
			<label
				class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100"
				role="menuitem" tabindex="-1" id="menu-item-1">
				<input type="file" id="file-import-kml" hidden>
				Ponto
			</label>
			<label
				class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100"
				role="menuitem" tabindex="-1" id="menu-item-2">
				<input type="file" id="file-import-poly" hidden>
				Poly
			</label>
			<label
				class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100"
				role="menuitem" tabindex="-1" id="menu-item-3">
				<input type="file" id="file-import-path" hidden>
				Rota
			</label>
			<label
				class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100"
				role="menuitem" tabindex="-1" id="menu-item-4">
				<input type="file" id="file-import-mp" hidden>
				MP
			</label>
		</div>
		<!--- BTN SAVE + MENU --->
		<div id="btn-save-tooltip" class="absolute z-10 invisible inline-block px-2 py-1 text-sm font-medium text-stone-800 transition-opacity duration-300 bg-white rounded-lg shadow-sm opacity-0 tooltip">
			Salvar
			<div class="tooltip-arrow" data-popper-arrow></div>
		</div>
		<div id="btn-save" class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100" data-tooltip-placement="right" data-tooltip-target="btn-save-tooltip">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
				id="btn-save-icon" class="h-6 w-6 text-stone-700" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round"
				d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
			</svg>
		</div>
		<div id="menu-save" class="w-full h-48 bg-gray-100 hidden">
			<div id="btn-full-save" class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100">
				Única
			</div>
			<div id="btn-multi-save" class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100">
				Multi
			</div>
			<div id="btn-save-csv" class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100">
				CSV
			</div>
		</div>
		<!--- BTN CONFIGURATION + MODAL --->
		<div id="btn-configuration-tooltip" class="absolute z-10 invisible inline-block px-2 py-1 text-sm font-medium text-stone-800 transition-opacity duration-300 bg-white rounded-lg shadow-sm opacity-0 tooltip">
			Configurações
			<div class="tooltip-arrow" data-popper-arrow></div>
		</div>
		<div id="btn-configuration" class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100" data-tooltip-placement="right" data-tooltip-target="btn-configuration-tooltip">
			<svg id="btn-configuration-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
				class="h-6 w-6 text-stone-800" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
		</div>
		<!--- BTN HELP --->
		<div id="btn-help-tooltip" class="absolute z-10 invisible inline-block px-2 py-1 text-sm font-medium text-stone-800 transition-opacity duration-300 bg-white rounded-lg shadow-sm opacity-0 tooltip">
			Ajuda
			<div class="tooltip-arrow" data-popper-arrow></div>
		</div>
		<div class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100" id="btn-help" data-tooltip-placement="right" data-tooltip-target="btn-help-tooltip">
			<svg id="btn-help-icon" class="h-6 w-6 text-stone-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
			  </svg>
		</div>
		<!-- BTN EXIT -->
		<div id="btn-exit-tooltip" class="absolute z-10 invisible inline-block px-2 py-1 text-sm font-medium text-stone-800 transition-opacity duration-300 bg-white rounded-lg shadow-sm opacity-0 tooltip">
			Sair
			<div class="tooltip-arrow" data-popper-arrow></div>
		</div>
		<div id="btn-exit" class="w-full h-16 p-5 flex justify-center cursor-pointer hover:bg-gray-100" onclick="window.close()" data-tooltip-placement="right" data-tooltip-target="btn-exit-tooltip">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
			class="h-6 w-6 cursor-pointer text-stone-800" id="btn-exit-icon" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round"
					d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
			</svg>
		</div>
	</aside>	

	<!-- TOP BAR -->
	<div id="top-bar" class="w-screen h-[55px] fixed top-1 flex justify-center">
		<!-- TOP ALERT -->
		<div id="alert" class="flex items-center rounded text-white font-bold px-4 py-3" role="alert">
			<p id="alert-message"><!-- Message --></p>
		</div>
	</div>

	<!-- BOTTOM BAR -->
	<div id="bottom-bar" class="w-screen fixed left-0 bottom-0 z-[100] flex justify-center h-18">
		<!-- MIDDLE BAR - CALCULATION BOX -->
		<div class="w-auto h-full flex justify-center rounded-t-sm bg-white">
			<div class="p-5 calculation-box">
				<span id="calculated-area" class="text-stone-800 font-medium">0 ha</span> -
				<span id="calculated-distance" class="text-stone-800 font-medium">0 Km</span> -
				<span id="calculated-time" class="text-stone-800 font-medium">0 s</span>
			</div>
		</div>
		</div>
	</div>

	<!-- COMPONENTS -->
	<x-map.modals.configuration />
	<x-map.modals.confirmation />
	<x-map.modals.instructions />
	
	<script src="{{ asset('js/map/index.js') }}"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js"></script>
 </body>
 </html>