import React from 'react';
// Material UI
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
// Custom
//import AxiosApi from '../../../../services/AxiosApi';

export const Dashboard = React.memo(({ ...props }) => {

  React.useEffect(() => {
    props.setPage("DASHBOARD");



  }, []);

  return (
    <>
      <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>

        <Toolbar>
          <Grid container spacing={2}>

            <Grid item xs={12} md={6} lg={6} xl={3}>
              <Card sx={{ minWidth: 200, maxWidth: 450, margin: 'auto' }}>
                <CardContent>
                  <Typography variant="h5" component="div" textAlign="center" mb={1}>
                    <FontAwesomeIcon icon={faUsers} color="green" />
                  </Typography>
                  <Typography variant="h5" component="div" textAlign="center" mb={1}>
                    Usuários
                  </Typography>
                  <Typography variant="h5" component="div" textAlign="center">
                    <CircularProgress />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6} xl={3}>
              <Card sx={{ minWidth: 200, maxWidth: 450, margin: 'auto' }}>
                <CardContent>
                  <Typography variant="h5" component="div" textAlign="center" mb={1}>
                    <FontAwesomeIcon icon={faMap} color="green" />
                  </Typography>
                  <Typography variant="h5" component="div" textAlign="center" mb={1}>
                    Planos de voo
                  </Typography>
                  <Typography variant="h5" component="div" textAlign="center">
                    <CircularProgress />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6} xl={3}>
              <Card sx={{ minWidth: 200, maxWidth: 450, margin: 'auto' }}>
                <CardContent>
                  <Typography variant="h5" component="div" textAlign="center" mb={1}>
                    <FontAwesomeIcon icon={faClipboard} color="green" />
                  </Typography>
                  <Typography variant="h5" component="div" textAlign="center" mb={1}>
                    Ordens de serviço
                  </Typography>
                  <Typography variant="h5" component="div" textAlign="center">
                    <CircularProgress />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6} xl={3}>
              <Card sx={{ minWidth: 200, maxWidth: 450, margin: 'auto' }}>
                <CardContent>
                  <Typography variant="h5" component="div" textAlign="center" mb={1}>
                    <FontAwesomeIcon icon={faChartColumn} color="green" />
                  </Typography>
                  <Typography variant="h5" component="div" textAlign="center" mb={1}>
                    Relatórios
                  </Typography>
                  <Typography variant="h5" component="div" textAlign="center">
                    <CircularProgress />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Toolbar>
      </Paper>
    </>

  )

});