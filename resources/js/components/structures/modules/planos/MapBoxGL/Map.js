import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import * as turf from "@turf/turf";

import React, { useRef, useEffect, useState} from 'react';
 
mapboxgl.accessToken = 'pk.eyJ1IjoidGF1YWNhYnJlaXJhIiwiYSI6ImNrcHgxcG9jeTFneWgydnM0cjE3OHQ2MDIifQ.saPpiLcsBQnqVlRrQrcCIQ';

export function Map(){

    console.log(turf)

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-47.926063);
    const [lat, setLat] = useState(-15.841060);
    const [zoom, setZoom] = useState(15);

    const [draw, setDraw] = useState(
        new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            },
            defaultMode: 'draw_polygon'
        })
    );
 
    useEffect(() => {

        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [lng, lat],
        zoom: zoom,
        })

        map.current.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
		    mapboxgl: mapboxgl
        }));

        map.current.addControl(new mapboxgl.FullscreenControl());

        map.current.addControl(new mapboxgl.NavigationControl());

        map.current.addControl(draw);

        map.current = new mapboxgl.Marker({color: "#333"}).setLngLat([lng, lat]).addTo(map.current);

    },[]);

    useEffect(() => {

    },[draw])
    
    useEffect(() => {

        if (!map.current) return; // wait for map to initialize

        map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
        });

    });

    function updateArea(event){

        console.log("UPDATE_AREA")

        const data = draw.getAll();
        const answer = document.getElementById('calculated-area');
        if (data.features.length > 0) {
        const area = turf.area(data);
        // Restrict the area to 2 decimal points.
        const rounded_area = Math.round(area * 100) / 100;
        answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
        } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete')
        alert('Click the map to draw a polygon.');
        }

    }

    function selectInitialPosition(){

        console.log("SELECT_INITIAL")

    }
 
    return (
    <>
        
        <div 
        ref={mapContainer} 
        className="map-container" 
        style={{width: "100%", height: "100%"}}
        onClick={selectInitialPosition}
        onTouchStart={selectInitialPosition}
        />
    </>
    );
}