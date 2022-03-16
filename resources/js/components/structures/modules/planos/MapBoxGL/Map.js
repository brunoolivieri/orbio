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

    const mapContainer = useRef(null);

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

        const map = new mapboxgl.Map({
            container: "map-container",
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [lng, lat],
            zoom: zoom,
        });

        map.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
		    mapboxgl: mapboxgl
        }));

        map.addControl(new mapboxgl.FullscreenControl());

        map.addControl(new mapboxgl.NavigationControl());

        map.addControl(draw);

        //mapBuild = new mapboxgl.Marker({color: "#333"}).setLngLat([lng, lat]).addTo(mapBuild);

        map.on('move', () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        })

        map.on('draw.create', updateArea);
        map.on('draw.delete', updateArea);
        map.on('draw.update', updateArea);

        map.on('click', selectInitialPosition);
        map.on('touchstart', selectInitialPosition);

        // clean up on unmount
        return () => map.remove();

    });

    function updateArea(event){

        console.log("UPDATE_AREA")

    }

    function selectInitialPosition(){

        console.log("SELECT_INITIAL")

    }
 
    return (
    <>
        
        <div 
        ref={mapContainer} 
        id="map-container" 
        className="map-container" 
        style={{width: "100%", height: "100%"}}
        />
    </>
    );
}