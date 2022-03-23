import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import * as turf from "@turf/turf";

import React, { useRef, useEffect, useState} from 'react';
import { ConstructionOutlined } from '@mui/icons-material';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

import style from "./map.module.css";
 
mapboxgl.accessToken = 'pk.eyJ1IjoidGF1YWNhYnJlaXJhIiwiYSI6ImNrcHgxcG9jeTFneWgydnM0cjE3OHQ2MDIifQ.saPpiLcsBQnqVlRrQrcCIQ';

export const Map = React.memo(({...props}) => {

    const mapContainer = useRef(null);
    const mapRef = useRef(null);

    const [areaCalculation, setAreaCalculation] = useState();
    const [distanceCalculation, setDistanceCalculation] = useState();
    const [timeCalculation, setTimeCalculation] = useState();

    const [lng, setLng] = useState(-47.926063);
    const [lat, setLat] = useState(-15.841060);
    const [zoom, setZoom] = useState(15);

    const [draw, setDraw] = useState(new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true
        },
        defaultMode: 'draw_polygon'
    }));
 
    useEffect(() => {

        if(mapRef.current) return;

        const mapBuilder = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [lng, lat],
        zoom: zoom,
        })

        mapBuilder.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
		    mapboxgl: mapboxgl
        }));

        mapBuilder.addControl(new mapboxgl.FullscreenControl());

        mapBuilder.addControl(new mapboxgl.NavigationControl());

        mapBuilder.addControl(draw);

        mapBuilder.on('move', () => {
            setLng(mapBuilder.getCenter().lng.toFixed(4));
            setLat(mapBuilder.getCenter().lat.toFixed(4));
            setZoom(mapBuilder.getZoom().toFixed(2));
        })

        mapBuilder.on('draw.create', updateArea);
        mapBuilder.on('draw.delete', updateArea);
        mapBuilder.on('draw.update', updateArea);

        mapBuilder.on('click', selectInitialPosition);
        mapBuilder.on('touchstart', selectInitialPosition);
        
        mapRef.current = mapBuilder;

        mapRef.current = new mapboxgl.Marker({color: "#333"}).setLngLat([lng, lat]).addTo(mapRef.current);

    });

    function updateArea(event){

        const data = draw.getAll();

        if (data.features.length > 0) {

            const area = turf.area(data);
            
            const rounded_area = (Math.round(area * 100) / 100) / 10000;

            setAreaCalculation(rounded_area.toFixed(2));

        } else {

        if (event.type !== 'draw.delete')

            setAreaCalculation(null);

        }

    }

    function selectInitialPosition(){

        console.log("SELECT_INITIAL")

    }
 
    return (
    <>
        
    <Box
    ref={mapContainer} 
    id="map-container" 
    className="map-container" 
    style={{width: "100%", height: "100%"}}
    /> 

    <Box className={style.box_calculation}>
        <span id="calculated-area">{areaCalculation} ha</span> | 
        <span id="calculated-distance">{distanceCalculation} Km</span> | 
        <span id="calculated-time">{timeCalculation} s</span>
    </Box>

    <Box sx={{ width: '100%' }} className={style.map_footer}>

        <Stack direction = {"row"} spacing={1}>
            <Button sx={{backgroundColor: "#fff"}}>Missão</Button>
            <Button sx={{backgroundColor: "#fff"}}>Configuração</Button>
        </Stack>

        <Stack direction = {"row"} spacing={1}>
            <Button onClick={() => {props.close_modal()}} sx={{backgroundColor: "#fff"}}>Cancelar</Button>
            <Button onClick={() => {props.generate_plan()}} sx={{backgroundColor: "#fff"}}>Gerar plano</Button>
        </Stack>

    </Box>

    </>
    );
    
});