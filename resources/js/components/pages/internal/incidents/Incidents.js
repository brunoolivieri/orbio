import React from 'react';
// Material UI
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";
// Custom
import { IncidentsPanel } from './incidents_panel/IncidentsPanel';

export const Incidents = React.memo(({...props}) => {

  React.useEffect(() => {
    props.setPage("INCIDENTES");
  },[]);

  return (
    <>
      <Paper sx={{ maxWidth: "95%", margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">
          <IncidentsPanel />
        </Box>
      </Paper>
    </>
  );

});