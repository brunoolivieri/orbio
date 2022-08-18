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
// React Chart
import { LinesChart } from '../../../structures/charts/LinesChart.js';
import { PizzaChart } from '../../../structures/charts/PizzaChart.js';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
// Custom
import AxiosApi from '../../../../services/AxiosApi';

export const Dashboard = React.memo(({ ...props }) => {

  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState({ total: 0, chart: [{}] });
  const [flightPlans, setFlightPlans] = React.useState({ total: 0, chart: [{}] });
  const [serviceOrders, setServiceOrders] = React.useState({ total: 0, chart: [{}] });
  const [reports, setReports] = React.useState({ total: 0, chart: [{}] });

  // Context do snackbar
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    props.setPage("DASHBOARD");

    AxiosApi.get("/api/load-dashboard-metrics")
      .then(function (response) {

        setLoading(false);

        setUsers({
          total: response.data.users.total,
          chart: [
            {
              "id": "Ativos",
              "label": "Ativos",
              "value": response.data.users.active
            },
            {
              "id": "Inativos",
              "label": "Inativos",
              "value": response.data.users.inactive
            }
          ]
        });

        setFlightPlans({
          total: response.data.flight_plans.total,
          chart: [{}]
        });

        setServiceOrders({
          total: response.data.service_orders.total,
          chart: [{}]
        });

        setReports({
          total: response.data.reports.total,
          chart: [{}]
        });

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
      <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', padding: 1, borderRadius: 5, boxShadow: 0, bgcolor: 'transparent' }}>

        <Toolbar>
          <Grid container spacing={2}>

            <Grid item xs={12} md={6} lg={6} xl={3}>
              <Card sx={{ minWidth: 200, maxWidth: 450, margin: 'auto' }}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faUsers} color="green" size='2x' />}
                  title={<Typography variant="h6">Usuários</Typography>}
                  subheader={"Total: " + users.total}
                />
                <Divider />
                <CardContent sx={{ bgcolor: '#333' }}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={users.chart} />}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6} xl={3}>
              <Card sx={{ minWidth: 200, maxWidth: 450, margin: 'auto' }}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faMap} color="green" size='2x' />}
                  title={<Typography variant="h6">Planos de voo</Typography>}
                  subheader={"Total: " + flightPlans.total}
                />
                <Divider />
                <CardContent sx={{ bgcolor: '#333' }}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={flightPlans.chart} />}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6} xl={3}>
              <Card sx={{ minWidth: 200, maxWidth: 450, margin: 'auto' }}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faClipboard} color="green" size='2x' />}
                  title={<Typography variant="h6">Ordens de serviço</Typography>}
                  subheader={"Total: " + serviceOrders.total}
                />
                <Divider />
                <CardContent sx={{ bgcolor: '#333' }}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={serviceOrders.chart} />}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6} xl={3}>
              <Card sx={{ minWidth: 200, maxWidth: 450, margin: 'auto' }}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faChartColumn} color="green" size='2x' />}
                  title={<Typography variant="h6">Relatórios</Typography>}
                  subheader={"Total: " + reports.total}
                />
                <Divider />
                <CardContent sx={{ bgcolor: '#333' }}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={reports.chart} />}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Toolbar>
      </Paper>

      <Paper sx={{ maxWidth: "90%", margin: 'auto', padding: 3, overflow: 'hidden', borderRadius: 5, mt: 3, bgcolor: "#333" }}>

        <Grid container>
          <Grid item xs={12}>
            <LinesChart />
          </Grid>
        </Grid>

      </Paper>
    </>

  )

});