import React from 'react';
// Material UI
import { Grid, Card, Typography, LinearProgress, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import GroupIcon from '@mui/icons-material/Group';
import MapIcon from '@mui/icons-material/Map';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
// Custom
import axios from '../../../services/AxiosApi';
import { usePage } from '../../../context/PageContext';
import { VerticalLinesChart } from '../../../components/charts/VerticalLinesChart';

const MiniCardProps = {
    bgcolor: '#fff',
    minWidth: 150,
    minHeight: 110,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0
}

const MiniCardTopProps = {
    flexBasis: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: 1
}

const GridContainerProps = {
    sx: {
        bgcolor: '#333',
        padding: 5
    },
    columns: {
        xs: 10,
        sm: 10,
        md: 12,
        lg: 10,
        xl: 10
    },
    columnSpacing: {
        xs: 0,
        sm: 1,
        md: 1
    },
    rowSpacing: 1
}

export const Dashboard = React.memo(() => {

    // ============================================================================== STATES ============================================================================== //

    const [loading, setLoading] = React.useState(true);
    const [users, setUsers] = React.useState(null);
    const [profiles, setProfiles] = React.useState(null);
    const [flightPlans, setFlightPlans] = React.useState(null);
    const [serviceOrders, setServiceOrders] = React.useState(null);
    const [reports, setReports] = React.useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const { setPageIndex } = usePage();

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {
        console.log('valor do MIX: ' + process.env.MIX_APP_URL);
        setPageIndex(0);
        fetchData();
    }, []);

    function fetchData() {
        axios.get("/api/dashboard-data")
            .then((response) => {
                setUsers(response.data.users);
                setProfiles(response.data.profiles);
                setFlightPlans(response.data.flight_plans);
                setServiceOrders(response.data.service_orders);
                setReports(response.data.reports);
                enqueueSnackbar("Métricas carregadas", { variant: "success" });
            })
            .catch((error) => {
                console.log(error)
                enqueueSnackbar(error.response.data.message, { variant: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // =============================================================== JSX  =============================================================== //

    return (
        <>
            <div>
                <Grid container {...GridContainerProps}>
                    <Grid item xs={10} sm={5} md={4} lg={2} >
                        <Card {...MiniCardProps}>
                            <Box {...MiniCardTopProps}>
                                <Typography variant="h6">
                                    Usuários
                                </Typography>
                                <Typography variant="p" color="green" sx={{ display: "flex", alignItems: 'center' }}>
                                    <GroupIcon sx={{ mr: 1 }} /> {users ? users.total : 0}
                                </Typography>
                            </Box>
                            <Box sx={{ height: 110, width: '100%' }}>
                                {loading && !users && <LinearProgress />}
                                {!loading && users && <VerticalLinesChart data={users} />}
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={10} sm={5} md={4} lg={2}>
                        <Card {...MiniCardProps}>
                            <Box {...MiniCardTopProps}>
                                <Typography variant="h6">
                                    Perfis
                                </Typography>
                                <Typography variant="p" color="green" sx={{ display: "flex", alignItems: 'center' }}>
                                    <AssignmentIndIcon sx={{ mr: 1 }} /> {profiles ? profiles.total : 0}
                                </Typography>
                            </Box>
                            <Box sx={{ height: 110, width: '100%' }}>
                                {loading && !profiles && <LinearProgress />}
                                {!loading && profiles && <VerticalLinesChart data={profiles} />}
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={10} sm={5} md={4} lg={2}>
                        <Card {...MiniCardProps}>
                            <Box {...MiniCardTopProps}>
                                <Typography variant="h6">
                                    Planos de voo
                                </Typography>
                                <Typography variant="p" color="green" sx={{ display: "flex", alignItems: 'center' }}>
                                    <MapIcon sx={{ mr: 1 }} /> {flightPlans ? flightPlans.total : 0}
                                </Typography>
                            </Box>
                            <Box sx={{ height: 110, width: '100%' }}>
                                {loading && !flightPlans && <LinearProgress />}
                                {!loading && flightPlans && <VerticalLinesChart data={flightPlans} />}
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={10} sm={5} md={4} lg={2}>
                        <Card {...MiniCardProps}>
                            <Box {...MiniCardTopProps}>
                                <Typography variant="h6">
                                    Ordens de serviço
                                </Typography>
                                <Typography variant="p" color="green" sx={{ display: "flex", alignItems: 'center' }}>
                                    <AssignmentIcon sx={{ mr: 1 }} /> {serviceOrders ? serviceOrders.total : 0}
                                </Typography>
                            </Box>
                            <Box sx={{ height: 110, width: '100%' }}>
                                {loading && !serviceOrders && <LinearProgress />}
                                {!loading && serviceOrders && <VerticalLinesChart data={serviceOrders} />}
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={10} sm={5} md={4} lg={2}>
                        <Card {...MiniCardProps}>
                            <Box {...MiniCardTopProps}>
                                <Typography variant="h6">
                                    Relatórios
                                </Typography>
                                <Typography variant="p" color="green" sx={{ display: "flex", alignItems: 'center' }}>
                                    <AssessmentIcon sx={{ mr: 1 }} /> {reports ? reports.total : 0}
                                </Typography>
                            </Box>
                            <Box sx={{ height: 110, width: '100%' }}>
                                {loading && !reports && <LinearProgress />}
                                {!loading && reports && <VerticalLinesChart data={reports} />}
                            </Box>
                        </Card>
                    </Grid>
                </Grid >
            </div >
        </>
    )
});