// React
import * as React from 'react';
// Material UI
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
// Custom
import { usePage } from '../../../context/PageContext';

export const Support = React.memo(() => {

  const { setPage } = usePage();

  React.useEffect(() => {
    setPage("SUPORTE");
  }, []);

  return (

    <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
      </AppBar>
      <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">

        PÁGINA DE SUPORTE AO USUÁRIO

      </Typography>
    </Paper>
  )

});