
import * as React from 'react';
// Material UI
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";
// Custom
import { PlansPanel } from "./plans_panel/PlansPanel";

export const Plans = React.memo(({ ...props }) => {

  React.useEffect(() => {
    props.setPage("PLANOS DE VOO");
  }, []);

  return (
    <Paper sx={{ maxWidth: "95%", margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
      <Box sx={{ my: 5, mx: 2 }} color="text.secondary">

        <PlansPanel />

      </Box>
    </Paper>
  )

});