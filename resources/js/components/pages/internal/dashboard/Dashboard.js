import React from 'react';
// Material UI
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';
import { Box } from '@mui/system';
import CardHeader from '@mui/material/CardHeader';
import { Divider } from '@mui/material';
import { CardActions } from '@mui/material';
// React Chart
import { LinesChart } from '../../../structures/charts/LinesChart.js';
import { PizzaChart } from '../../../structures/charts/PizzaChart.js';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faIdCardClip } from '@fortawesome/free-solid-svg-icons';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
// Custom
import AxiosApi from '../../../../services/AxiosApi';
import { usePage } from '../../../context/PageContext.js';

const CardStyle = {
  minWidth: "100%",
  maxWidth: "100%",
  margin: 'auto',
  borderRadius: 0
}

const CardContentStyle = {
  bgcolor: '#fff'
}

const paperStyle = {
  maxWidth: "95%",
  margin: 'auto',
  overflow: 'visible',
  padding: 1,
  mt: 2,
  boxShadow: 0,
  bgcolor: 'transparent'
}

export const Dashboard = React.memo(() => {

  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState({ total: 0, chart: [{}] });
  const [profiles, setProfiles] = React.useState({ total: 0, chart: [{}] });
  const [flightPlans, setFlightPlans] = React.useState({ total: 0, chart: [{}] });
  const [serviceOrders, setServiceOrders] = React.useState({ total: 0, chart: [{}] });
  const [reports, setReports] = React.useState({ total: 0, chart: [{}] });
  const [registrations, setRegistrations] = React.useState([{}]);
  const [devices, setDevices] = React.useState([{}]);
  const [traffic, setTraffic] = React.useState([{}]);

  // Context do snackbar
  const { enqueueSnackbar } = useSnackbar();

  // Context page
  const { setPageIndex } = usePage();

  React.useEffect(() => {

    setPageIndex(0);

    AxiosApi.get("/api/load-dashboard-metrics")
      .then(function (response) {

        setLoading(false);

        setUsers({
          total: response.data.users.total,
          chart: response.data.users.chart
        });

        setProfiles({
          total: response.data.profiles.total,
          chart: response.data.profiles.chart
        });

        setFlightPlans({
          total: response.data.flight_plans.total,
          chart: response.data.flight_plans.chart
        });

        setServiceOrders({
          total: response.data.service_orders.total,
          chart: response.data.service_orders.chart
        });

        setReports({
          total: response.data.reports.total,
          chart: response.data.reports.chart
        });

        setDevices({
          total: response.data.devices.total,
          chart: response.data.devices.chart
        });

        setTraffic(response.data.traffic);

        setRegistrations(response.data.registrations);

        handleOpenSnackbar("Métricas carregadas", "success");

      })
      .catch(function (error) {

        console.log(error)

        const error_message = error.response.data.message ? error.response.data.message : "Erro do servidor";
        handleOpenSnackbar(error_message, "error");

        setLoading(false);

      });

  }, []);

  function handleOpenSnackbar(text, variant) {
    enqueueSnackbar(text, { variant });
  }

  return (
    <>

      <Paper sx={paperStyle}>

        <Toolbar>
          <Grid container spacing={1} columns={10}>

            <Grid item xs={10} md={5} lg={5} xl={2}>
              <Card sx={CardStyle}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faUsers} color="green" size='2x' />}
                  title={<Typography variant="h6">Usuários</Typography>}
                />
                <Divider />
                <CardContent sx={CardContentStyle}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={users.chart} total={users.total} />}
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  labels
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={10} md={5} lg={5} xl={2}>
              <Card sx={CardStyle}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faIdCardClip} color="green" size='2x' />}
                  title={<Typography variant="h6">Perfis</Typography>}
                />
                <Divider />
                <CardContent sx={CardContentStyle}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={profiles.chart} total={profiles.total} />}
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  labels
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={10} md={5} lg={5} xl={2}>
              <Card sx={CardStyle}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faMap} color="green" size='2x' />}
                  title={<Typography variant="h6">Planos de voo</Typography>}
                />
                <Divider />
                <CardContent sx={CardContentStyle}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={flightPlans.chart} total={flightPlans.total} />}
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  labels
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={10} md={5} lg={5} xl={2}>
              <Card sx={CardStyle}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faClipboard} color="green" size='2x' />}
                  title={<Typography variant="h6">Ordens de serviço</Typography>}
                />
                <Divider />
                <CardContent sx={CardContentStyle}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={serviceOrders.chart} total={serviceOrders.total} />}
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  labels
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={10} md={5} lg={5} xl={2}>
              <Card sx={CardStyle}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faChartColumn} color="green" size='2x' />}
                  title={<Typography variant="h6">Relatórios</Typography>}
                />
                <Divider />
                <CardContent sx={CardContentStyle}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={reports.chart} total={reports.total} />}
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  labels
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={10} sx={{ mt: 1 }}>
              <Typography variant="h6">Tráfego Anual</Typography>
              <Grid container>
                <Grid item xs={12} sx={{ height: 300 }}>
                  {!loading && <LinesChart data={traffic} />}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={10} sx={{ mt: 1 }}>
              <Typography variant="h6">Novos usuários</Typography>
              <Grid container>
                <Grid item xs={12} sx={{ height: 300 }}>
                  {!loading && <LinesChart data={registrations} />}
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </Toolbar>
      </Paper>

      {
        /*  <Paper sx={lastSectionStyle}>
          <Typography variant="h5">Novos usuários</Typography>
          <Grid container>
            <Grid item xs={12} sx={{ height: 350 }}>
              {!loading && <LinesChart data={registrations} />}
            </Grid>
          </Grid>
        </Paper> 
      */
      }
    </>

  )

});