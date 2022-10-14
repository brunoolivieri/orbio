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
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { Divider } from '@mui/material';
import { CardActions } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
// React Chart
import { LinesChart } from '../../../structures/charts/LinesChart.js';
import { PizzaChart } from '../../../structures/charts/PizzaChart.js';
// Custom
import AxiosApi from '../../../../services/AxiosApi';
import { usePage } from '../../../context/PageContext.js';

const CardStyle = {
    bgcolor: '#fff',
    minWidth: 200,
    minHeight: 200,
    padding: 1,
    display: 'flex',
    flexDirection: 'column'
}

export const Dashboard = React.memo(() => {

    const theme = useTheme();

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

        /*AxiosApi.get("/api/load-dashboard-metrics")
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
            */

    }, []); 275

    function handleOpenSnackbar(text, variant) {
        enqueueSnackbar(text, { variant });
    }

    return (
        <>
            <Paper sx={{ width: "100%", backgroundColor: 'transparent', boxShadow: 0 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 0, sm: 1, md: 1 }} columns={12}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={CardStyle}>
                            <Box bgcolor={'red'} sx={{ flexBasis: '40px' }}>
                                <Typography variant="h6">
                                    Usuários
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                horizontal line chart
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={CardStyle}>
                            <Box bgcolor={'red'} sx={{ flexBasis: '40px' }}>
                                <Typography variant="h6">
                                    Perfis
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 3 }}>
                                horizontal line chart
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={CardStyle}>
                            <Box bgcolor={'red'} sx={{ flexBasis: '40px' }}>
                                <Typography variant="h6">
                                    Planos de voo
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                horizontal line chart
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={CardStyle}>
                            <Box bgcolor={'red'} sx={{ flexBasis: '40px' }}>
                                <Typography variant="h6">
                                    Ordens de serviço
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                horizontal line chart
                            </Box>
                        </Card>
                    </Grid>
                </Grid >
            </Paper >

            <Paper sx={{ width: "100%", backgroundColor: '#fff', mt: 1 }}>
                <Grid container>
                    <Grid item xs={12} lg={6} bgcolor={"red"}>
                        chart
                    </Grid>
                    <Grid item xs={12} lg={6} bgcolor={"green"}>
                        chart
                    </Grid>
                </Grid>
            </Paper>
        </>

    )

});