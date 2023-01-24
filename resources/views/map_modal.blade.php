<!DOCTYPE html>
 <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
 <head>
 	<meta charset="UTF-8">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel='shortcut icon' type='image/x-icon' href="{{ asset('images/map/favicon/favicon.ico') }}">
 	<link rel="android-chrome" sizes="192x192" href="{{ asset('images/map/favicon/android-chrome-192x192.png') }}">
 	<link rel="android-chrome" sizes="512x512" href="{{ asset('images/map/favicon/android-chrome-512x512.png') }}">
 	<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/map/favicon/apple-touch-icon.png') }}">
	<link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/map/favicon/favicon-32x32.png') }}">
	<link rel="icon" type="image/png" sizes="16x16" href="{{ asset('images/map/favicon/favicon-16x16.png') }}">
	<link rel="manifest" href="/site.webmanifest">

	<!--- STYLES --->
	<link href="{{ asset('css/map/styles.css') }}" type="text/css" rel="stylesheet">

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

	<!-- HTML2CANVAS -->
	<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js"></script>

    <!-- FILESAVER -->
	<script src="{{ asset('js/map/libs/file_saver/src/FileSaver.js') }}"></script>

 	<title>{{ env('APP_NAME'); }}</title>
 </head>
 <body>

    <div id="map"></div>

	<button id="print-button" class = "btn btn-success">PRINT</button>

	<script>
        // Token gerado para uso no MAPBOX-GL
        mapboxgl.accessToken = 'pk.eyJ1IjoidGF1YWNhYnJlaXJhIiwiYSI6ImNrcHgxcG9jeTFneWgydnM0cjE3OHQ2MDIifQ.saPpiLcsBQnqVlRrQrcCIQ';

        // === POSIÇÃO INICIAL NO MAPA === //
        home = [-47.926063, -15.841060];

        var coordinatesLongLat;
        var initialPosition = [];
        //var longestEdgeLongLat;
        var farthestVertexLongLat;
        var selectedPosition;

        var finalDestination = [];
        var initialFinalPath = [];
        var initialPath = [];

        // Criando um objeto mapa
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-v9',
            zoom: 15,
            center: home, // Longitude e latitude
            preserveDrawingBuffer: true
        });

        var mapBoxNavigationControl = new mapboxgl.NavigationControl();
        // Adicionando controles de zoom e rotação no mapa
        map.addControl(mapBoxNavigationControl);

        // ========== DESENHANDO POLÍGONO ============= //

        // Criando um objeto para desenho do polígono
        // Apenas duas opções de controle estão habilitadas: polígono e lixeira
        var draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            },
            defaultMode: 'draw_polygon'
        });

        map.addControl(draw); // Adicionando o controle de desenho ao mapa

        // =============== EVENTOS ==================== //

        // Evento vindo de um iframe do mapa
        window.addEventListener("message", (event) => {

			if(event.data.type === 'modal-request'){

				let contents = event.data.log.contents;
				const regex = new RegExp(".tlog.kmz");

				if (regex.test(event.data.log.original_name)) {
					importKMLPath(contents);
				} else {
					importKMLPolygon(contents);
				}

				document.getElementById("print-button").addEventListener("click", () => {
					print(event);
				});

			}

        }, false);

		function print(event){

			html2canvas(document.body).then(canvas => {
                
				var blobImg = new Blob([canvas], { type: "image/jpeg" });
				var dataURL = canvas.toDataURL('image/jpeg', 1.0);

				fileNameImg = event.data.log.original_name.replace(/(.tlog.kmz|.kml)$/, "") + ".jpeg";
				
				/*
				canvas.toBlob(function(blobImg) {
					saveAs(blobImg, fileNameImg);
				});
				*/
				
				const response = {
					type: 'iframe-response',
					data: {
						blobImg, fileNameImg, dataURL
					}
				}

				event.source.postMessage(response, event.origin);

			});  
		}

        // ========================= //

        function importKMLPath(contents) {

            // Localizando as tags <coordinates> dentro do arquivo
            var coordinates = contents.substring(
                contents.search("<coordinates>") + 13,
                contents.search("</coordinates>")
            );

            // Quebrando todas as coordenadas do polígono
            coordinates = coordinates.split("\n");

            // Array que irá armazenar as coordenadas da área
            kmlArea = [];

            //console.log(coordinates)

            // Percorrendo todas as coordenadas e quebrando as informações de lat e long
            for (i = 0; i < coordinates.length - 1; i++) {
                //console.log(coordinates[i]);

                latLong = coordinates[i].split(",");
                kmlArea[i] = [Number(latLong[0]), Number(latLong[1])];

                //console.log(kmlArea[i])
            }

            // Certificando-se de que a primeira e a última posição de kmlArea são idênticas
            if (kmlArea[0][0] == kmlArea[kmlArea.length - 1][0] && kmlArea[0][1] == kmlArea[kmlArea.length - 1][1]) {
                //console.log("São IGUAIS!");
            } else {
                //console.log("NÃO SÃO IGUAIS!");
                kmlArea[i] = kmlArea[0];
            }

            // console.log(kmlArea[0]);
            // console.log(kmlArea[kmlArea.length - 1]);

            home = kmlArea[0];

            // Acessando o centroide da área para posicionar no mapa
            var polygon = turf.polygon([kmlArea]);
            var centroid = turf.coordAll(turf.centroid(polygon));

            // Direcionando o mapa
            map.flyTo({
                center: [
                    centroid[0][0], centroid[0][1]
                ],
                essential: true
            });

            // Desenhando o polígono no mapa e calculando o tamanho da área importada
            drawTxtArea(kmlArea);

            // Desenhando a rota e calculando sua distância
            drawTxtPath(kmlArea); 

        }

        // === OPÇÃO DE "ABRIR" UM ARQUIVO .KML E CARREGAR UM POLÍGONO NO MAPA === //
        function importKMLPolygon(contents) {

            // Localizando as tags <coordinates> dentro do arquivo
            var coordinates = contents.substring(
                contents.search("<coordinates>") + 13,
                contents.search("</coordinates>")
            );

            // Quebrando todas as coordenadas do polígono
            coordinates = coordinates.split(" ");

            // Array que irá armazenar as coordenadas da área
            kmlArea = [];

            // Percorrendo todas as coordenadas e quebrando as informações de lat e long
            for (i = 0; i < coordinates.length - 1; i++) {
                //console.log(coordinates[i]);

                latLong = coordinates[i].split(",");
                kmlArea[i] = [Number(latLong[0]), Number(latLong[1])];
            }

            // Certificando-se de que a primeira e a última posição de kmlArea são idênticas
            if (kmlArea[0][0] == kmlArea[kmlArea.length - 1][0] && kmlArea[0][1] == kmlArea[kmlArea.length - 1][1]) {
                console.log("São IGUAIS!");
            } else {
                //console.log("NÃO SÃO IGUAIS!");
                kmlArea[i] = kmlArea[0];
            }

            home = kmlArea[0];

            // Acessando o centroide da área para posicionar no mapa
            var polygon = turf.polygon([kmlArea]);
            var centroid = turf.coordAll(turf.centroid(polygon));

            // Direcionando o mapa
            map.flyTo({
                center: [
                    centroid[0][0], centroid[0][1]
                ],
                essential: true
            });

            // Desenhando o polígono no mapa e calculando o tamanho da área importada
            drawTxtArea(kmlArea);

        }

        // == NEEED - DESENHANDO O POLÍGONO DA ÁREA == //
        function drawTxtArea(txtArea) {

            var objArea = {
                'type': 'Polygon',
                'coordinates': [
                    txtArea
                ]
            }
            draw.add(objArea);
        }

        // == NEEED - DESENHANDO A ROTA IMPORTADA A PARTIR DO ARQUIVO == // 
        function drawTxtPath(txtPath) {

            // Limpando todos os layers
            cleanLayers();

            // Novos sources e layers são adicionados apenas se ainda não existem no mapa
            var objBF = {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'MultiLineString',
                        'coordinates': [
                            txtPath
                        ]
                    }
                }
            }

            map.on('load', function(){
                map.addSource('txtPath', objBF);

                map.addLayer({
                    'id': 'txtPath',
                    'type': 'line',
                    'source': 'txtPath',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#fcba03',
                        'line-width': 3
                    }
                });
            })
            
        }

        // === NEEED - LIMPANDO AS ROTAS DESENHADAS NO MAPA === //
        function cleanLayers() {

            var layers = ['routePhase01', 'routePhase02', 'routePhase03', 'routePoints01', 'bfPhase02', 'txtPath', 'intermediatePoints', 'wp01', 'wp02', 'wp03', 'bp01'];

            // Limpando todos os layers contidos no mapa
            for (i = 0; i < layers.length; i++) {
                var mapLayer = map.getLayer(layers[i]);

                if (typeof mapLayer !== 'undefined') {
                    map.removeLayer(layers[i]).removeSource(layers[i]);
                }
            }
        }

        function cleanLayerById(id) {
            var mapLayer = map.getLayer(id);

            if (typeof mapLayer !== 'undefined') {
                map.removeLayer(id).removeSource(id);
            }
        }

        function cleanPolygon() {
            // Limpando o polígono
            draw.deleteAll();
        }
    </script>
 </body>
 </html>