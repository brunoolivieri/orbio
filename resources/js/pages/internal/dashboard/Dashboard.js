import React from 'react';
import { Grid, Card, Box, Avatar, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { useSnackbar } from 'notistack';
import GroupIcon from '@mui/icons-material/Group';
import MapIcon from '@mui/icons-material/Map';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import axios from '../../../services/AxiosApi';
import { usePage } from '../../../context/PageContext';

const MiniCardProps = {
    bgcolor: '#fff',
    minHeight: 200,
    borderRadius: 2,
    padding: 2,
    display: "flex",
    flexDirection: "column",
    cursor: "pointer"
}

const MiniCardTopProps = {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}

const MiniCardTotalProps = {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "start"
}

const MiniCardBottomProps = {
    flexBasis: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "start"
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

        setLoading(true);

        axios.get("/api/module/dashboard")
            .then((response) => {

                setUsers(response.data.users);
                setProfiles(response.data.profiles);
                setFlightPlans(response.data.flight_plans);
                setServiceOrders(response.data.service_orders);
                setReports(response.data.reports);

                enqueueSnackbar("Métricas carregadas", { variant: "success" });
            })
            .catch((error) => {
                console.log(error.message)
                enqueueSnackbar(error.response.data.message, { variant: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // =============================================================== JSX  =============================================================== //

    return (
        <Grid container columns={{ xs: 10, sm: 10, md: 10, lg: 6, xl: 10 }} spacing={2} paddingY={5} paddingX={5} bgcolor={"#333"}>
            <Grid item xs={10} sm={5} lg={2} >
                <Card sx={MiniCardProps}>
                    <Box sx={MiniCardTopProps}>
                        <Avatar sx={{ bgcolor: green[500], width: 60, height: 60 }}>
                            <GroupIcon />
                        </Avatar>
                    </Box>
                    <Box sx={MiniCardTotalProps}>
                        <Typography variant="h6">
                            {loading ? 0 : users.total} usuários
                        </Typography>
                    </Box>
                    <Box sx={MiniCardBottomProps}>
                        Ativos: {loading ? 0 : users.active} | Inativos: {loading ? 0 : users.inative} | Deletados: {loading ? 0 : users.deleted}
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={10} sm={5} lg={2}>
                <Card sx={MiniCardProps}>
                    <Box sx={MiniCardTopProps}>
                        <Avatar sx={{ bgcolor: green[500], width: 60, height: 60 }}>
                            <AssignmentIndIcon />
                        </Avatar>
                    </Box>
                    <Box sx={MiniCardTotalProps}>
                        <Typography variant="h6">
                            {loading ? 0 : profiles.total} perfis
                        </Typography>
                    </Box>
                    <Box sx={MiniCardBottomProps}>
                        Ativos: {loading ? 0 : profiles.active} | Inativos: {loading ? 0 : profiles.deleted}
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={10} sm={5} lg={2}>
                <Card sx={MiniCardProps}>
                    <Box sx={MiniCardTopProps}>
                        <Avatar sx={{ bgcolor: green[500], width: 60, height: 60 }}>
                            <MapIcon />
                        </Avatar>
                    </Box>
                    <Box sx={MiniCardTotalProps}>
                        <Typography variant="h6">
                            {loading ? 0 : flightPlans.total} planos
                        </Typography>
                    </Box>
                    <Box sx={MiniCardBottomProps}>
                        Ativos: {loading ? 0 : flightPlans.active} | Inativos: {loading ? 0 : flightPlans.deleted}
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={10} sm={5} lg={2}>
                <Card sx={MiniCardProps}>
                    <Box sx={MiniCardTopProps}>
                        <Avatar sx={{ bgcolor: green[500], width: 60, height: 60 }}>
                            <AssignmentIcon />
                        </Avatar>
                    </Box>
                    <Box sx={MiniCardTotalProps}>
                        <Typography variant="h6">
                            {loading ? 0 : serviceOrders.total} ordens
                        </Typography>
                    </Box>
                    <Box sx={MiniCardBottomProps}>
                        Ativos: {loading ? 0 : serviceOrders.active} | Inativos: {loading ? 0 : serviceOrders.deleted}
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={10} sm={5} lg={2}>
                <Card sx={MiniCardProps}>
                    <Box sx={MiniCardTopProps}>
                        <Avatar sx={{ bgcolor: green[500], width: 60, height: 60 }}>
                            <AssessmentIcon />
                        </Avatar>
                    </Box>
                    <Box sx={MiniCardTotalProps}>
                        <Typography variant="h6">
                            {loading ? 0 : reports.total} relatórios
                        </Typography>
                    </Box>
                    <Box sx={MiniCardBottomProps}>
                        Ativos: {loading ? 0 : reports.active} | Inativos: {loading ? 0 : reports.deleted}
                    </Box>
                </Card>
            </Grid>
        </Grid >
    )
});