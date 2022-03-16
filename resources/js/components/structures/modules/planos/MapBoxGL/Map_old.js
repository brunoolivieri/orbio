import { Box } from '@mui/system';

import React, { useRef, useEffect, useState} from 'react';

import ReactMap, {NavigationControl, FullscreenControl, GeolocateControl, AttributionControl, Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidGF1YWNhYnJlaXJhIiwiYSI6ImNrcHgxcG9jeTFneWgydnM0cjE3OHQ2MDIifQ.saPpiLcsBQnqVlRrQrcCIQ';

export const Map = React.memo(({...props}) => {

    const [viewState, setViewState] = React.useState({
        longitude: -47.926063,
        latitude: -15.841060,
        zoom: 15
    });

    return(
            <>
                <ReactMap
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/satellite-v9"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    width="100%"
                    height="100%"
                >
                    <FullscreenControl />
                    <NavigationControl />
                    <GeolocateControl />
                    <Marker longitude={-47.926063} latitude={-15.841060} anchor="bottom" color={"#333"} />
                </ReactMap>
            </> 
    );
});
