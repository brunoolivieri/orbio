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
	 <div id="side-menu" class="mapboxgl-ctrl-group mapboxgl-ctrl side-menu show-marker">
		<button class="mapbox-gl-draw_ctrl-draw-btn marker" id="marker">
			<img class="text-center m-auto" src="https://cdn-icons-png.flaticon.com/512/447/447031.png" width="20px" height="20px" >
		</button>
	</div>

	<!-- ALERT -->
	<div id="menu-alert" class="flex text-white text-sm font-bold px-4 py-3 w-screen fixed left-0" role="alert">
		<p id="menu-message">Mensagem do alerta!</p>
	</div>

	<!-- BOTTOM BAR -->
	<div id="bottom-bar" class="flex backdrop-blur-xl bg-white/30 h-18 w-screen fixed left-0 bottom-0 z-[100]">

		<!-- LEFT BAR - BUTTONS -->
		<div class="flex grow h-full">

			<!-- BTN NEW MAP -->
			<div class="p-5" id="btn-clean">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
					class="h-6 w-6 cursor-pointer text-white" id="btn-clean-icon" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
				</svg>
			</div>
			<!-- BTN UPLOAD -->
			<div id="btn-upload" class="relative p-5" aria-expanded="true" aria-haspopup="true">

				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
					class="h-6 w-6 cursor-pointer text-white" id="btn-upload-icon" stroke="currentColor"
					class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
				</svg>

				<div id="menu-upload"
					class="absolute bottom-0 left-0 mb-16 z-99 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
					role="menu">
					<div class="py-1" role="none">
						<label
							class="text-gray-700 block px-4 py-2 text-sm text-center hover:bg-gray-100 cursor-pointer"
							role="menuitem" tabindex="-1" id="menu-item-0">
							<input type="file" id="file-input" hidden>
							Abrir
						</label>
						<label
							class="text-gray-700 block px-4 py-2 text-sm text-center hover:bg-gray-100 cursor-pointer"
							role="menuitem" tabindex="-1" id="menu-item-0">
							<input type="file" id="file-import" hidden>
							Importar Ponto
						</label>
						<label
							class="text-gray-700 block px-4 py-2 text-sm text-center hover:bg-gray-100 cursor-pointer"
							role="menuitem" tabindex="-1" id="menu-item-1">
							<input type="file" id="file-import-poly" hidden>
							Importar Poly
						</label>
						<label
							class="text-gray-700 block px-4 py-2 text-sm text-center hover:bg-gray-100 cursor-pointer"
							role="menuitem" tabindex="-1" id="menu-item-2">
							<input type="file" id="file-import-path" hidden>
							Importar Rota
						</label>
						<label
							class="text-gray-700 block px-4 py-2 text-sm text-center hover:bg-gray-100 cursor-pointer"
							role="menuitem" tabindex="-1" id="menu-item-2">
							<input type="file" id="file-import-mp" hidden>
							Importar MP
						</label>
					</div>
				</div>
			</div>

			<!-- BTN STORE -->
			<div id="btn-save" class="relative p-5" aria-expanded="true" aria-haspopup="true">

				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
					id="btn-save-icon" class="h-6 w-6 cursor-pointer text-white" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
				</svg>

				<div id="menu-save"
					class="absolute bottom-0 left-0 mb-16 z-99 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
					role="menu" aria-orientation="vertical">
					<ul class="py-1" role="none">
						<li id="btn-full-save"
							class="text-gray-700 block px-4 py-2 text-sm text-center hover:bg-gray-100 cursor-pointer"
							role="menuitem" tabindex="-1" id="menu-item-0">
							Salvar rota única
						</li>
						<li id="btn-multi-save"
							class="text-gray-700 block px-4 py-2 text-sm text-center hover:bg-gray-100 cursor-pointer"
							role="menuitem" tabindex="-1" id="menu-item-1">
							Salvar rota multi
						</li>
						<li id="btn-save-csv"
							class="text-gray-700 block px-4 py-2 text-sm text-center hover:bg-gray-100 cursor-pointer"
							role="menuitem" tabindex="-1" id="menu-item-2">
							Salvar como CSV
						</li>
					</ul>
				</div>
			</div>

			<!-- BTN EXIT-->
			<div id="btn-exit" class="m-5" onclick="window.close()">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
					id="btn-exit-icon" stroke="currentColor" class="h-6 w-6 cursor-pointer text-white">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
				</svg>
			</div>
		</div>

		<!-- MIDDLE BAR - CALCULATION BOX -->
		<div class="grow h-full flex justify-center">
			<div class="p-5 calculation-box">
				<span id="calculated-area" class="text-white">0 ha</span> |
				<span id="calculated-distance" class="text-white">0 Km</span> |
				<span id="calculated-time" class="text-white">0 s</span>
			</div>
		</div>

		<!-- RIGHT BAR - BUTTON -->
		<div class="flex justify-end grow h-full">

			<!-- HELP BUTTON AND MENU -->
			<div id="btn-configuration" class="relative p-5" aria-expanded="true" aria-haspopup="true">
				<svg id="btn-help-icon" class="h-6 w-6 cursor-pointer text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
				  </svg>				  
			</div>

			<!-- CONFIGURATION BUTTON AND MENU -->
			<div id="btn-configuration" class="relative p-5" aria-expanded="true" aria-haspopup="true">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="btn-configuration-icon"
					class="h-6 w-6 cursor-pointer text-white" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>

				<div id="menu-configuration"
					class="absolute bottom-0 right-0 mb-16 z-99 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
					role="menu">
					<form class="px-2" name="config">

						<div class="py-4">
							<select id="locations"
								class="w-full mt-2 border text-gray-700 text-sm rounded-lg p-2.5 focus:outline-none focus:shadow-outline hover:border-gray-300 cursor-pointer"
								onchange="console.log(this.value)">
								<option selected disabled>Selecione uma plantação</option>
								<option value="1">#01</option>
								<option value="2">#02</option>
								<option value="3">#03</option>
							</select>
						</div>

						<div class="w-full mb-1">
							<div class="px-2 py-2">
								<input type="checkbox" name="wp-grid" id="wp-grid"
									class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded accent-blue-500 cursor-pointer">
								<label for="wp-grid" id="label-grid" class="text-gray-900">WP Grid</label>
							</div>
							<div class="px-2 py-2">
								<input type="checkbox" name="opt" id="opt"
									class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded accent-blue-500 cursor-pointer">
								<input type="hidden" name="extra-distance" id="extra-distance" value="0">
								<label for="opt" id="label-opt" class="text-gray-900">Otimizar</label>
							</div>
						</div>

						<div class="w-full">
							<div class="block px-2 py-4 text-sm text-left cursor-pointer">
								<label for="max-flight-time" id="label-max-flight-time"
									class="block mb-2 text-sm font-medium text-gray-900">Tempo:
									15min</label>
								<input type="range" min="5" max="20" value="15" name="max-flight-time"
									id="max-flight-time"
									class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500" />
							</div>
							<div class="block px-2 py-4 text-sm text-left cursor-pointer">
								<label for="altitude" id="label-altitude"
									class="block mb-2 text-sm font-medium text-gray-900">Altitude: 10m</label>
								<input id="altitude" name="altitude" type="range" min="10" max="50" value="10"
									class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500">
							</div>
							<div class="block px-2 py-4 text-sm text-left cursor-pointer">
								<label for="speed" id="label-speed"
									class="block mb-2 text-sm font-medium text-gray-900">Velocidade: 8m/s</label>
								<input id="speed" name="speed" type="range" min="1" max="15" value="8"
									class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500">
							</div>
							<div class="block px-2 py-4 text-sm text-left cursor-pointer">
								<label for="distance" id="label-distance"
									class="block mb-2 text-sm font-medium text-gray-900">Distância:
									50m</label>
								<input id="distance" name="distance" type="range" min="1" max="100" value="50"
									class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500">
							</div>
						</div>

					</form>
				</div>
			</div>
		</div>
	</div>

	<!-- VERIFY BEFORE SAVE -->
	<div id="flight-plan-confirmation-modal" class="relative z-10 transition-all hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

		<!-- Main modal -->
		<div tabindex="-1" aria-hidden="true"
			class="flex justify-center items-center fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full">
			<div class="relative w-full lg:w-1/2 h-full md:h-auto">
				<!-- Modal content -->
				<div class="relative rounded-lg shadow bg-white">
					<!-- Modal header -->
					<div class="flex items-start justify-between p-4 rounded-t border-gray-100 border-b">
						<h3 class="text-xl font-semibold text-gray-900">
							Confirmação dos dados
						</h3>
					</div>
					<!-- Modal body -->
					<div class="px-6 py-3">
						<div class="grid grid-rows-auto gap-y-5">
							<!-- files list container -->
							<div class="form-row">
								<p class="text-sm font-medium text-gray-900">Arquivos txt</p>
								<div id="files-list" class="w-full bg-white mt-2">
									<!-- list dynamically generated 
										<div>
											<div class="grid grid-cols-2 hover:bg-gray-50 p-2 border">
												<p class="text-gray-600">
													X
												</p>
												<p>
													0X_timestamp.txt
												</p>
											</div>
										</div>
									-->
								</div>
							</div>
							<!-- image -->
							<div class="form-row">
								<label for="name" class="block text-sm font-medium leading-6 text-gray-900">Imagem da
									rota</label>
								<div class="grid grid-cols-[min-content_1fr] mt-2">
									<div
										class="flex mr-2 hover:bg-gray-100 ring-1 ring-inset ring-gray-300 rounded cursor-pointer select-none items-center px-5 text-gray-500">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
											stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round"
												d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
										</svg>
									</div>
									<input type="text" name="flight-image" id="flight-image" disabled
										class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400"
										placeholder="">
								</div>
							</div>
						</div>
					</div>
					<!-- Modal footer -->
					<div
						class="flex justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dborder-gray-100 border-b">
						<button type="button" id="btn-close-confirmation-modal"
							class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#1976d2] hover:bg-sky-100 sm:ml-3 sm:w-auto">Cancelar</button>
						<button type="submit" id="btn-save-confirmation-modal"
							class="inline-flex w-full justify-center items-center rounded-md bg-[#1976d2] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1e88e5] sm:ml-3 sm:w-auto">
							<svg id="spin-icon" aria-hidden="true" class="inline w-4 h-4 mr-2 hidden text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
							</svg>
							Salvar
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<script src="{{ asset('js/map/index.js') }}"></script>
 </body>
 </html>