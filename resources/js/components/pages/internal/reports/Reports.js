import * as React from 'react';
// Material UI
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";
// Custom
import { ReportsPanel } from "./reports_panel/ReportsPanel";
import { usePage } from '../../../context/PageContext';

export const Reports = React.memo(() => {

  const { setPage } = usePage();

  React.useEffect(() => {
    setPage("RELATÓRIOS");
  }, []);

  return (
    <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
      <Box sx={{ my: 5, mx: 2 }} color="text.secondary">

        <ReportsPanel />

      </Box>
    </Paper>
  )

});