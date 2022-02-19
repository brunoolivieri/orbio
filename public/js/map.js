// Token gerado para uso no MAPBOX-GL
mapboxgl.accessToken = 'pk.eyJ1IjoidGF1YWNhYnJlaXJhIiwiYSI6ImNrcHgxcG9jeTFneWgydnM0cjE3OHQ2MDIifQ.saPpiLcsBQnqVlRrQrcCIQ';

const home = [-47.926063, -15.841060];

var coordinatesLongLat;
var initialPosition = [];
var longestEdgeLongLat;
var farthestVertexLongLat;

// Criando um objeto mapa
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/satellite-v9',
	zoom: 15,
	center: home // Longitude e latitude
});

// ========= MARCADORES ========== //

/*var marcados = new mapboxgl.Marker({color: 'black'})
					.setLngLat(home)
					.addTo(map);*/

// ========= FERRAMENTA DE BUSCA POR LOCALIDADES =========== //
 
// Adicionando o controle de busca ao mapa.
map.addControl(
	new MapboxGeocoder({
		accessToken: mapboxgl.accessToken,
		mapboxgl: mapboxgl
	})
);

// Adicionando controles de zoom e rotação no mapa
map.addControl(new mapboxgl.NavigationControl());


// ========== ADICIONANDO AS OPÇÕES DE MAPA ============= //
/*
var layerList = document.getElementById("menu");
var inputs = layerList.getElementsByTagName("input");

function switchLayer(layer){
	var layerId = layer.target.id;
	map.setStyle('mapbox://styles/mapbox/' + layerId);
}

for(var i = 0; i < inputs.length; i++){
	inputs[i].onclick = switchLayer;
}*/

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
	
// == FUNÇÃO QUE ATUALIZA A METRAGEM DA ÁREA APÓS O DESENHO DO POLÍGONO == //
function updateArea(e) {
	
	var data = draw.getAll();
	coordinatesLongLat = data.features[0].geometry.coordinates[0];

	longestEdgeLongLat = longestEdge(coordinatesLongLat);
	farthestVertexLongLat = farthestVertex(coordinatesLongLat, longestEdgeLongLat);
	
	var answer = document.getElementById('calculated-area');

	if (data.features.length > 0) {
		var area = turf.area(data);
		
		var rounded_area = Math.round(area * 100) / 100;
		answer.innerHTML = '<p>' + rounded_area + ' m²</p>';
	} else {
		answer.innerHTML = '';
		if (e.type !== 'draw.delete')
			alert('Use as ferramentas para desenhar um polígono!');
	}
}

// == VERIFICA A MAIOR ARESTA DO POLÍGONO == //
// == A MAIOR ARESTA DEFINE O SENTIDO DA ORIENTAÇÃO DO MOVIMENTO VAI-E-VOLTA == //
var longestEdge = function(area_coordinates){

	var longestEdge = [];
	var largerDistance = 0;

	for(let i = 0; i < (area_coordinates.length - 1); i++){
		
		let initialPoint = area_coordinates[i];
		let finalPoint 	 = area_coordinates[i + 1];

		let distance = turf.distance(initialPoint, finalPoint);  

		if(distance > largerDistance){
			largerDistance = distance;
			longestEdge = [initialPoint, finalPoint];
		}		
	}

	// Se já existe um layer e um source com este ID, eles são removidos
	var mapLayer = map.getLayer('route');

    if(typeof mapLayer !== 'undefined') {
    	map.removeLayer('route').removeSource('route');
    }
	
	// Criando um Objeto GeoJSON para 
	// desenhar uma linha sobre a maior aresta
	/*var objLongestEdge = {
		'type': 'geojson',
		'data': {
			'type': 'Feature',
			'properties': {},
			'geometry' : {
				'type' : 'LineString',
				'coordinates': [
					longestEdge[0],
					longestEdge[1]
				]	
			}
		}
	}

	map.addSource('route', objLongestEdge);

	map.addLayer({
		'id': 'route',
		'type': 'line',
		'source': 'route',
		'layout': {
			'line-join': 'round',
			'line-cap': 'round'
		},
		'paint': {
			'line-color': '#0f0',
			'line-width': 1
		}
	});*/
	
	return longestEdge;
}

var farthestVertex = function(area_coordinates, longestEdge){
	
	var maxDistance = 0;
	var farthestVertex = [];
	
	for(let i = 0; i < (area_coordinates.length - 1); i++){
	
		// Calculando a distância entre a maior aresta e o vértice mais distante
		let distance = turf.pointToLineDistance(area_coordinates[i], [longestEdge[0], longestEdge[1]]);

		// Armazenando a distância e o vértice mais distante
		if(distance > maxDistance){
			maxDistance = distance;
			farthestVertex = area_coordinates[i];
		}
	}

	// Criando um objeto Ponto no formado GeoJSON
	// com as coordenadas do vértice mais distante
	/*map.addSource('vertex', {
		'type': 'geojson',
		'data': {
			'type': 'Feature',
			'properties': {},
			'geometry' : {
				'type' : 'Point',
				'coordinates': farthestVertex
			}
		}
	});

	// Adicionando o objeto Ponto no mapa
	map.addLayer({
		'id': 'vertex',
		'type': 'circle',
		'source': 'vertex',
		'paint':{
			'circle-color' : '#f00'	
		}
	});*/

	return farthestVertex;
}

// == SELECIONANDO O PONTO DE PARTIDA DA ROTA (VÉRTICE INICIAL) == //
function selectInitialPosition(){

	let selectedPosition = draw.getSelectedPoints();

	// Ao clicar no mapa, deve-se selecionar as coordenadas do ponto desenhado no mapa
	if(turf.coordAll(selectedPosition).length !== 0){

		//Invocando a função de desenho do BBox
		drawBBox(selectedPosition);
	}

}

// == CRIANDO E DESENHANDO O BBOX == //
function drawBBox(selectedPosition){
		
		//console.log("Ponto de partida da rota: " + turf.coordAll(selectedPosition));	

		// Desenhando um box no entorno do polígono
		bbox = turf.bbox(draw.getAll());

		// Convertendo o box em polígono (retangular)
		rectangle = turf.bboxPolygon(bbox);

		// Aumentando o tamanho do retângulo em 200%
		rectangle = turf.transformScale(rectangle, 2);

		// Criando um objeto GeoJSON para desenhar o retângulo no mapa
		var objRectangle = {
			'type': 'geojson',
			'data': rectangle
		}

		// Invocando função das linhas paralelas
		drawParallelLines(rectangle, selectedPosition);
}	

// == DESENHANDO AS LINHAS PARALELAS == //
function drawParallelLines(rectangle, selectedPosition){

		// Acessando apenas o array de coordenadas do retângulo
		rectangleCoords = turf.getCoords(rectangle);

		// Definindo a distância padrão entre as linhas pararelas
		//distanceBetweenLines = 0.05; // 50m
		inputDistance = document.getElementById("distance").value;
		distanceBetweenLines = (inputDistance == '') ? 0.05 : inputDistance / 1000;
		console.log(distanceBetweenLines);

		// Criando 4 pontos que delimitam o retângulo
		p1 = rectangleCoords[0][0];
		p2 = rectangleCoords[0][1];
		p3 = rectangleCoords[0][2];
		p4 = rectangleCoords[0][3];	

		// Medindo as distâncias de longitude e latitude
		distanceLong = turf.distance(p1, p4);
		distanceLat  = turf.distance(p1, p2);
		
		// Este é vertice mais distante em relação à maior aresta do polígono
		pt = farthestVertexLongLat;
		
		// Calculando o ângulo da maior aresta
		angle = turf.bearing(longestEdgeLongLat[0], longestEdgeLongLat[1]);     
    	//console.log(angle);

		// As linhas paralelas serão definidas no sentido da maior distância
		if(distanceLong > distanceLat){
			// Mas o número de linhas é definido pela menor distância dividido pela distância entre linhas
			numberOfLines = Math.round(distanceLat / distanceBetweenLines);
			
			// Criando as duas linhas externas no sentido da longitude (eixo x)
			lineFeatureA = turf.lineString([ p1, p4 ]);
			lineFeatureB = turf.lineString([ p2, p3 ]);
	
		} else{
			// Mas o número de linhas é definido pela menor distância dividido pela distância entre linhas
			numberOfLines = Math.round(distanceLong / distanceBetweenLines);	

			// Criando as duas linhas externas no sentido da latitude (eixo y)
			lineFeatureA = turf.lineString([ p1, p2 ]);
			lineFeatureB = turf.lineString([ p3, p4 ]);

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
		if(distance > totalDistance){
			distanceBetweenLines = -distanceBetweenLines;
		} 

		// Criando as linhas paralelas em relação à linha de referência
		for(i = 1; i <= numberOfLines; i++){
			offsetLine = turf.lineOffset(lineFeature, distanceBetweenLines * i);

			// Apenas as coordenadas de cada linha são armazenadas no array
			paralelPath[i - 1] = turf.getCoords(offsetLine);
		} 

		// Criando um Objeto GeoJSON para 
		// desenhar as linhas paralelas da segunda fase da rota
		var objPhase02 = {
			'type': 'Feature',
			'properties': {},
			'geometry' : {
				'type' : 'MultiLineString',
				'coordinates': paralelPath
			}
		}

		// Rotacionando as linhas paralelas de acordo com o ângulo da maior aresta
		var rotatedLines = turf.transformRotate(objPhase02, angle);

		// Começa o desenho das intersecções
		drawIntersections(numberOfLines, rotatedLines, selectedPosition);

}

// == CRIANDO LINHAS PARALELAS VÍSIVEIS QUE INTERSECCIONAM O POLÍGONO == //
function drawIntersections(numberOfLines, rotatedLines, selectedPosition){
		
		// Acessando o array de coordenadas do polígono
		edges = turf.getCoords(draw.getAll().features[0]);
		index = 0;

		// Identificando o índice da maior aresta
		for(i = 0; i < edges[0].length - 1; i++){
			if(longestEdgeLongLat[0][0] == edges[0][i][0] && longestEdgeLongLat[0][1] == edges[0][i][1]){
				index = i;
			}
		}	

		// Reordenando os vértices do polígono para evitar problemas na ordem das intersecções
		orderedEdges = [];
		for(i = 0; i < edges[0].length; i++){
			orderedEdges[i] = edges[0][index];
			index = (index == edges[0].length - 2) ? 0 : index + 1; 
		}

		// Array que armazenará todas os pontos de intersecção 
		// entre as linhas paralelas (lines) e as arestas do polígono (orderedEdges)
		intersectionPoints = [];
		index = 0;

		// Acessando o array de coordenadas das linhas paralelas
		lines = turf.getCoords(rotatedLines);

		// Percorrendo todas as linhas paralelas
		for(i = 0; i < numberOfLines; i++){
			// Acessando cada linha paralela individualmente
			line1 = turf.lineString(lines[i]);

			// Percorrendo todas as arestas do polígono
			for(j = 0; j < orderedEdges.length - 1; j++){
				// Acessando cada aresta do polígono individualmente
				line2 = turf.lineString([orderedEdges[j], orderedEdges[j+1]]);
				
				// Detectando a interseção entre as duas linhas
				intersects = turf.lineIntersect(line1, line2);

				// Se a intersecção ocorreu, ou seja, o array contém as coordenadas de um ponto
				if(intersects.features.length !== 0){
					// O ponto de intersecção é armazenado no array de intersecções
					intersectionPoints[index] = turf.getCoords(intersects.features[0]);
					index++;
				}
			}	
		}

		// Criando um objeto GeoJSON para desenhar os pontos de intersecção
		// da segunda fase da rota (movimento de vai-e-volta)
		var objIntersectionPoints = {
			'type': 'geojson',
			'data': {
				'type': 'Feature',
				'properties': {},
				'geometry' : {
					'type' : 'MultiPoint',
					'coordinates': 
						[intersectionPoints[0]]
				}
			}
		}

		// Se já existe um layer e um source com este ID, eles são removidos
		var mapLayer = map.getLayer('routePhase02');

	    if(typeof mapLayer !== 'undefined') {
	    	map.removeLayer('routePhase02').removeSource('routePhase02');
	    }

	    // Novos sources e layers são adicionados apenas se ainda não existem no mapa
		map.addSource('routePhase02', objIntersectionPoints);

		// Adicionando círculos verdes que indicam os pontos de intersecção
		map.addLayer({
			'id': 'routePhase02',
			'type': 'circle',
			'source': 'routePhase02',
			'paint':{
				'circle-color' : '#0f0'	
			}
		});	

		// Começa a definição das fases de rotas
		defineRoutes(selectedPosition);

}

// == PROGRAMAÇÃO DA DEFINIÇÃO DAS FASES DA ROTA - FASES 1,2,3 == //
function defineRoutes(selectedPosition){

		// Posição inicial do voo selecionado pelo usuário clicando em um dos vértices
		initialPosition = turf.coordAll(selectedPosition);

		// Percorrendo todos os pontos de intersecção que formam o movimento de vai-e-volta
		index = 0;
		destination = [];
		//distanceStripes = 0.05;
		inputDistance = document.getElementById("distance").value;
		distanceStripes = (inputDistance == '') ? 0.05 : inputDistance / 1000;
		finalDestination = intersectionPoints;
		
		for(i = 0; i < intersectionPoints.length - 1; i+=2){

			// São geradas duas linhas iguais com os sentidos dos pontos invertidos
			// O recuo é aplicado nos dois lados das linhas
			lineA = turf.lineString([intersectionPoints[i], intersectionPoints[i+1]]);
			destination[index] = turf.getCoord(turf.along(lineA, distanceStripes));
			index++;

			lineB = turf.lineString([intersectionPoints[i+1], intersectionPoints[i]]);
			destination[index] = turf.getCoord(turf.along(lineB, distanceStripes));
			index++;
		}

		// ====== COMO IDENTIFICAR QUAL PARTE DEVE SER AFASTADA? ====== //
		// Medindo a distância dos pontos recuados em relação à linha central
		if(destination.length/2 % 2 != 0){
			distanceA = turf.distance(destination[destination.length/2 - 1], turf.point([initialPosition[0][0], initialPosition[0][1]]));
			distanceB = turf.distance(destination[destination.length/2], turf.point([initialPosition[0][0], initialPosition[0][1]]));
			end = 1;
		} else{
			distanceA = turf.distance(destination[destination.length/2], turf.point([initialPosition[0][0], initialPosition[0][1]]));
			distanceB = turf.distance(destination[destination.length/2 - 1], turf.point([initialPosition[0][0], initialPosition[0][1]]));
			end = 0;
		}	
		
		// Definindo qual lado das linhas será utilizado como recuo
		start = (distanceA < distanceB) ? 2 : 1;
		
		// Substituindo os pontos da rota que são intersecções por pontos que foram recuados
		// em relação ao trecho das fases 01 e 03
		for(i = start; i < intersectionPoints.length - end; i+=2){
			if(i != finalDestination.length - 2){
				finalDestination[i] = destination[i];
			} else if(start == 2 && end == 1 && i == finalDestination.length - 2){
				finalDestination[i] = destination[i];
			} 	
		}	
		
		// Criando as conexões entre os pontos de intersecção para gerar a rota de vai-e-volta
		for(i = 2; i < finalDestination.length; i+=4){
			aux = finalDestination[i];
			finalDestination[i] = finalDestination[i+1];
			finalDestination[i+1] = aux;	
		}

		// Verificando qual é índice do ponto inicial
		for(i = 0; i < edges[0].length - 1; i++){
			if(edges[0][i][0] == initialPosition[0][0] && edges[0][i][1] == initialPosition[0][1]){
				initialIndex = i;		
			}
		}

		// Primeiro ponto do array de coordenadas que definem o movimento de vai-e-volta
		firstPoint 		= turf.point(finalDestination[0]);

		// Último ponto do array de coordenadas que definem o movimento de vai-e-volta
		lastPoint 		= turf.point(finalDestination[finalDestination.length - 1]);

		// Armazenará os trechos de rota das fases 01 e 03
		initialFinalPath = [];
		
		// 0: FASE 01 - DO INÍCIO DO VAI-E-VOLTA ATÉ A POSIÇÃO DE PARTIDA (SERÁ INVERTIDO DEPOIS)
		// 1: FASE 03 - DO FINAL DO VAI-E-VOLTA ATÉ A POSIÇÃO PARTIDA

		for(i = 0; i < 2; i++){
			// Transformando todos os vértices da área em uma coleção de pontos
			polygonEdges 	= turf.explode(draw.getAll());
			
			// Usando a mesma variável para identificar o ponto mais próximo
			point = (i == 0) ? firstPoint : lastPoint;

			// Verificando qual é o vértice da área mais próximo do ponto inicial/final do movimento de vai-e-volta
			nearest 		= turf.nearestPoint(point, polygonEdges);
			
			// Verificando qual é índice deste vértice
			nearestIndex 	= nearest.properties.featureIndex;

			// Encontrando a menor rota entre entre os dois caminhos possíveis (sentido horário e anti-horário) 
			// A rota começa no vértice mais próximo do ponto inicial/final do vai-e-volta
			// e vai até o ponto de partida selecionado pelo usuário
			ni = nearestIndex;
			ii = initialIndex;

			pathA = [];
			pathA[0] = turf.getCoords(point);
			j = 1;
			do{	
				index = (ni % (edges[0].length - 1));
				pathA[j] = edges[0][index];
				j++;
				ni++;

			} while(index !== ii);
			
			ni = nearestIndex;
			pathB = [];
			pathB[0] = turf.getCoords(point);
			j = 1;
			do{
				index = (ni % (edges[0].length - 1));
				pathB[j] = edges[0][index];
				j++;
				ni = (ni == 0) ? edges[0].length - 2 : ni - 1;

				if(ii == ni) pathB[j] = edges[0][ni];

			} while(ii !== ni);	

			// Medindo as distâncias entre os dois caminhos: sentido horário e anti-horário
			lengthA = turf.length(turf.lineString(pathA));	
			lengthB = turf.length(turf.lineString(pathB));

			// Definindo a rota inicial/final com o menor caminho
			initialFinalPath[i] = (lengthA < lengthB) ? pathA : pathB;

			// A verificação só é necessária quando houver mais de 2 pontos
			if(initialFinalPath[i].length > 2){
			
				// Verificando se a posição inicial/final do movimento de vai-e-volta 
				// está entre o vértice mais próximo e o ponto de partida
				nearestLine   = turf.lineString([initialFinalPath[i][1], initialFinalPath[i][2]]); 
				bfPosition	  = turf.point(initialFinalPath[i][0]);
				
				// Se estiver, o vértice mais próximo é eliminado da rota para evitar a passagem pelo mesmo ponto 2x
				if(turf.pointToLineDistance(bfPosition, nearestLine, {method: 'planar'}).toFixed(5) == 0.00000){
					initialFinalPath[i].splice(1, 1);
				}	
			}

			// A rota inicial da fase 01 deve ser invertida, pois ela foi gerada 
			// do movimento de vai-e-volta para o ponto de partida
			if(i == 0) {
				initialPath = [];
				index = 0;
				for(j = initialFinalPath[i].length - 1; j >= 0; j--){
					initialPath[index] = initialFinalPath[i][j];
					index++;
				}
			}
		}
		
		// Invocação da função para desenho do movimento de vai-e-volta
		startDrawRoute(finalDestination, destination, initialFinalPath);
}

// == FUNÇÃO PARA INÍCIO D0 DESENHO DO MOVIMENTO DE VAI-E-VOLTA == //
function startDrawRoute(finalDestination, destination, initialFinalPath){

		var mapLayer = map.getLayer('bfPhase02');

	    if(typeof mapLayer !== 'undefined') {
	    	map.removeLayer('bfPhase02').removeSource('bfPhase02');
	    }

	    // Novos sources e layers são adicionados apenas se ainda não existem no mapa
		var objBF = {
			'type': 'geojson',
			'data':{
				'type': 'Feature',
				'properties': {},
				'geometry' : {
					'type' : 'MultiLineString',
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
function drawNewRoutePoints(destination, initialFinalPath, finalDestination){

		var objPoints01 = {
			'type': 'geojson',
			'data': {
				'type': 'MultiPoint',
				'coordinates':
					destination 
			}	
		}

		// Se já existe um layer e um source com este ID, eles são removidos
		var mapLayer = map.getLayer('routePoints01');

	    if(typeof mapLayer !== 'undefined') {
	    	map.removeLayer('routePoints01').removeSource('routePoints01');
	    }

	    // Novos sources e layers são adicionados apenas se ainda não existem no mapa
		map.addSource('routePoints01', objPoints01);

		map.addLayer({
			'id': 'routePoints01',
			'type': 'circle',
			'source': 'routePoints01',
			'paint': {
				'circle-color': '#ccc'
			}
		});	

		// Invocação da função para desenho da rota inicial
		drawInititalRoute(initialFinalPath, destination, finalDestination);

	}

// == DESENHO DA ROTA INICIAL == //
function drawInititalRoute(initialFinalPath, destination, finalDestination){

		// Criando um Objeto GeoJSON para desenhar a rota inicial
		var objPhase01 = {
			'type': 'geojson',
			'data': {
				'type': 'Feature',
				'properties': {},
				'geometry' : {
					'type' : 'MultiLineString',
					'coordinates': [
						initialFinalPath[0]
					]	
				}
			}
		}

		// Se já existe um layer e um source com este ID, eles são removidos
		var mapLayer = map.getLayer('routePhase01');

	    if(typeof mapLayer !== 'undefined') {
	    	map.removeLayer('routePhase01').removeSource('routePhase01');
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
function drawFinalRoute(initialFinalPath, finalDestination){
	
		// Criando um Objeto GeoJSON para desenhar a rota final
		var objPhase03 = {
			'type': 'geojson',
			'data': {
				'type': 'Feature',
				'properties': {},
				'geometry' : {
					'type' : 'MultiLineString',
					'coordinates': [
						initialFinalPath[1]
					]	
				}
			}
		}

		// Se já existe um layer e um source com este ID, eles são removidos
		var mapLayer = map.getLayer('routePhase03');

	    if(typeof mapLayer !== 'undefined') {
	    	map.removeLayer('routePhase03').removeSource('routePhase03');
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
function routeTotalDistance(initialFinalPath){

		// Distância percorrida na fase 01 da rota
		var distance = 0;
		for(j = 0; j < initialPath.length - 1; j++){
			if(j != initialPath.length - 1){
				distance += turf.distance(turf.point([initialPath[j][0], initialPath[j][1]]), turf.point([initialPath[j+1][0], initialPath[j+1][1]]));
			}
		}

		// Distância percorrida na fase 02 da rota
		for(j = 0; j < finalDestination.length - 1; j++){
			if(j != finalDestination.length - 1){
				distance += turf.distance(turf.point([finalDestination[j][0], finalDestination[j][1]]), turf.point([finalDestination[j+1][0], finalDestination[j+1][1]]));
			}	
		}

		// Distância percorrida na fase 03 da rota
		for(j = 0; j < initialFinalPath[1].length - 1; j++){
			if(j != initialFinalPath[1].length - 1){
				distance += turf.distance(turf.point([initialFinalPath[1][j][0], initialFinalPath[1][j][1]]), turf.point([initialFinalPath[1][j+1][0], initialFinalPath[1][j+1][1]]));
			}	
		}

		var distanceBox = document.getElementById("calculated-distance");
		distanceBox.innerHTML = distance.toFixed(2) + " Km";
}

var distance = document.getElementById("distance");
var labelDistance = document.getElementById("label-distance");

distance.onchange = function(){
	selectInitialPosition();
	labelDistance.innerHTML = "Distância de " + distance.value + "m";
}	

// ========= CRIANDO O MODAL PARA FORMULÁRIO ========== //

// Acessando o elemento "modal"
var modal = document.getElementById("modal");

// Acessando o botão que aciona o modal
var btn = document.getElementById("btn");

// Acessando o elemento <span> que fecha o modal
//var span = document.getElementsByClassName("close")[0];

// Quando o usuário clica no botão, abre-se o modal
btn.onclick = function() {
	modal.style.display = (modal.style.display == "block") ? "none" : "block";
}

// Quando o usuário clica no elemento <span> (x), fecha o modal
/*span.onclick = function() {
  modal.style.display = "none";
}*/

// Quando o usuário clica em qualquer lugar fora do modal, ele fecha
/*window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}*/

// ========= SALVANDO A ROTA GERADA EM ARQUIVO .TXT ========= //
// Acessando botão que dispara a função para criar um arquivo .txt
var btnSave = document.getElementById("btn-save");

// Atrelando a função ao evento onclick do botão
btnSave.onclick = function(){

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
	content += "0\t1\t0\t16\t0\t0\t0\t0\t" + home[1] + "\t" + home[0] + "\t" + altitude + ".000000" + "\t1\n";

	// TAKEOFF: 22
	content += "1\t0\t0\t22\t0.000000\t0.000000\t0.000000\t0.000000\t" + home[1] + "\t" + home[0] + "\t" + altitude + ".000000" + "\t1\n";

	// CHANGE SPEED: 178
	content += "2\t0\t3\t178\t" + speed + ".000000" + "\t" + speed + ".000000" + "\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n";

	// WAYPOINT: 16 - ROTA INICIAL DA FASE 01
	index = 0;
	console.log(initialPath);
	for(j = 3; j < initialPath.length + 2; j++){
		content += j + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + initialPath[index][1].toFixed(6) + "\t" + initialPath[index][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
		index++;
	}
	//console.log(distance);

	console.log(finalDestination);
	// WAYPOINT: 16 - ROTA DE VAI-E-VOLTA DA FASE 02
	index = 0;
	for(i = j; i < finalDestination.length + j - 1; i++){
		content += i + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + finalDestination[index][1].toFixed(6) + "\t" + finalDestination[index][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
		index++;
	}

	console.log(initialFinalPath[1]);
	// WAYPOINT: 16 - ROTA FINAL DA FASE 03
	index = 0;
	for(j = i; j < initialFinalPath[1].length + i; j++){
		content += j + "\t0\t3\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + initialFinalPath[1][index][1].toFixed(6) + "\t" + initialFinalPath[1][index][0].toFixed(6) + "\t" + altitude + ".000000" + "\t1\n";
		index++;
	}

	// RETURN-T0-LAUNCH: 20
	content += j + "\t0\t3\t20\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1";

	var blob = new Blob([content],
                { type: "text/plain;charset=utf-8" });

	// Nome do arquivo com data em milissegundos decorridos
	fileName = new Date().getTime() + ".txt";
	saveAs(blob, fileName);
}

// ========= SELECIONANDO A POSIÇÃO INICIAL DA COBERTURA ============= //
/*window.onclick = function(event){
	console.log(event);
	console.log(event.pageX);
	console.log(event.pageY);
}*/