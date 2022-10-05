import React from 'react';
// Material UI
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";
// Custom
import { IncidentsPanel } from './incidents_panel/IncidentsPanel';
import { usePage } from '../../../context/PageContext';

export const Incidents = React.memo(() => {

  const { setPageIndex } = usePage();

  React.useEffect(() => {
    setPageIndex(5);
  }, []);

  return (
    <>
      <Paper sx={{ maxWidth: "95%", margin: 'auto', overflow: 'hidden' }}>
        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">
          <IncidentsPanel />
        </Box>
      </Paper>
    </>
  );

});