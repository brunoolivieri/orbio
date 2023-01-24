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

// ==== EVENTOS ==== //

// Evento vindo de um iframe do mapa
window.addEventListener("message", (event) => {

    event.source.postMessage("Resposta", event.origin);

    let contents = event.data.contents;

    var regex = new RegExp(".tlog.kmz");

    if (regex.test(event.data.original_name)) {
        importKMLPath(contents);
    } else {
        importKMLPolygon(contents);
    }

    console.log(document.body);

    /*
    html2canvas(document.body).then(canvas => {
       
        var blobImg = new Blob([canvas], { type: "image/jpeg" });
        var dataURL = canvas.toDataURL('image/jpeg', 1.0);

        filenameImg = event.data.original_name.replace("/\.tlog\.kmz|\.kml/", "") + ".jpeg";

        event.source.postMessage({ blobImg, filenameImg, dataURL }, event.origin);

    });  
    */


}, false);

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

    // Percorrendo todas as coordenadas e quebrando as informações de lat e long
    for (i = 0; i < coordinates.length - 1; i++) {
        //console.log(coordinates[i]);

        latLong = coordinates[i].split(",");
        kmlArea[i] = [Number(latLong[0]), Number(latLong[1])];
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