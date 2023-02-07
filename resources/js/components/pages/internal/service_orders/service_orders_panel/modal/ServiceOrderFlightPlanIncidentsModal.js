import * as React from 'react';
// Material UI
import { Tooltip, IconButton } from "@mui/material";
import ReportIcon from '@mui/icons-material/Report';

export function ServiceOrderFlightPlanIncidentsModal() {

    function handleOpen() {
        console.log('open');
    }

    function handleClose() {
        console.log('close');
    }

    return (
        <Tooltip title="Selecionar incidentes">
            <IconButton onClick={handleOpen}>
                <ReportIcon />
            </IconButton>
        </Tooltip>
    )
}