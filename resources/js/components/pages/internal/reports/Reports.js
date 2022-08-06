import * as React from 'react';
// Material UI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Box } from "@mui/system";
import PostAddIcon from '@mui/icons-material/PostAdd';
// Custom
import { ReportsPanel } from "./reports_panel/ReportsPanel";

export const Reports = React.memo(({ ...props }) => {

  React.useEffect(() => {
    props.setPage("RELATÓRIOS");
  }, []);

  return (
    <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
      <Box sx={{ my: 5, mx: 2 }} color="text.secondary">

        <ReportsPanel />

      </Box>
    </Paper>
  )

});