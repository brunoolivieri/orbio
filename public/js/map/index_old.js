// Token gerado para uso no MAPBOX-GL
mapboxgl.accessToken = 'pk.eyJ1IjoidGF1YWNhYnJlaXJhIiwiYSI6ImNrcHgxcG9jeTFneWgydnM0cjE3OHQ2MDIifQ.saPpiLcsBQnqVlRrQrcCIQ';

// === POSIÇÃO INICIAL NO MAPA === //
home = [-47.926063, -15.841060];

var coordinatesLongLat;
var initialPosition = [];
var longestEdgeLongLat;
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


// Adicionando um marcador no ponto KML importados
marcador = new mapboxgl.Marker({ color: 'black' })
	.setLngLat(home)
	.addTo(map);

// ========= ATT ORBIO: FERRAMENTA DE BUSCA POR LOCALIDADES =========== //

// Adicionando o controle de busca ao mapa.
var mapBoxGeocoder = new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	mapboxgl: mapboxgl
});
map.addControl(mapBoxGeocoder);

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

map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);

// Pode-se selecionar a posição inicial da rota ao clicar em um dos vértices da área
map.on('click', selectInitialPosition);
map.on('touchstart', selectInitialPosition);

// == FUNÇÃO QUE ATUALIZA A METRAGEM DA ÁREA APÓS O DESENHO DO POLÍGONO == //
function updateArea(e) {

	data = draw.getAll();
	coordinatesLongLat = data.features[0].geometry.coordinates[0];

	longestEdgeLongLat = longestEdge(coordinatesLongLat);
	farthestVertexLongLat = farthestVertex(coordinatesLongLat, longestEdgeLongLat);

	var answer = document.getElementById('calculated-area');

	if (data.features.length > 0) {
		area = turf.area(data);

		// Área em hectares
		var rounded_area = (Math.round(area * 100) / 100) / 10000;
		answer.innerHTML = rounded_area.toFixed(2) + ' ha';
	} else {
		answer.innerHTML = '';
		if (e.type !== 'draw.delete')
			alert('Use as ferramentas para desenhar um polígono!');
	}
}

// == VERIFICA A MAIOR ARESTA DO POLÍGONO == //
// == A MAIOR ARESTA DEFINE O SENTIDO DA ORIENTAÇÃO DO MOVIMENTO VAI-E-VOLTA == //
var longestEdge = function (area_coordinates) {

	var longestEdge = [];
	var largerDistance = 0;

	for (let i = 0; i < (area_coordinates.length - 1); i++) {

		let initialPoint = area_coordinates[i];
		let finalPoint = area_coordinates[i + 1];

		let distance = turf.distance(initialPoint, finalPoint);

		if (distance > largerDistance) {
			largerDistance = distance;
			longestEdge = [initialPoint, finalPoint];
		}
	}

	return longestEdge;
}

var farthestVertex = function (area_coordinates, longestEdge) {

	var maxDistance = 0;
	var farthestVertex = [];

	for (let i = 0; i < (area_coordinates.length - 1); i++) {

		// Calculando a distância entre a maior aresta e o vértice mais distante
		let distance = turf.pointToLineDistance(area_coordinates[i], [longestEdge[0], longestEdge[1]]);

		// Armazenando a distância e o vértice mais distante
		if (distance > maxDistance) {
			maxDistance = distance;
			farthestVertex = area_coordinates[i];
		}
	}

	return farthestVertex;
}

// == SELECIONANDO O PONTO DE PARTIDA DA ROTA (VÉRTICE INICIAL) == //
function selectInitialPosition() {

	selectedPosition = draw.getSelectedPoints();

	// Ao clicar no mapa, deve-se selecionar as coordenadas do ponto desenhado no mapa
	if (turf.coordAll(selectedPosition).length !== 0) {

		// Atualizando a posição inicial (home location)
		homePosition = turf.coordAll(selectedPosition);
		home = homePosition[0];

		// Criando um polígono reduzido para gerar a rota mais distante das extremidades
		// A variável selectedPosition é atualizada para um dos vértices do polígono reduzido
		selectedPosition = drawReducedPolygon(draw.getAll(), selectedPosition);

		//Invocando a função de desenho do BBox
		drawBBox(selectedPosition);
	}
}

// == REDUZINDO POLÍGONO PARA QUE A ROTA ESTEJA DENTRO DA ÁREA == //
function drawReducedPolygon(areaPolygon, selectedPosition) {

	// Acessando centroide do polígono (área)	
	var centroid = turf.centroid(areaPolygon);

	// Array que conterá as novas coordenadas do polígono reduzido
	reducedPolygon = [];
	flag = false;

	// Percorrendo todos os vértices do polígono
	for (i = 0; i < turf.coordAll(areaPolygon).length; i++) {

		// Criando dois pontos: n-ésimo vértice e centroid 
		var point1 = turf.point(turf.coordAll(areaPolygon)[i]);
		var point2 = turf.point(turf.coordAll(centroid)[0]);

		// Calculando o ângulo entre os dois pontos
		var bearing = turf.bearing(point1, point2);

		// Distância de deslocamento dos vértices 
		inputDistance = document.getElementById("distance").value;
		distanceBetweenLines = (inputDistance == '') ? 0.05 : inputDistance / 1000;

		// O fator de escala é a distância que o novo ponto deve ser deslocado
		var scaleFactor = distanceBetweenLines / 2;

		// Novo ponto gerado a partir do deslocamento do vértice
		var destination = turf.rhumbDestination(point1, scaleFactor, bearing);

		// Array contendo todas as coordenadas do polígono reduzido
		reducedPolygon[i] = turf.coordAll(destination)[0];

		// Atualizando a posição (vértice) selecionada pelo usuário
		// Será um dos vértices do polígono reduzido
		if (turf.coordAll(areaPolygon)[i][0] == turf.coordAll(selectedPosition)[0][0] &&
			turf.coordAll(areaPolygon)[i][1] == turf.coordAll(selectedPosition)[0][1] && !flag) {

			selectedPosition = turf.point(reducedPolygon[i]);
			flag = true;
		}
	}

	return selectedPosition;
}

// == CRIANDO E DESENHANDO O BBOX == //
function drawBBox(selectedPosition) {

	//console.log("Ponto de partida da rota: " + turf.coordAll(selectedPosition));	

	// Desenhando um box no entorno do polígono
	//bbox = turf.bbox(draw.getAll());
	bbox = turf.bbox(turf.polygon([reducedPolygon]));

	// Convertendo o box em polígono (retangular)
	rectangle = turf.bboxPolygon(bbox);

	// Aumentando o tamanho do retângulo em 200%
	rectangle = turf.transformScale(rectangle, 2);

	// Criando um objeto GeoJSON para desenhar o retângulo no mapa
	/*var objRectangle = {
		'type': 'geojson',
		'data': rectangle
	}*/

	// Invocando função das linhas paralelas
	drawParallelLines(rectangle, selectedPosition);
}

// == DESENHANDO AS LINHAS PARALELAS == //
function drawParallelLines(rectangle, selectedPosition) {

	// Acessando apenas o array de coordenadas do retângulo
	rectangleCoords = turf.getCoords(rectangle);

	// Definindo a distância padrão entre as linhas pararelas
	//distanceBetweenLines = 0.05; // 50m
	inputDistance = document.getElementById("distance").value;
	distanceBetweenLines = (inputDistance == '') ? 0.05 : inputDistance / 1000;

	// Criando 4 pontos que delimitam o retângulo
	p1 = rectangleCoords[0][0];
	p2 = rectangleCoords[0][1];
	p3 = rectangleCoords[0][2];
	p4 = rectangleCoords[0][3];

	// Medindo as distâncias de longitude e latitude
	distanceLong = turf.distance(p1, p4);
	distanceLat = turf.distance(p1, p2);

	// Este é vertice mais distante em relação à maior aresta do polígono
	pt = farthestVertexLongLat;

	// Recalculando a maior aresta usando o polígono reduzido
	longestEdgeLongLat = longestEdge(reducedPolygon);

	// Calculando o ângulo da maior aresta
	angle = turf.bearing(longestEdgeLongLat[0], longestEdgeLongLat[1]);

	// As linhas paralelas serão definidas no sentido da maior distância
	if (distanceLong > distanceLat) {
		// Mas o número de linhas é definido pela menor distância dividido pela distância entre linhas
		numberOfLines = Math.round(distanceLat / distanceBetweenLines);

		// Criando as duas linhas externas no sentido da longitude (eixo x)
		lineFeatureA = turf.lineString([p1, p4]);
		lineFeatureB = turf.lineString([p2, p3]);

	} else {
		// Mas o número de linhas é definido pela menor distância dividido pela distância entre linhas
		numberOfLines = Math.round(distanceLong / distanceBetweenLines);

		// Criando as duas linhas externas no sentido da latitude (eixo y)
		lineFeatureA = turf.lineString([p1, p2]);
		lineFeatureB = turf.lineString([p3, p4]);

		angle = angle + 90;
	}

	// Medindo a distância de cada linha em relação ao vértice mais distante
	distanceA = turf.pointToLineDistance(pt, lineFeatureA);
	distanceB = turf.pointToLineDistance(pt, lineFeatureB);

	// A linha de referência será sempre a linha mais distante do vértice
	lineFeature = (distanceA > distanceB) ? lineFeatureA : lineFeatureB;

	// Array que armazenará todas as linhas paralelas
	paralelPath = [];

	// Medindo a distância entre o vértice mais distante e a linha de referência
	totalDistance = turf.pointToLineDistance(pt, lineFeature);

	// Gera-se uma linha pararela à linha de referência para verificar 
	// se a distância até o vértice mais distante aumenta ou diminui
	firstParalelLine = turf.lineOffset(lineFeature, distanceBetweenLines);
	distance = turf.pointToLineDistance(pt, firstParalelLine);

	// Se a distância aumenta, então distanceBetweenLines deve ser negativo
	if (distance > totalDistance) {
		distanceBetweenLines = -distanceBetweenLines;
	}

	// Criando as linhas paralelas em relação à linha de referência
	for (i = 1; i <= numberOfLines; i++) {
		offsetLine = turf.lineOffset(lineFeature, distanceBetweenLines * i);

		// Apenas as coordenadas de cada linha são armazenadas no array
		paralelPath[i - 1] = turf.getCoords(offsetLine);
	}

	// Criando um Objeto GeoJSON para 
	// desenhar as linhas paralelas da segunda fase da rota
	var objPhase02 = {
		'type': 'Feature',
		'properties': {},
		'geometry': {
			'type': 'MultiLineString',
			'coordinates': paralelPath
		}
	}

	// Rotacionando as linhas paralelas de acordo com o ângulo da maior aresta
	rotatedLines = turf.transformRotate(objPhase02, angle);

	// Começa o desenho das intersecções
	drawIntersections(numberOfLines, rotatedLines, selectedPosition);
}

// == CRIANDO LINHAS PARALELAS VÍSIVEIS QUE INTERSECCIONAM O POLÍGONO == //
function drawIntersections(numberOfLines, rotatedLines, selectedPosition) {

	// Acessando o array de coordenadas do polígono
	//edges = turf.getCoords(draw.getAll().features[0]);
	edges = reducedPolygon;
	index = 0;

	// Identificando o índice da maior aresta
	for (i = 0; i < edges.length - 1; i++) {
		if (longestEdgeLongLat[0][0] == edges[i][0] && longestEdgeLongLat[0][1] == edges[i][1]) {
			index = i;
		}
	}

	// Reordenando os vértices do polígono para evitar problemas na ordem das intersecções
	orderedEdges = [];
	for (i = 0; i < edges.length; i++) {
		orderedEdges[i] = edges[index];
		index = (index == edges.length - 2) ? 0 : index + 1;
	}

	// Array que armazenará todas os pontos de intersecção 
	// entre as linhas paralelas (lines) e as arestas do polígono (orderedEdges)
	intersectionPoints = [];
	index = 0;

	// Acessando o array de coordenadas das linhas paralelas
	lines = turf.getCoords(rotatedLines);

	// Percorrendo todas as linhas paralelas
	for (i = 0; i < numberOfLines; i++) {
		// Acessando cada linha paralela individualmente
		line1 = turf.lineString(lines[i]);

		// Percorrendo todas as arestas do polígono
		for (j = 0; j < orderedEdges.length - 1; j++) {
			// Acessando cada aresta do polígono individualmente
			line2 = turf.lineString([orderedEdges[j], orderedEdges[j + 1]]);

			// Detectando a interseção entre as duas linhas
			intersects = turf.lineIntersect(line1, line2);

			// Se a intersecção ocorreu, ou seja, o array contém as coordenadas de um ponto
			if (intersects.features.length !== 0) {
				// O ponto de intersecção é armazenado no array de intersecções
				intersectionPoints[index] = turf.getCoords(intersects.features[0]);
				index++;
			}
		}
	}

	// Limpando a rota importada do arquivo antes de começar a desenhar a nova rota
	cleanLayerById('txtPath');

	// Criando um objeto GeoJSON para desenhar os pontos de intersecção
	// da segunda fase da rota (movimento de vai-e-volta)
	var objIntersectionPoints = {
		'type': 'geojson',
		'data': {
			'type': 'Feature',
			'properties': {},
			'geometry': {
				'type': 'MultiPoint',
				'coordinates':
					[intersectionPoints[0]]
			}
		}
	}

	// Se já existe um layer e um source com este ID, eles são removidos
	cleanLayerById('routePhase02');

	// Novos sources e layers são adicionados apenas se ainda não existem no mapa
	map.addSource('routePhase02', objIntersectionPoints);

	// Adicionando círculos verdes que indicam os pontos de intersecção
	map.addLayer({
		'id': 'routePhase02',
		'type': 'circle',
		'source': 'routePhase02',
		'paint': {
			'circle-color': '#0f0'
		}
	});

	// Começa a definição das fases de rotas
	defineRoutes(selectedPosition);
}

// == PROGRAMAÇÃO DA DEFINIÇÃO DAS FASES DA ROTA - FASES 1,2,3 == //
function defineRoutes(selectedPosition) {

	// Posição inicial do voo selecionado pelo usuário clicando em um dos vértices
	initialPosition = turf.coordAll(selectedPosition);

	// Percorrendo todos os pontos de intersecção que formam o movimento de vai-e-volta
	index = 0;
	destination = [];

	//distanceStripes = 0.05;
	inputDistance = document.getElementById("distance").value;
	distanceStripes = (inputDistance == '') ? 0.05 : inputDistance / 1000;
	finalDestination = intersectionPoints;

	for (i = 0; i < intersectionPoints.length - 1; i += 2) {

		// São geradas duas linhas iguais com os sentidos dos pontos invertidos
		// O recuo é aplicado nos dois lados das linhas
		lineA = turf.lineString([intersectionPoints[i], intersectionPoints[i + 1]]);
		destination[index] = turf.getCoord(turf.along(lineA, distanceStripes));
		index++;

		lineB = turf.lineString([intersectionPoints[i + 1], intersectionPoints[i]]);
		destination[index] = turf.getCoord(turf.along(lineB, distanceStripes));
		index++;
	}

	// ====== COMO IDENTIFICAR QUAL PARTE DEVE SER AFASTADA? ====== //
	// Medindo a distância dos pontos recuados em relação à linha central
	if (destination.length / 2 % 2 != 0) {
		distanceA = turf.distance(destination[destination.length / 2 - 1], initialPosition[0]);
		distanceB = turf.distance(destination[destination.length / 2], initialPosition[0]);
		end = 1;
	} else {
		distanceA = turf.distance(destination[destination.length / 2], initialPosition[0]);
		distanceB = turf.distance(destination[destination.length / 2 - 1], initialPosition[0]);
		end = 0;
	}

	// Definindo qual lado das linhas será utilizado como recuo
	start = (distanceA < distanceB) ? 2 : 1;

	// Substituindo os pontos da rota que são intersecções por pontos que foram recuados
	// em relação ao trecho das fases 01 e 03
	for (i = start; i < intersectionPoints.length - end; i += 2) {
		if (i != finalDestination.length - 2) {
			finalDestination[i] = destination[i];
		} else if (start == 2 && end == 1 && i == finalDestination.length - 2) {
			finalDestination[i] = destination[i];
		}
	}

	// Criando as conexões entre os pontos de intersecção para gerar a rota de vai-e-volta
	for (i = 2; i < finalDestination.length; i += 4) {
		aux = finalDestination[i];
		finalDestination[i] = finalDestination[i + 1];
		finalDestination[i + 1] = aux;
	}

	// Verificando qual é índice do ponto inicial
	for (i = 0; i < edges.length - 1; i++) {
		if (edges[i][0] == initialPosition[0][0] && edges[i][1] == initialPosition[0][1]) {
			initialIndex = i;
		}
	}

	// Primeiro ponto do array de coordenadas que definem o movimento de vai-e-volta
	firstPoint = turf.point(finalDestination[0]);

	// Último ponto do array de coordenadas que definem o movimento de vai-e-volta
	lastPoint = turf.point(finalDestination[finalDestination.length - 1]);

	// Armazenará os trechos de rota das fases 01 e 03
	initialFinalPath = [];

	// 0: FASE 01 - DO INÍCIO DO VAI-E-VOLTA ATÉ A POSIÇÃO DE PARTIDA (SERÁ INVERTIDO DEPOIS)
	// 1: FASE 03 - DO FINAL DO VAI-E-VOLTA ATÉ A POSIÇÃO PARTIDA

	for (i = 0; i < 2; i++) {

		var geometry = {
			"type": "Polygon",
			"coordinates": [reducedPolygon]
		};

		// Transformando todos os vértices da área em uma coleção de pontos
		//polygonEdges 	= turf.explode(draw.getAll());
		polygonEdges = turf.explode(geometry);

		// Usando a mesma variável para identificar o ponto mais próximo
		point = (i == 0) ? firstPoint : lastPoint;

		// Verificando qual é o vértice da área mais próximo do ponto inicial/final do movimento de vai-e-volta
		nearest = turf.nearestPoint(point, polygonEdges);

		// Verificando qual é índice deste vértice
		nearestIndex = nearest.properties.featureIndex;

		// Encontrando a menor rota entre entre os dois caminhos possíveis (sentido horário e anti-horário) 
		// A rota começa no vértice mais próximo do ponto inicial/final do vai-e-volta
		// e vai até o ponto de partida selecionado pelo usuário
		ni = nearestIndex;
		ii = initialIndex;

		pathA = [];
		pathA[0] = turf.getCoords(point);
		j = 1;
		do {
			index = (ni % (edges.length - 1));
			pathA[j] = edges[index];
			j++;
			ni++;

		} while (index !== ii);

		ni = nearestIndex;
		pathB = [];
		pathB[0] = turf.getCoords(point);
		j = 1;
		do {
			index = (ni % (edges.length - 1));
			pathB[j] = edges[index];
			j++;
			ni = (ni == 0) ? edges.length - 2 : ni - 1;

			if (ii == ni) pathB[j] = edges[ni];

		} while (ii !== ni);

		// Medindo as distâncias entre os dois caminhos: sentido horário e anti-horário
		lengthA = turf.length(turf.lineString(pathA));
		lengthB = turf.length(turf.lineString(pathB));

		// Definindo a rota inicial/final com o menor caminho
		initialFinalPath[i] = (lengthA < lengthB) ? pathA : pathB;

		// A verificação só é necessária quando houver mais de 2 pontos
		if (initialFinalPath[i].length > 2) {

			// Verificando se a posição inicial/final do movimento de vai-e-volta 
			// está entre o vértice mais próximo e o ponto de partida
			nearestLine = turf.lineString([initialFinalPath[i][1], initialFinalPath[i][2]]);
			bfPosition = turf.point(initialFinalPath[i][0]);

			// Se estiver, o vértice mais próximo é eliminado da rota para evitar a passagem pelo mesmo ponto 2x
			if (turf.pointToLineDistance(bfPosition, nearestLine, { method: 'planar' }).toFixed(5) == 0.00000) {
				initialFinalPath[i].splice(1, 1);
			}
		}

		// A rota inicial da fase 01 deve ser invertida, pois ela foi gerada 
		// do movimento de vai-e-volta para o ponto de partida
		if (i == 0) {
			initialPath = [];
			index = 0;
			for (j = initialFinalPath[i].length - 1; j >= 0; j--) {
				initialPath[index] = initialFinalPath[i][j];
				index++;
			}
		}
	}

	// Invocação da função para desenho do movimento de vai-e-volta
	startDrawRoute(finalDestination, destination, initialFinalPath);
}

// == FUNÇÃO PARA INÍCIO D0 DESENHO DO MOVIMENTO DE VAI-E-VOLTA == //
function startDrawRoute(finalDestination, destination, initialFinalPath) {

	cleanLayerById('bfPhase02');

	// Novos sources e layers são adicionados apenas se ainda não existem no mapa
	var objBF = {
		'type': 'geojson',
		'data': {
			'type': 'Feature',
			'properties': {},
			'geometry': {
				'type': 'MultiLineString',
				'coordinates': [
					finalDestination
				]
			}
		}
	}

	map.addSource('bfPhase02', objBF);

	map.addLayer({
		'id': 'bfPhase02',
		'type': 'line',
		'source': 'bfPhase02',
		'layout': {
			'line-join': 'round',
			'line-cap': 'round'
		},
		'paint': {
			'line-color': '#fcba03',
			'line-width': 3
		}
	});

	// Invocação da função para desenho dos novos pontos de vai-e-volta
	drawNewRoutePoints(destination, initialFinalPath, finalDestination);

}

// == DESENHO DOS NOVOS PONTOS DO VAI-E-VOLTA == //
function drawNewRoutePoints(destination, initialFinalPath, finalDestination) {

	// Se já existe um layer e um source com este ID, eles são removidos
	cleanLayerById('routePoints01');

	var mapLayer = map.getLayer('routePoints01');

	if (typeof mapLayer !== 'undefined') {
		map.removeLayer('routePoints01').removeSource('routePoints01');
	}

	var objPoints01 = {
		'type': 'geojson',
		'data': {
			'type': 'MultiPoint',
			'coordinates':
				destination
		}
	}

	// Invocação da função para desenho da rota inicial
	drawInititalRoute(initialFinalPath, destination, finalDestination);

}

// == DESENHO DA ROTA INICIAL == //
function drawInititalRoute(initialFinalPath, destination, finalDestination) {

	// Se já existe um layer e um source com este ID, eles são removidos
	cleanLayerById('routePhase01');

	var mapLayer = map.getLayer('routePhase01');

	if (typeof mapLayer !== 'undefined') {
		map.removeLayer('routePhase01').removeSource('routePhase01');
	}

	// Criando um Objeto GeoJSON para desenhar a rota inicial
	var objPhase01 = {
		'type': 'geojson',
		'data': {
			'type': 'Feature',
			'properties': {},
			'geometry': {
				'type': 'MultiLineString',
				'coordinates': [
					initialFinalPath[0]
				]
			}
		}
	}

	// Novos sources e layers são adicionados apenas se ainda não existem no mapa
	map.addSource('routePhase01', objPhase01);

	map.addLayer({
		'id': 'routePhase01',
		'type': 'line',
		'source': 'routePhase01',
		'layout': {
			'line-join': 'round',
			'line-cap': 'round'
		},
		'paint': {
			'line-color': '#0971CE',
			'line-width': 3
		}
	});

	// Invocação da função para desenho da rota final
	drawFinalRoute(initialFinalPath, finalDestination);

}

// == DESENHO DA ROTA FINAL == //
function drawFinalRoute(initialFinalPath, finalDestination) {

	// Se já existe um layer e um source com este ID, eles são removidos
	cleanLayerById('routePhase03');

	var mapLayer = map.getLayer('routePhase03');

	if (typeof mapLayer !== 'undefined') {
		map.removeLayer('routePhase03').removeSource('routePhase03');
	}

	// Criando um Objeto GeoJSON para desenhar a rota final
	var objPhase03 = {
		'type': 'geojson',
		'data': {
			'type': 'Feature',
			'properties': {},
			'geometry': {
				'type': 'MultiLineString',
				'coordinates': [
					initialFinalPath[1]
				]
			}
		}
	}

	// Novos sources e layers são adicionados apenas se ainda não existem no mapa
	map.addSource('routePhase03', objPhase03);

	map.addLayer({
		'id': 'routePhase03',
		'type': 'line',
		'source': 'routePhase03',
		'layout': {
			'line-join': 'round',
			'line-cap': 'round'
		},
		'paint': {
			'line-color': '#06783A',
			'line-width': 3
		}
	});

	// Invocação da função para medir a distância total da rota
	routeTotalDistance(initialFinalPath, finalDestination);
}

// == MEDINDO A DISTÂNCIA TOTAL DA ROTA == //
function routeTotalDistance(initialFinalPath, finalDestination) {

	// Se a opção de WP Grid estiver habilitada, 
	// são gerados waypoints intermediários em todos os trechos da rota
	if (document.getElementById("wp-grid").checked) {
		// Gerando os waypoints intermediários de cada linha paralela
		createIntermediateWaypoints(initialPath, finalDestination, initialFinalPath);
	} else {
		cleanLayerById('intermediatePoints');
	}

	// Distância percorrida na fase 01 da rota
	totalDistance = 0;
	partialDistance = 0;

	for (j = 0; j < initialPath.length - 1; j++) {
		if (j != initialPath.length - 1) {
			totalDistance += turf.distance(turf.point([initialPath[j][0], initialPath[j][1]]), turf.point([initialPath[j + 1][0], initialPath[j + 1][1]]));
			partialDistance += turf.distance(turf.point([initialPath[j][0], initialPath[j][1]]), turf.point([initialPath[j + 1][0], initialPath[j + 1][1]]));
		}
	}

	// Se a rota ultrapassar o limite de tempo de voo estiupulado,
	// ela deve ser quebrada em vários voos. Para isso, são armazenados
	// breakpoints em que a rota é interrompida e retorna para a base
	breakpoints = [];
	// Distância percorrida na fase 02 da rota
	for (j = 0; j < window.finalDestination.length - 1; j++) {
		if (j != window.finalDestination.length - 1) {
			partialDistance += turf.distance(turf.point([window.finalDestination[j][0], window.finalDestination[j][1]]), turf.point([window.finalDestination[j + 1][0], window.finalDestination[j + 1][1]]));

			// Verificando o tempo de voo baseado na distância parcial atual percorrida
			calculateFlightTime(partialDistance);
			//console.log(time);

			// Acessando o limite máximo de tempo definido pelo usuário
			maxFlightTime = Number.parseInt(document.getElementById('max-flight-time').value) * 60;

			// Se 'time' computado pela função calculateFLightTime exceder o limite máximo,
			// cria-se um breakpoint para retornar para a base		
			if (time >= maxFlightTime) {
				partialDistance = 0;
				breakpoints.push([window.finalDestination[j][0], window.finalDestination[j][1]]);
			}

			// Distância total percorrida
			totalDistance += turf.distance(turf.point([window.finalDestination[j][0], window.finalDestination[j][1]]), turf.point([window.finalDestination[j + 1][0], window.finalDestination[j + 1][1]]));
			calculateFlightTime(totalDistance);
		}
	}

	//console.log(breakpoints);

	// Distância percorrida na fase 03 da rota
	for (j = 0; j < initialFinalPath[1].length - 1; j++) {
		if (j != initialFinalPath[1].length - 1) {
			totalDistance += turf.distance(turf.point([initialFinalPath[1][j][0], initialFinalPath[1][j][1]]), turf.point([initialFinalPath[1][j + 1][0], initialFinalPath[1][j + 1][1]]));
		}
	}

	var distanceBox = document.getElementById("calculated-distance");
	distanceBox.innerHTML = totalDistance.toFixed(2) + " Km";

	calculateFlightTime(totalDistance);
	drawAllWaypoints();
	drawBreakpoints(breakpoints);
}

function drawBreakpoints(breakpoints) {

	var objBp01 = {
		'type': 'geojson',
		'data': {
			'type': 'MultiPoint',
			'coordinates':
				breakpoints
		}
	}

	// Se já existe um layer e um source com este ID, eles são removidos
	cleanLayerById('bp01');

	// Novos sources e layers são adicionados apenas se ainda não existem no mapa
	map.addSource('bp01', objBp01);

	map.addLayer({
		'id': 'bp01',
		'type': 'circle',
		'source': 'bp01',
		'paint': {
			'circle-color': '#F00'
		}
	});
}

function createIntermediateWaypoints(initialPath, finalDestination, initialFinalPath) {

	allIntermediateWp = [];
	index = 0;

	for (k = 0; k < 3; k++) {
		temp = [];

		if (k == 0) {
			temp = initialPath;
			window.initialPath = [];
			step = 1;
			end = 1;
		} else if (k == 1) {
			temp = finalDestination;
			window.finalDestination = [];
			step = 2;
			end = 0;
		} else {
			temp = initialFinalPath[1];
			window.initialFinalPath[1] = [];
			step = 1;
			end = 1;
		}

		for (j = 0; j < temp.length - end; j = j + step) {

			lineDistance = turf.distance(temp[j], temp[j + 1]);
			line = turf.lineString([temp[j], temp[j + 1]]);

			distanceBetweenWp = (distanceBetweenLines < 0) ? -distanceBetweenLines : distanceBetweenLines;
			numberOfWp = Math.round(lineDistance / distanceBetweenWp);

			intermediateWp = [];

			for (i = 0; i <= numberOfWp; i++) {
				intermediateWp[i] = turf.getCoord(turf.along(line, distanceBetweenWp * i));

				allIntermediateWp[index] = turf.getCoord(turf.along(line, distanceBetweenWp * i));
				index++;
			}

			if (k == 0) {

				for (l = 0; l < intermediateWp.length - 1; l++) {
					window.initialPath[window.initialPath.length] = intermediateWp[l];
				}

			} else if (k == 1) {

				for (l = 0; l < intermediateWp.length; l++) {
					window.finalDestination[window.finalDestination.length] = intermediateWp[l];
				}
				if (window.finalDestination[window.finalDestination.length - 1][0] != temp[j + 1][0] && window.finalDestination[window.finalDestination.length - 1][1] != temp[j + 1][1])
					window.finalDestination[window.finalDestination.length] = temp[j + 1];

			} else {

				for (l = 0; l < intermediateWp.length - 1; l++) {
					window.initialFinalPath[1][window.initialFinalPath[1].length] = intermediateWp[l];
				}

			}

		}
	}
}

function drawAllWaypoints() {

	//console.log(window.initialPath.length);
	var objWp01 = {
		'type': 'geojson',
		'data': {
			'type': 'MultiPoint',
			'coordinates':
				window.initialPath
		}
	}

	// Se já existe um layer e um source com este ID, eles são removidos
	cleanLayerById('wp01');

	// Novos sources e layers são adicionados apenas se ainda não existem no mapa
	map.addSource('wp01', objWp01);

	map.addLayer({
		'id': 'wp01',
		'type': 'circle',
		'source': 'wp01',
		'paint': {
			'circle-color': '#0971CE'
		}
	});

	//console.log(window.finalDestination.length);
	var objWp02 = {
		'type': 'geojson',
		'data': {
			'type': 'MultiPoint',
			'coordinates':
				window.finalDestination
		}
	}

	// Se já existe um layer e um source com este ID, eles são removidos
	cleanLayerById('wp02');

	// Novos sources e layers são adicionados apenas se ainda não existem no mapa
	map.addSource('wp02', objWp02);

	map.addLayer({
		'id': 'wp02',
		'type': 'circle',
		'source': 'wp02',
		'paint': {
			'circle-color': '#fcba03'
		}
	});

	//console.log(window.initialFinalPath[1].length);
	var objWp03 = {
		'type': 'geojson',
		'data': {
			'type': 'MultiPoint',
			'coordinates':
				window.initialFinalPath[1]
		}
	}

	// Se já existe um layer e um source com este ID, eles são removidos
	cleanLayerById('wp03');

	// Novos sources e layers são adicionados apenas se ainda não existem no mapa
	map.addSource('wp03', objWp03);

	map.addLayer({
		'id': 'wp03',
		'type': 'circle',
		'source': 'wp03',
		'paint': {
			'circle-color': '#06783A'
		}
	});

}

// == ATUALIZANDO INFORMAÇÕES A PARTIR DAS ALTERAÇÕES DE CONFIGURAÇÃO == //

// Distância
var configDistance = document.getElementById("distance");
var labelDistance = document.getElementById("label-distance");
var wpGrid = document.getElementById('wp-grid');

wpGrid.onchange = function () {
	cleanLayers();
	selectInitialPosition();
}

configDistance.onchange = function () {
	selectInitialPosition();
	labelDistance.innerHTML = "Distância: " + configDistance.value + "m";
}

// Velocidade
var configSpeed = document.getElementById("speed");
var labelSpeed = document.getElementById("label-speed");

configSpeed.onchange = function () {
	if (typeof totalDistance !== 'undefined') calculateFlightTime(totalDistance);
	labelSpeed.innerHTML = "Velocidade: " + configSpeed.value + "m/s";
}

// Altitude
var configAltitude = document.getElementById("altitude");
var labelAltitude = document.getElementById("label-altitude");

configAltitude.onchange = function () {
	labelAltitude.innerHTML = "Altitude: " + configAltitude.value + "m";
}

// Tempo de voo
var configTempo = document.getElementById("max-flight-time");
var labelTempo = document.getElementById("label-max-flight-time");

configTempo.onchange = function () {
	selectInitialPosition();
	labelTempo.innerHTML = "Tempo: " + configTempo.value + "min";
}

// Otimização da Rota (ampliar/reduzir distância entre linhas)
var opt = document.getElementById("opt");

opt.onchange = function () {
	// Pegando a distância da primeira linha paralela próxima à extremidade da área
	// e dividindo entre todas as demais linhas para recalcular a distância entre linhas
	recomputeDistanceBetweenLines();
}

function recomputeDistanceBetweenLines() {

	var numberOfTests = 10;
	var firstLinePhase02 = turf.lineString([finalDestination[0], finalDestination[1]]);
	/*var lastLinePhase02 = turf.lineString([
								finalDestination[2],
								finalDestination[3]
						  ]);*/

	// Computando o ângulo da primeira linha pararela da fase 02
	var point1 = turf.point(finalDestination[1]);
	var point2 = turf.point(finalDestination[0]);
	var firstLineAngle = turf.round(turf.bearing(point1, point2));

	// Computando os ângulos das linhas que formam a rota inicial na fase 01
	for (i = 0; i < initialPath.length - 1; i++) {
		var point3 = turf.point(initialPath[i]);
		var point4 = turf.point(initialPath[i + 1]);
		var initialPathAngle = turf.round(turf.bearing(point3, point4));

		// Se os ângulos forem iguais, as linhas são paralelas
		if (initialPathAngle == firstLineAngle) {
			// Distância mínima percorrida pela rota
			var minimumDistance = totalDistance;
			// Parâmetro de distância entre linhas ótimo que minimiza a distância total percorrida
			var optimalDBL = document.getElementById('distance').value;

			for (var j = 0; j < numberOfTests; j++) {
				currentDistance = Number.parseInt(document.getElementById('distance').value);
				//console.log(totalDistance);
				//console.log(document.getElementById('distance').value);
				document.getElementById('distance').value = currentDistance + 1;
				document.getElementById('distance').onchange();
				//console.log(document.getElementById('distance').value); 
				//console.log(totalDistance);
				if (totalDistance < minimumDistance) {
					minimumDistance = totalDistance;
					optimalDBL = document.getElementById('distance').value;
				}
			}
			document.getElementById('distance').value = optimalDBL;
			document.getElementById('distance').onchange();
		}
	}
}

// ========= ATT ORBIO: ACESSANDO O MENU DE OPÇÕES DA MISSÃO: NOVO, ABRIR, SALVAR, IMPORTAR ========= //

// Acessando o botão de menu
var btnMenu = document.getElementById("btn-mission");

// Acessando o menu lateral do marcador
// var markerSideMenu = document.getElementById('side_menu');

// Acessando box de logos
var boxLogos = document.getElementById("logo-box");

// Acessando a caixa dos cálculos de área
var calculationBox = document.getElementById("calculation-box");

// Acessando o elemento <nav> com o menu de opções
var menuOptions = document.getElementById("menu-options");

// ====================================================================== //

// Quando o usuário clica no botão, abre-se o modal
btnMenu.onclick = function () {
	menuOptions.style.display = (menuOptions.style.display == "block") ? "none" : "block";
}

// ==== MENU: NOVO ==== //
var btnClean = document.getElementById("btn-clean");
btnClean.addEventListener("click", cleanLayers);
btnClean.addEventListener("click", cleanFields);
btnClean.addEventListener("click", cleanPolygon);

// ==== MENU: ABRIR ==== //
// A função de leitura do arquivo é chamada sempre que o input file é modificado
//document.getElementById('file-input').addEventListener('change', openTxtFile, false);
document.getElementById('file-input').addEventListener('change', getTextAndSaveCSV, false);

// ==== ATT ORBIO - ABRIR PLANO POR QUERY STRING ==== //

window.onload = () => {

	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	});

	if (!params.file) {
		return '';
	}

	axios.get(`${window.location.origin}/api/plans-module-download/${params.file}`)
		.then((response) => {
			openTxtFileFromStorage(response.data, 'storage');
		})
		.catch((error) => {
			console.log(error.response);
		})
}

// ==== ATT ORBIO - MENU: SALVAR ==== //

// Botão para cancelar a criação do plano no modal
var btnCancelCreation = document.getElementById("btn-cancel-creation");
btnCancelCreation.addEventListener("click", () => {

	displayElementsAfterPrintScreen();
	confirmationModal.style.display = "none";
});

// Alerta
var alertMessage = document.getElementsByClassName("alert-message")[0];

// Esta opção permite salvar vários arquivos de waypoints para múltiplos voos
// Acessando botão que dispara a função para criar um arquivo .txt
var btnSave = document.getElementById("btn-save");
// Atrelando a função ao evento onclick do botão
btnSave.addEventListener("click", savePath);

// ==== MENU: SALVAR ROTA ÚNICA ==== //
// Salva a rota completa em um único arquivo, mesmo que a rota possua
// vários breakpoints com múltiplos voos. É necessário ter esta opção para
// 'abrir' a rota novamente.

// Acessando botão que dispara a função para criar um arquivo .txt
var btnFullSave = document.getElementById("btn-full-save");
// Atrelando a função ao evento onclick do botão

// ==== ATT ORBIO ==== //
btnFullSave.addEventListener("click", flightPlanImageConfirmation);
// Modal confirmar salvamento 
var confirmationModal = document.getElementById("confirmation-modal");

// Botão para confirmar a criação do plano no modal
var btnConfirmCreation = document.getElementById("btn-confirm-creation");
btnConfirmCreation.addEventListener("click", saveFullPath);

// ==== MENU: SALVAR ROTA CSV ==== //
// Salva as coordenadas de latitude, longitude e altitude em um arquivo no formato .csv.

// Acessando botão que dispara a função para criar um arquivo .csv
var btnSaveCSV = document.getElementById("btn-save-csv");
// Atrelando a função ao evento onclick do botão
btnSaveCSV.addEventListener("click", savePathCSV);

// ==== MENU: IMPORTAR PONTO KML ==== //
var btnImport = document.getElementById("file-import");
btnImport.addEventListener('change', importKMLPoint, false);

// ==== MENU: IMPORTAR POLÍGONO KML ==== //
var btnImportPoly = document.getElementById("file-import-poly");
btnImportPoly.addEventListener('change', importKMLPolygon, false);

// ==== MENU: IMPORTAR RORA KML ==== //
var btnImportPath = document.getElementById("file-import-path");
btnImportPath.addEventListener('change', importKMLPath, false);

// ==== MENU: IMPORTAR POLÍGONO Mission Planner ==== //
var btnImportMP = document.getElementById("file-import-mp");
btnImportMP.addEventListener('change', importMPPolygon, false);

// ==== MENU: CONFIGURAÇÂO  ==== //
// Acessando o elemento "modal"
var modal = document.getElementById("modal");

// Acessando o botão que aciona o modal
var btn = document.getElementById("btn");

// Quando o usuário clica no botão, abre-se o modal
btn.onclick = function () {
	modal.style.display = (modal.style.display == "block") ? "none" : "block";
}

// Acessando o botão do marcador
var btnMarker = document.getElementById('marker');

btnMarker.onclick = function () {

	if (this.style.backgroundImage == 'url("img/mapmarker.png")') {
		this.style.backgroundImage = 'url("img/mapmarkeroff.png")';
		marcador.remove();

	} else {
		this.style.backgroundImage = 'url("img/mapmarker.png")';

		// Adicionando um marcador no ponto KML importados
		marcador = new mapboxgl.Marker({ color: 'black' })
			.setLngLat(home)
			.addTo(map);
	}
}

// ========= TIRAR UM PRINTSCREEN PARA USAR NO RELATÓRIO ======= //
function savePrintScreen() {

	html2canvas(document.body).then(canvas => {
		//document.body.appendChild(canvas);
		var blobImg = new Blob([canvas], { type: "image/png" });

		// Nome do arquivo com data em milissegundos decorridos
		fileNameImg = new Date().getTime() + ".png";

		canvas.toBlob(function (blobImg) {
			saveAs(blobImg, fileNameImg);
		});
	});

}

// ========= SALVANDO A ROTA GERADA EM ARQUIVO .CSV ========= //
function savePathCSV() {

	// Validação: encerra a função se o botão de 'salvar' for clicado sem nenhuma rota definida
	if (typeof initialPath === 'undefined') { return false; }

	// Definição da altitude de voo a partir da entrada do usuário no modal
	// Se a altitude não for preenchida, define-se um valor padrão
	inputAltitude = document.getElementById("altitude").value;
	var altitude = (inputAltitude == '') ? 10 : inputAltitude;

	// ==== CONTEÚDO DO ARQUIVO DE ROTA ==== //
	var content = "latitude;longitude;altitude(m)\n";

	// Quando o usuário carrega um arquivo TXT de rota do PC e tentar salvá-lo em CSV, 
	// as informações da rota não estão armazenadas em variáveis como 'inicialFinalPath', 
	// mas na variável txtPath	
	if (initialFinalPath.length === 0) {
		for (i = 0; i < txtPath.length; i++) {
			content += txtPath[i][1] + ";" + txtPath[i][0] + ";" + altitude + "\n";
		}

	} else {
		// WAYPOINT: 16 - ROTA INICIAL DA FASE 01
		index = 0;
		for (j = 3; j < (initialPath.length * 2) + 2; j += 2) {
			content += initialPath[index][1].toFixed(6) + ";" + initialPath[index][0].toFixed(6) + ";" + altitude + "\n";
			index++;
		}

		// WAYPOINT: 16 - ROTA DE VAI-E-VOLTA DA FASE 02
		index = 0;
		for (i = j; i < (finalDestination.length) + j - 1; i++) {
			content += finalDestination[index][1].toFixed(6) + ";" + finalDestination[index][0].toFixed(6) + ";" + altitude + "\n";
			index++;
		}

		// WAYPOINT: 16 - ROTA FINAL DA FASE 03
		index = 0;
		for (j = i; j < (initialFinalPath[1].length) + i; j++) {
			content += initialFinalPath[1][index][1].toFixed(6) + ";" + initialFinalPath[1][index][0].toFixed(6) + ";" + altitude + "\n";
			index++;
		}
	}

	var blob = new Blob([content],
		{ type: "text/plain;charset=utf-8" });

	// Nome do arquivo com data em milissegundos decorridos
	fileName = new Date().getTime() + ".csv";
	saveAs(blob, fileName);
}

function getTextAndSaveCSV(e) {

	var file = e.target.files[0];
	var extension = e.target.files[0].name.split('.').pop().toLowerCase();
	if (!file || extension !== 'txt') { return; }

	var reader = new FileReader();

	// ==== CONTEÚDO DO ARQUIVO DE ROTA ==== //
	content = "latitude;longitude;altitude(m)\n";

	reader.onload = function (e) {
		// Conteúdo completo do arquivo
		var contents = e.target.result;

		// Quebrando as linhas do arquivo em um array
		var lines = contents.split("\n");

		//console.log(lines.length);
		// Quebrando todas as linhas nos espaços \t
		for (i = 4; i < lines.length - 2; i++) {
			line = lines[i].split("\t");
			// Somente os waypoints com latitude e longitude são considerados, ou seja, código 16
			// Os waypoints de código 183 (gatilho do dispenser) tem lat/long zerados e não podem ser
			// adicionados ao desenho da rota
			if (Number(line[3]) == 16) {
				// As posições de latitude, longitude e altitude estão nos índices 8, 9 e 10 de cada linha
				content += line[8] + ";" + line[9] + ";" + line[10] + "\n";
			}
		}
		//console.log(content);
		var blob = new Blob([content],
			{ type: "text/plain;charset=utf-8" });

		// Nome do arquivo com data em milissegundos decorridos
		fileName = new Date().getTime() + ".csv";
		saveAs(blob, fileName);
	};
	reader.readAsText(file);
}

// ==== ATT ORBIO ==== //
function flightPlanImageConfirmation() {

	removeElementsForPrintScreen();

	html2canvas(document.body).then(canvas => {

		var blobImg = new Blob([canvas], { type: "image/jpeg" });
		var dataURL = canvas.toDataURL('image/jpeg', 1.0);

		filenameImg = new Date().getTime() + ".jpeg";

		return { blobImg, filenameImg, dataURL, canvas };

	}).then(({ blobImg, filenameImg, dataURL, canvas }) => {

		const timestamp = new Date().getTime();
		const filename = timestamp + ".txt";

		confirmationModal.style.display = "flex";
		document.getElementsByClassName("flight_plan_name")[0].value = filename;

		// Set canvas into confirmation modal
		canvas.toBlob(function (blobImg) {
			var image = document.createElement("img");
			const blobUrl = URL.createObjectURL(blobImg)
			image.setAttribute("src", blobUrl);
			image.setAttribute("id", "image");
			image.style.width = '100%';
			image.style.height = 'auto';
			image.style.display = 'block';
			image.style.margin = '0 auto'
			let div = document.getElementsByClassName("flight_plan_image")[0];
			div.replaceChildren([]);
			div.appendChild(image);
		});

		flightPlanData = {
			timestamp: timestamp,
			filename: filename,
			canvas: { blobImg, filenameImg, dataURL }
		}

	})

}

// ======================================================== ATT ORBIO - SALVAR UM ARQUIVO ======================================== //
// ========= SALVANDO A ROTA GERADA EM ARQUIVO .TXT ========= //
function saveFullPath() {

	// Validação: encerra a função se o botão de 'salvar' for clicado sem nenhuma rota definida
	if (typeof initialPath === 'undefined') { return false; }

	// Definição da altitude de voo a partir da entrada do usuário no modal
	// Se a altitude não for preenchida, define-se um valor padrão
	inputAltitude = document.getElementById("altitude").value;
	var altitude = (inputAltitude == '') ? 10 : inputAltitude;

	// Definição da velocidade de voo a partir da entrada do usuário no modal
	// Se a velocidade não for preenchida, define-se um valor padrão
	inputSpeed = document.getElementById("speed").value;
	var speed = (inputSpeed == '') ? 8 : inputSpeed;

	// ==== CONTEÚDO DO ARQUIVO DE ROTA ==== //
	var content = "QGC WPL 110\n";

	// HOME
	content += "0\t1\t0\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + home[1].toFixed(6) + "\t" + home[0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";

	// TAKEOFF: 22
	content += "1\t0\t0\t22\t0.000000\t0.000000\t0.000000\t0.000000\t" + home[1].toFixed(6) + "\t" + home[0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";

	// Corrigindo a altitude relativa: 16
	content += "2\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + home[1].toFixed(6) + "\t" + home[0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";

	// CHANGE SPEED: 178
	content += "3\t0\t3\t178\t" + speed + ".000000" + "\t" + speed + ".000000" + "\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";

	// WAYPOINT: 16 - ROTA INICIAL DA FASE 01
	//console.log(initialPath.length);
	if (document.getElementById('wp-grid').checked) {
		index = 0;
		for (j = 4; j < (initialPath.length * 2) + 2; j += 2) {
			content += j + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + initialPath[index][1].toFixed(6) + "\t" + initialPath[index][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
			index++;

			// Comando MAV_CMD_DO_SET_SERVO
			content += j + 1 + "\t0\t3\t183\t17.00000\t1234.000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
		}
	} else {
		index = 0;
		for (j = 4; j < (initialPath.length) + 2; j++) {
			content += j + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + initialPath[index][1].toFixed(6) + "\t" + initialPath[index][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
			index++;
		}
	}

	// WAYPOINT: 16 - ROTA DE VAI-E-VOLTA DA FASE 02
	//console.log(finalDestination.length);
	if (document.getElementById('wp-grid').checked) {
		index = 0;
		for (i = j; i < (finalDestination.length * 2) + j - 1; i += 2) {
			content += i + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + finalDestination[index][1].toFixed(6) + "\t" + finalDestination[index][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
			index++;

			// Comando MAV_CMD_DO_SET_SERVO
			content += i + 1 + "\t0\t3\t183\t17.00000\t1234.000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
		}
	} else {
		index = 0;
		console.log(finalDestination);
		for (i = j; i < (finalDestination.length) + j - 1; i++) {
			content += i + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + finalDestination[index][1].toFixed(6) + "\t" + finalDestination[index][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
			index++;
		}
	}

	// WAYPOINT: 16 - ROTA FINAL DA FASE 03
	if (document.getElementById('wp-grid').checked) {
		index = 0;
		for (j = i; j < (initialFinalPath[1].length * 2) + i; j += 2) {
			content += j + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + initialFinalPath[1][index][1].toFixed(6) + "\t" + initialFinalPath[1][index][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
			index++;

			// Comando MAV_CMD_DO_SET_SERVO
			content += j + 1 + "\t0\t3\t183\t17.00000\t1234.000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
		}
	} else {
		index = 0;
		for (j = i; j < (initialFinalPath[1].length) + i; j++) {
			content += j + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + initialFinalPath[1][index][1].toFixed(6) + "\t" + initialFinalPath[1][index][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
			index++;
		}
	}

	// RETURN-T0-LAUNCH: 20
	content += j + "\t0\t3\t20\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1";

	// Armazenando as coordenadas da área na última linha do arquivo através de um comentário
	content += "\n<!--\t";
	for (i = 0; i < coordinatesLongLat.length; i++) {
		content += coordinatesLongLat[i] + "\t";
	}
	content += "-->";

	var blob = new Blob([content],
		{ type: "text/plain;charset=utf-8" });

	saveFlightPlanToStorage(coordinatesLongLat[0], blob);
}

// == CRIAÇÃO DO REGISTRO DO PLANO DE VOO == //
function saveFlightPlanToStorage(coordinates, blobRoutes) {

	btnConfirmCreation.setAttribute("disabled", true);

	let filename_routes = flightPlanData.filename;
	let image = flightPlanData.canvas;

	const flight_plan = new File([blobRoutes], filename_routes);

	let formData = new FormData();
	formData.append("name", filename_routes.replace(".txt", ""));
	formData.append("description", "none");
	formData.append("routes_file", flight_plan);
	formData.append("image_file", image.dataURL);
	formData.append("image_filename", image.filenameImg);
	formData.append("coordinates", coordinates[1] + "," + coordinates[0]);

	axios.post(`${window.location.origin}/api/module/flight-plans`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	}).then((response) => {

		alertMessage.classList.add("alert-success");
		alertMessage.innerText = "O plano foi salvo no sistema e está disponível para download.";
		alertMessage.classList.remove("d-none");

		setTimeout(() => {
			window.close();
		}, 2000);

	}).catch((error) => {

		alertMessage.classList.add("alert-danger");
		alertMessage.innerText = "Erro! Tente novamente.";
		alertMessage.classList.remove("d-none");

	}).finally(() => {
		btnConfirmCreation.setAttribute("disabled", true);
	});

}

// ==== CLEAN MAP BEFORE PRINT SCREEN OR DISPLAY AGAIN AFTER ==== //
function removeElementsForPrintScreen() {
	btnMenu.style.display = 'none';
	btn.style.display = 'none';
	menuOptions.style.display = 'none';
	boxLogos.style.display = 'none';
	calculationBox.style.display = 'none';
	//markerSideMenu.style.display = 'none'
	map.removeControl(mapBoxGeocoder);
	map.removeControl(draw);
	map.removeControl(mapBoxNavigationControl);
	marcador.remove();
}

function displayElementsAfterPrintScreen() {
	btnMenu.style.display = 'block';
	btn.style.display = 'block';
	menuOptions.style.display = 'block';
	boxLogos.style.display = 'block';
	calculationBox.style.display = 'block';
	//markerSideMenu.style.display = 'block'
	map.addControl(mapBoxGeocoder);
	map.addControl(draw);
	map.addControl(mapBoxNavigationControl);
	marcador = new mapboxgl.Marker({ color: 'black' })
		.setLngLat(home)
		.addTo(map);
}

// ==================================================================================================//

// ========= SALVANDO AS ROTAS GERADAS EM ARQUIVO .TXT ========= //
function savePath() {

	// Validação: encerra a função se o botão de 'salvar' for clicado sem nenhuma rota definida
	if (typeof initialPath === 'undefined') { return false; }

	// Definição da altitude de voo a partir da entrada do usuário no modal
	// Se a altitude não for preenchida, define-se um valor padrão
	inputAltitude = document.getElementById("altitude").value;
	var altitude = (inputAltitude == '') ? 10 : inputAltitude;

	// Definição da velocidade de voo a partir da entrada do usuário no modal
	// Se a velocidade não for preenchida, define-se um valor padrão
	inputSpeed = document.getElementById("speed").value;
	var speed = (inputSpeed == '') ? 8 : inputSpeed;

	console.log("quantos breakpoints: " + breakpoints.length);

	// São gerados vários arquivos de rota, de acordo com a quantidade de breakpoints
	for (k = 0; k <= breakpoints.length; k++) {

		// ==== CONTEÚDO DO ARQUIVO DE ROTA ==== //
		var content = "QGC WPL 110\n";

		// HOME
		content += "0\t1\t0\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + home[1].toFixed(6) + "\t" + home[0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";

		// TAKEOFF: 22
		content += "1\t0\t0\t22\t0.000000\t0.000000\t0.000000\t0.000000\t" + home[1].toFixed(6) + "\t" + home[0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";

		// Corrigindo a altitude relativa: 16
		content += "2\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + home[1].toFixed(6) + "\t" + home[0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";

		// CHANGE SPEED: 178
		content += "3\t0\t3\t178\t" + speed + ".000000" + "\t" + speed + ".000000" + "\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";

		// Identificação do waypoint
		var id = 4;

		// WAYPOINT: 16 - ROTA INICIAL DA FASE 01
		// É gerada apenas no primeiro arquivo de rota
		if (k == 0) {
			//console.log(initialPath.length);
			if (document.getElementById('wp-grid').checked) {
				for (j = 0; j < initialPath.length - 1; j++) {
					content += id + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + initialPath[j][1].toFixed(6) + "\t" + initialPath[j][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
					id++;

					// Comando MAV_CMD_DO_SET_SERVO
					content += id + "\t0\t3\t183\t17.00000\t1234.000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
					id++;
				}
			} else {
				for (j = 0; j < initialPath.length - 1; j++) {
					content += id + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + initialPath[j][1].toFixed(6) + "\t" + initialPath[j][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
					id++;
				}
			}

			var inicioBP = 0;
		} // Fim do 'if(k == 0)'


		// WAYPOINT: 16 - ROTA DE VAI-E-VOLTA DA FASE 02
		if (document.getElementById('wp-grid').checked) {
			for (i = inicioBP; i < finalDestination.length - 1; i++) {

				if (k == breakpoints.length) {
					content += id + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + finalDestination[i][1].toFixed(6) + "\t" + finalDestination[i][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
					id++;

					// Comando MAV_CMD_DO_SET_SERVO
					content += id + "\t0\t3\t183\t17.00000\t1234.000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
					id++;

				} else if (finalDestination[i][1] != breakpoints[k][1] && finalDestination[i][0] != breakpoints[k][0]) {
					content += id + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + finalDestination[i][1].toFixed(6) + "\t" + finalDestination[i][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
					id++;

					// Comando MAV_CMD_DO_SET_SERVO
					content += id + "\t0\t3\t183\t17.00000\t1234.000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
					id++;

				} else {
					inicioBP = i;
					break;
				}
			}
		} else {
			for (i = inicioBP; i < finalDestination.length - 1; i++) {

				if (k == breakpoints.length) {
					content += id + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + finalDestination[i][1].toFixed(6) + "\t" + finalDestination[i][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
					id++;

				} else if (finalDestination[i][1] != breakpoints[k][1] && finalDestination[i][0] != breakpoints[k][0]) {
					content += id + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + finalDestination[i][1].toFixed(6) + "\t" + finalDestination[i][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
					id++;

				} else {
					inicioBP = i;
					break;
				}
			}
		}

		// WAYPOINT: 16 - ROTA FINAL DA FASE 03
		// Faz parte do último arquivo de rota gerado
		if (k == breakpoints.length) {
			if (document.getElementById('wp-grid').checked) {
				for (j = 0; j < initialFinalPath[1].length; j++) {
					content += id + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + initialFinalPath[1][j][1].toFixed(6) + "\t" + initialFinalPath[1][j][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
					id++;

					// Comando MAV_CMD_DO_SET_SERVO
					content += id + "\t0\t3\t183\t17.00000\t1234.000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";
					id++;
				}
			} else {
				for (j = 0; j < initialFinalPath[1].length; j++) {
					content += id + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + initialFinalPath[1][j][1].toFixed(6) + "\t" + initialFinalPath[1][j][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
					id++;
				}
			}
		}

		// RETURN-T0-LAUNCH: 20
		content += id + "\t0\t3\t20\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1";

		// Armazenando as coordenadas da área na última linha do arquivo através de um comentário
		content += "\n<!--\t";
		for (i = 0; i < coordinatesLongLat.length; i++) {
			content += coordinatesLongLat[i] + "\t";
		}
		content += "-->";

		var blob = new Blob([content],
			{ type: "text/plain;charset=utf-8" });

		// Nome do arquivo com data em milissegundos decorridos
		fileName = "0" + k + "_" + new Date().getTime() + ".txt";
		saveAs(blob, fileName);

		// Salvando um printscreen para o relatório
		savePrintScreen();

	} // Fim do 'for'		
}

// === OPÇÃO DE "ABRIR" UM ARQUIVO .KML E CARREGAR A POSIÇÃO INICIAL NO MAPA === //
function importKMLPoint(e) {

	// Limpando layers, campos e polígono
	cleanLayers();
	cleanPolygon();

	//console.log(marcador);
	// Apagando o marcador anterior
	marcador.remove();

	var file = e.target.files[0];
	var extension = e.target.files[0].name.split('.').pop().toLowerCase();
	if (!file || extension !== 'kml') { return; }

	var reader = new FileReader();

	reader.onload = function (e) {
		// Conteúdo completo do arquivo
		var contents = e.target.result;

		// Localizando as tags <coordinates> dentro do arquivo
		var coordinates = contents.substring(
			contents.search("<coordinates>") + 13,
			contents.search("</coordinates>")
		);

		// Quebrando a única coordenada do ponto
		coordinates = coordinates.split(",");
		home = [Number(coordinates[0]), Number(coordinates[1])];

		// Direcionando o mapa para a posição inicial
		map.flyTo({
			center: [
				home[0],
				home[1]
			],
			essential: true // this animation is considered essential with respect to prefers-reduced-motion
		});

		// Adicionando um marcador no ponto KML importados
		marcador = new mapboxgl.Marker({ color: 'black' })
			.setLngLat(home)
			.addTo(map);

	};
	reader.readAsText(file);
}

// === OPÇÃO DE "ABRIR" UM ARQUIVO .KML E CARREGAR UM POLÍGONO NO MAPA === //
function importKMLPolygon(e) {

	// Limpando layers, campos e polígono
	cleanLayers();
	cleanPolygon();

	var file = e.target.files[0];
	var extension = e.target.files[0].name.split('.').pop().toLowerCase();
	if (!file || extension !== 'kml') { return; }

	var reader = new FileReader();

	reader.onload = function (e) {
		// Conteúdo completo do arquivo
		var contents = e.target.result;

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
			console.log("NÃO SÃO IGUAIS!");
			kmlArea[i] = kmlArea[0];
		}

		//console.log(kmlArea[0]);
		//console.log(kmlArea[kmlArea.length - 1]);

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
		calculateTxtArea();

		// Chamando novamente as funções que calculam a maior aresta e o vértice mais distante
		longestEdgeLongLat = longestEdge(kmlArea);
		farthestVertexLongLat = farthestVertex(kmlArea, longestEdgeLongLat);
	};
	reader.readAsText(file);
}

// === OPÇÃO DE "ABRIR" UM ARQUIVO .KML E CARREGAR UMA ÁREA NO MAPA === //
function importKMLPath(e) {

	// Limpando layers, campos e polígono
	cleanLayers();
	cleanPolygon();

	var file = e.target.files[0];
	var extension = e.target.files[0].name.split('.').pop().toLowerCase();
	if (!file || extension !== 'kml') { return; }

	var reader = new FileReader();

	reader.onload = function (e) {
		// Conteúdo completo do arquivo
		var contents = e.target.result;

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

		//console.log(kmlArea[0]);
		//console.log(kmlArea[kmlArea.length - 1]);

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
		calculateTxtArea();

		// Chamando novamente as funções que calculam a maior aresta e o vértice mais distante
		longestEdgeLongLat = longestEdge(kmlArea);
		farthestVertexLongLat = farthestVertex(kmlArea, longestEdgeLongLat);

		// Desenhando a rota e calculando sua distância
		drawTxtPath(kmlArea);
		calculateTxtDistance(kmlArea);
	};
	reader.readAsText(file);
}

// === OPÇÃO DE "ABRIR" UM ARQUIVO .poly DO MISSION PLANNER E CARREGAR UM POLÍGONO NO MAPA === //
function importMPPolygon(e) {

	// Limpando layers, campos e polígono
	cleanLayers();
	cleanPolygon();

	var file = e.target.files[0];
	var extension = e.target.files[0].name.split('.').pop().toLowerCase();
	if (!file || extension !== 'poly') { return; }

	var reader = new FileReader();

	reader.onload = function (e) {
		// Conteúdo completo do arquivo
		var contents = e.target.result;

		// Localizando as tags <coordinates> dentro do arquivo
		/*var coordinates  = contents.substring(
		contents.search("<coordinates>") + 13, 
		contents.search("</coordinates>")
	);*/

		//console.log(contents);

		// Quebrando todas as coordenadas do polígono
		coordinates = contents.split(/\r?\n/);

		//console.log(coordinates);	
		// Array que irá armazenar as coordenadas da área
		kmlArea = [];

		// Percorrendo todas as coordenadas e quebrando as informações de lat e long
		for (i = 0; i < coordinates.length - 1; i++) {
			//console.log(coordinates[i]);

			latLong = coordinates[i].split(" ");
			kmlArea[i] = [Number(latLong[1]), Number(latLong[0])];
			//console.log(kmlArea[i]);
		}

		coordinatesLongLat = kmlArea;
		home = kmlArea[0];

		//console.log(coordinatesLongLat);

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
		calculateTxtArea();

		// Chamando novamente as funções que calculam a maior aresta e o vértice mais distante
		longestEdgeLongLat = longestEdge(kmlArea);
		farthestVertexLongLat = farthestVertex(kmlArea, longestEdgeLongLat);
	};
	reader.readAsText(file);
}

// ======================================================== ATT ORBIO - FORMAS DE ABRIR UM ARQUIVO ======================================== //

function openTxtFileFromStorage(contents) {

	// Limpando layers, campos e polígono
	cleanLayers();
	cleanPolygon();

	openTxtFileFromComputerOrStorage(contents);
}

function openTxtFileFromComputer(e) {

	// Limpando layers, campos e polígono
	cleanLayers();
	cleanPolygon();

	var file = e.target.files[0];
	var extension = e.target.files[0].name.split('.').pop().toLowerCase();
	if (!file || extension !== 'txt') { return; }

	var reader = new FileReader();

	reader.onload = function (e) {
		// Conteúdo completo do arquivo
		var contents = e.target.result;

		openTxtFileFromComputerOrStorage(contents);

	};

	reader.readAsText(file);

}

function openTxtFileFromComputerOrStorage(contents) {
	// Quebrando as linhas do arquivo em um array
	var lines = contents.split("\n");

	// Acessando a posição inicial (home) contida no arquivo
	var txtHome = lines[1].split("\t");
	home = [Number(txtHome[9]), Number(txtHome[8])];

	// Acessando a velocidade contida no arquivo e preenchendo o campo no form
	var txtSpeed = lines[3].split("\t");
	document.getElementById("speed").value = Number(txtSpeed[4]).toFixed(0);
	document.getElementById("label-speed").innerHTML = "Velocidade: " + Number(txtSpeed[4]).toFixed(0) + "m/s";

	// Acessando a altitude contida no arquivo e preenchendo o campo no form
	var txtAltitude = lines[2].split("\t");
	document.getElementById("altitude").value = Number(txtAltitude[10]).toFixed(0);
	document.getElementById("label-altitude").innerHTML = "Altitude: " + Number(txtAltitude[10]).toFixed(0) + "m";

	// Array que armazenará todos os waypoints da rota do arquivo
	txtPath = [];
	index = 0;

	// Quebrando todas as linhas nos espaços \t
	for (i = 4; i < lines.length - 2; i++) {
		line = lines[i].split("\t");

		// Somente os waypoints com latitude e longitude são considerados, ou seja, código 16
		// Os waypoints de código 183 (gatilho do dispenser) tem lat/long zerados e não podem ser
		// adicionados ao desenho da rota
		if (Number(line[3]) == 16) {
			// As posições de latitude e longitude estão nos índices 9 e 8 de cada linha
			txtPath[index] = [Number(line[9]), Number(line[8])];
			index++
		}
		//console.log(Number(line[3]));

	}

	// Array que armazenará todas as coordenadas do polígono extraídas a partir do arquivo
	txtArea = [];
	index = 0;

	// Quebrando a última linha para acessar as coordenadas do polígono
	txtPolygon = lines[lines.length - 1].split("\t");

	// Acessando todas as coordenadas
	for (i = 1; i < txtPolygon.length - 1; i++) {
		txtLatLong = txtPolygon[i].split(",");
		txtArea[index] = [Number(txtLatLong[0]), Number(txtLatLong[1])];
		index++;
	}

	// Acessando o centroide da área para posicionar no mapa
	var polygon = turf.polygon([txtArea]);
	var centroid = turf.coordAll(turf.centroid(polygon));

	// Direcionando o mapa
	map.flyTo({
		center: [
			centroid[0][0], centroid[0][1]
		],
		essential: true
	});

	// Desenhando a rota e calculando sua distância
	drawTxtPath(txtPath);
	calculateTxtDistance(txtPath);

	// Desenhando o polígono e calculando sua área
	drawTxtArea(txtArea);
	calculateTxtArea();
}

// =============================================================================================================//

// == CALCULANDO A DISTÂNCIA TOTAL DA ROTA IMPORTADA A PARTIR DO ARQUIVO == //
function calculateTxtDistance(txtPath) {

	// Distância percorrida pela rota importada do arquivo
	totalDistance = 0;
	//console.log(speed.value);
	for (j = 0; j < txtPath.length - 1; j++) {
		totalDistance += turf.distance(turf.point([txtPath[j][0], txtPath[j][1]]), turf.point([txtPath[j + 1][0], txtPath[j + 1][1]]));
	}

	var distanceBox = document.getElementById("calculated-distance");
	distanceBox.innerHTML = totalDistance.toFixed(2) + " Km";

	calculateFlightTime(totalDistance);
}

// == CALCULANDO O TEMPO DE VOO E A VELOCIDADE DA ROTA == //
function calculateFlightTime(distance) {

	// Se a velocidade não for definida na configuração, ela é limitada a 8m/s 
	var avgSpeed = (speed.value == "") ? 8 : speed.value;

	// Tempo de execução da rota
	time = 0;
	time += Number((distance * 1000) / avgSpeed);
	var minutes = time / 60;
	var seconds = time % 60;

	var timeBox = document.getElementById("calculated-time");
	var roundedSec = (Math.round(seconds) < 10) ? "0" + Math.round(seconds) : Math.round(seconds);
	timeBox.innerHTML = Math.floor(minutes) + "m" + roundedSec + "s";
}

// == CALCULANDO A ÁREA DO POLÍGONO IMPORTADA A PARTIR DO ARQUIVO == //
function calculateTxtArea() {

	var data = draw.getAll();
	var answer = document.getElementById('calculated-area');
	var area = turf.area(data);

	var rounded_area = (Math.round(area * 100) / 100) / 10000;
	answer.innerHTML = rounded_area.toFixed(2) + ' ha';
}

// == DESENHANDO O POLÍGONO DA ÁREA == //
function drawTxtArea(txtArea) {

	var objArea = {
		'type': 'Polygon',
		'coordinates': [
			txtArea
		]
	}
	draw.add(objArea);
}

// == DESENHANDO A ROTA IMPORTADA A PARTIR DO ARQUIVO == // 
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

// === LIMPANDO AS ROTAS DESENHADAS NO MAPA === //
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

function cleanFields() {
	// Limpando o input file e os boxes de distância e tamanho da área
	document.getElementById('file-input').value = "";
	document.getElementById('file-import').value = "";
	document.getElementById('file-import-poly').value = "";
	document.getElementById('file-import-path').value = "";

	document.getElementById('calculated-distance').innerHTML = '0 Km';
	document.getElementById('calculated-time').innerHTML = '0 s';
	document.getElementById('calculated-area').innerHTML = '0 ha';

	document.getElementById('altitude').value = 10;
	document.getElementById('speed').value = 8;
	document.getElementById('distance').value = 50;

	document.getElementById('label-altitude').innerHTML = "Altitude: 10m";
	document.getElementById('label-speed').innerHTML = "Velocidade: 8m/s";
	document.getElementById('label-distance').innerHTML = "Distância: 50m";
}

function cleanPolygon() {
	// Limpando o polígono
	draw.deleteAll();
}