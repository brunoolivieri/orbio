import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import React, { useRef, useEffect, useState} from 'react';
 
mapboxgl.accessToken = 'pk.eyJ1IjoidGF1YWNhYnJlaXJhIiwiYSI6ImNrcHgxcG9jeTFneWgydnM0cjE3OHQ2MDIifQ.saPpiLcsBQnqVlRrQrcCIQ';

export function Map_(){

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-47.926063);
    const [lat, setLat] = useState(-15.841060);
    const [zoom, setZoom] = useState(11);
 
    useEffect(() => {

        if (map.current) return; // initialize map only once

        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [lng, lat],
        zoom: zoom
        });

        //map.current = new mapboxgl.addControl(new mapboxgl.FullscreenControl());
       
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