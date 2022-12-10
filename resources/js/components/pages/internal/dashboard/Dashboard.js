import React from 'react';
// Material UI
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';
import { Box } from '@mui/system';
// Custom
import axios from '../../../../services/AxiosApi';
import { usePage } from '../../../context/PageContext.js';

const miniCardStyle = {
    bgcolor: '#fff',
    minWidth: 150,
    minHeight: 150,
    padding: 1,
    display: 'flex',
    flexDirection: 'column'
}

const biggerCardStyle = {
    bgcolor: '#fff',
    padding: 2,
    minHeight: 280,
    display: 'flex',
    flexDirection: 'column'
}

const paperStyle = {
    width: "100%",
    mb: 1,
    backgroundColor: 'transparent',
    boxShadow: 0
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
            <Paper sx={paperStyle}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 0, sm: 1, md: 1 }} columns={{ xs: 10, sm: 10, md: 12, lg: 10, xl: 10 }}>
                    <Grid item xs={10} sm={5} md={4} lg={2}>
                        <Card sx={miniCardStyle}>
                            <Box sx={{ flexBasis: '30px' }}>
                                <Typography variant="h6">
                                    Usuários
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                horizontal line chart
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={10} sm={5} md={4} lg={2}>
                        <Card sx={miniCardStyle}>
                            <Box sx={{ flexBasis: '30px' }}>
                                <Typography variant="h6">
                                    Perfis
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 3 }} lg={2}>
                                horizontal line chart
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={10} sm={5} md={4} lg={2}>
                        <Card sx={miniCardStyle}>
                            <Box sx={{ flexBasis: '30px' }}>
                                <Typography variant="h6">
                                    Planos de voo
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                horizontal line chart
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={10} sm={5} md={4} lg={2}>
                        <Card sx={miniCardStyle}>
                            <Box sx={{ flexBasis: '30px' }}>
                                <Typography variant="h6">
                                    Ordens de serviço
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                horizontal line chart
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={10} sm={5} md={4} lg={2}>
                        <Card sx={miniCardStyle}>
                            <Box sx={{ flexBasis: '30px' }}>
                                <Typography variant="h6">
                                    Relatórios
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                horizontal line chart
                            </Box>
                        </Card>
                    </Grid>
                </Grid >
            </Paper >

            <Paper sx={paperStyle}>
                <Grid container rowSpacing={1} columnSpacing={1} columns={12}>
                    <Grid item xs={12} md={6}>
                        <Card sx={biggerCardStyle}>
                            <Box sx={{ flexBasis: '30px' }}>
                                <Typography variant="h6">
                                    Tráfego anual
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                horizontal line chart
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={biggerCardStyle}>
                            <Box sx={{ flexBasis: '30px' }}>
                                <Typography variant="h6">
                                    Outro
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 3 }} lg={2}>
                                horizontal line chart
                            </Box>
                        </Card>
                    </Grid>
                </Grid >
            </Paper>
        </>

    )

});