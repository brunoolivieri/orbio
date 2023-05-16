import React from 'react';
import { useSnackbar } from 'notistack';
import GroupIcon from '@mui/icons-material/Group';
import MapIcon from '@mui/icons-material/Map';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import axios from '../../../services/AxiosApi';
import { usePage } from '../../../context/PageContext';
import { DashboardCard } from '../../../components/card/DashboardCard';
import { useAuth } from '../../../context/Auth';

const initialItem = { total: 0, data: null }

export const Dashboard = React.memo(() => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    const [loading, setLoading] = React.useState(true);
    const [users, setUsers] = React.useState(initialItem);
    const [profiles, setProfiles] = React.useState(initialItem);
    const [flightPlans, setFlightPlans] = React.useState(initialItem);
    const [serviceOrders, setServiceOrders] = React.useState(initialItem);
    const [reports, setReports] = React.useState(initialItem);
    const { enqueueSnackbar } = useSnackbar();
    const { setPageIndex } = usePage();

    const authorization = {
        users: !!user.user_powers["1"].profile_powers.read,
        profiles: !!user.user_powers["1"].profile_powers.read,
        flight_plans: !!user.user_powers["2"].profile_powers.read,
        service_orders: !!user.user_powers["3"].profile_powers.read,
        reports: !!user.user_powers["4"].profile_powers.read
    }

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {
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
        <div className='flex justify-center items-start flex-wrap gap-2 p-10'>
            {authorization.service_orders && <DashboardCard title={"Ordens de serviço"} total={serviceOrders.total} loading={loading} data={serviceOrders.data} icon={<AssignmentIcon className='text-green-600' />} />}
            {authorization.users && <DashboardCard title={"Usuários"} total={users.total} loading={loading} data={users.data} icon={<GroupIcon className='text-green-600' />} />}
            {authorization.profiles && <DashboardCard title={"Perfis"} total={profiles.total} loading={loading} data={profiles.data} icon={<AssignmentIndIcon className='text-green-600' />} />}
            {authorization.flight_plans && <DashboardCard title={"Planos de voo"} total={flightPlans.total} loading={loading} data={flightPlans.data} icon={<MapIcon className='text-green-600' />} />}
            {authorization.reports && <DashboardCard title={"Relatórios"} total={reports.total} loading={loading} data={reports.data} icon={<AssessmentIcon className='text-green-600' />} />}
        </div>
    )
});