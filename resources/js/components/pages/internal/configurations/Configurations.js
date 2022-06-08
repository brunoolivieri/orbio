import * as React from 'react';
// Material UI
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export function Configurations({...props}) {

  React.useEffect(() => {
    props.setPage("CONFIGURAÇÕES");
  },[]);

  return (
    <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: "10px" }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
      </AppBar>
      <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">

        CONFIGURAÇÕES

      </Typography>
    </Paper>
  )
}