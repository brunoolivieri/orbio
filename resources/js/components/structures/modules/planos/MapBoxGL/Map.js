import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'


import React, { useRef, useEffect, useState} from 'react';
 
mapboxgl.accessToken = 'pk.eyJ1IjoidGF1YWNhYnJlaXJhIiwiYSI6ImNrcHgxcG9jeTFneWgydnM0cjE3OHQ2MDIifQ.saPpiLcsBQnqVlRrQrcCIQ';

export function Map(){

    console.log(mapboxgl)

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-47.926063);
    const [lat, setLat] = useState(-15.841060);
    const [zoom, setZoom] = useState(15);
 
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

        map.current.addControl(
            new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true
                },
                defaultMode: 'draw_polygon'
            })
        );

        map.current = new mapboxgl.Marker({color: "#333"}).setLngLat([lng, lat]).addTo(map.current);


       
    });
    
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
        });
    });
 
    return (
    <>
        <div 
        ref={mapContainer} 
        className="map-container" 
        style={{width: "100%", height: "100%"}}
        />
    </>
    );
}