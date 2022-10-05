
import * as React from 'react';
// Material UI
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";
// Custom
import { FlightPlansPanel } from "./flight_plans_panel/FlightPlansPanel";
import { usePage } from '../../../context/PageContext';

export const FlightPlans = React.memo(() => {

  const { setPageIndex } = usePage();

  React.useEffect(() => {
    setPageIndex(2);
  }, []);

  return (
    <Paper sx={{ maxWidth: "95%", margin: 'auto', overflow: 'hidden' }}>
      <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

        <FlightPlansPanel />

      </Box>
    </Paper>
  )

});