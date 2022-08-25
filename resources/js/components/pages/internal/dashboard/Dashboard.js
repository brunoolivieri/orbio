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

const CardStyle = {
  minWidth: 220,
  maxWidth: 450,
  margin: 'auto',
  borderRadius: 5,
  boxShadow: 1
}

const CardContentStyle = {
  bgcolor: '#F7F7F7'
}

const topSectionStyle = {
  maxWidth: { xs: "95%", md: "90%", lg: "85%", xl: "85%" },
  margin: 'auto',
  overflow: 'visible',
  padding: 3,
  borderRadius: 5,
  mt: 10,
  bgcolor: '#0275D8',
  boxShadow: 1
}

const middleSectionStyle = {
  display: { xs: "none", md: "block", lg: "block", xl: "block" },
  maxWidth: "90%",
  margin: 'auto',
  padding: 3,
  overflow: 'hidden',
  borderRadius: 5,
  mt: 3
}

export const Dashboard = React.memo(({ ...props }) => {

  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState({ total: 0, chart: [{}] });
  const [flightPlans, setFlightPlans] = React.useState({ total: 0, chart: [{}] });
  const [serviceOrders, setServiceOrders] = React.useState({ total: 0, chart: [{}] });
  const [reports, setReports] = React.useState({ total: 0, chart: [{}] });
  const [registrations, setRegistrations] = React.useState([{}]);
  const [logins, setLogins] = React.useState([{}]);

  // Context do snackbar
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    props.setPage("DASHBOARD");

    AxiosApi.get("/api/load-dashboard-metrics")
      .then(function (response) {

        setLoading(false);

        setUsers({
          total: response.data.users.total,
          chart: response.data.users.chart
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

        setRegistrations(response.data.registrations);

        setLogins(response.data.logins);

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
      <Paper sx={topSectionStyle}>

        <Toolbar>
          <Grid container spacing={2} sx={{ mt: -10 }}>

            <Grid item xs={12} md={6} lg={6} xl={3}>
              <Card sx={CardStyle}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faUsers} color="green" size='2x' />}
                  title={<Typography variant="h6">Usuários</Typography>}
                  subheader={"Total: " + users.total}
                />
                <Divider />
                <CardContent sx={CardContentStyle}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={users.chart} />}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6} xl={3}>
              <Card sx={CardStyle}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faMap} color="green" size='2x' />}
                  title={<Typography variant="h6">Planos de voo</Typography>}
                  subheader={"Total: " + flightPlans.total}
                />
                <Divider />
                <CardContent sx={CardContentStyle}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={flightPlans.chart} />}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6} xl={3}>
              <Card sx={CardStyle}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faClipboard} color="green" size='2x' />}
                  title={<Typography variant="h6">Ordens de serviço</Typography>}
                  subheader={"Total: " + serviceOrders.total}
                />
                <Divider />
                <CardContent sx={CardContentStyle}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={serviceOrders.chart} />}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6} xl={3}>
              <Card sx={CardStyle}>
                <CardHeader
                  avatar={<FontAwesomeIcon icon={faChartColumn} color="green" size='2x' />}
                  title={<Typography variant="h6">Relatórios</Typography>}
                  subheader={"Total: " + reports.total}
                />
                <Divider />
                <CardContent sx={CardContentStyle}>
                  <Box width={'100%'} textAlign="center">
                    {loading ? <CircularProgress /> : <PizzaChart data={reports.chart} />}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Toolbar>
      </Paper>

      <Paper sx={middleSectionStyle}>
        <Typography variant="h5">Tráfego diário</Typography>
        <Grid container>
          <Grid item xs={12} sx={{ height: 350 }}>
            {!loading && <LinesChart data={logins} />}
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={middleSectionStyle}>
        <Typography variant="h5">Novos usuários</Typography>
        <Grid container>
          <Grid item xs={12} sx={{ height: 350 }}>
            {!loading && <LinesChart data={registrations} />}
          </Grid>
        </Grid>
      </Paper>
    </>

  )

});