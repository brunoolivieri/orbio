import * as React from 'react';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoidGF1YWNhYnJlaXJhIiwiYSI6ImNrcHgxcG9jeTFneWgydnM0cjE3OHQ2MDIifQ.saPpiLcsBQnqVlRrQrcCIQ';

export function MapBox() {

    const mapContainer = React.useRef(null);
    const map = React.useRef(null);

    const [lng, setLng] = React.useState(-47.926063);
    const [lat, setLat] = React.useState(-15.841060);
    const [zoom, setZoom] = React.useState(15);

    React.useEffect(() => {

        if (map.current) return; // initialize map only once

        const mapBuilder = new mapboxgl.Map({
            container: mapContainer.ref,
            style: 'mapbox://styles/mapbox/satellite-v9',
            zoom: zoom,
            center: [lng, lat]
        });

        mapBuilder.on('move', () => {
            setLng(mapBuilder.getCenter().lng.toFixed(4));
            setLat(mapBuilder.getCenter().lat.toFixed(4));
            setZoom(mapBuilder.getZoom().toFixed(2));
        })

        mapBuilder.addControl(new mapboxgl.NavigationControl());

        map.current = mapBuilder;

        map.current = new mapboxgl.Marker({ color: "#333" }).setLngLat([lng, lat]).addTo(map.current);

    });

    return (
        <>
            <div ref={mapContainer} className="map" style={{ width: "100%", height: "100%" }}>
            </div>
        </>
    );

}