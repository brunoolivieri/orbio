import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// MUI
import { Box, List, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MapIcon from '@mui/icons-material/Map';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSnackbar } from 'notistack';
// Custom
import { useAuth } from '../../context/Auth';
import { DesktopHeader } from './DesktopHeader';

const drawerWidth = 210;

const drawerStyle = {
    "& .MuiDrawer-paper": { borderWidth: 0 },
    boxShadow: 2,
    zIndex: 1
}

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export function MenuDesktop() {

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { user, logout } = useAuth();
    const [open, setOpen] = React.useState(false);

    const categories = [
        {
            id: '',
            children: [
                {
                    id: 'Dashboard',
                    icon: <DashboardIcon />,
                    active: false,
                    access: true,
                    path: "/dashboard"
                },
            ],
        },
        {
            id: "Módulos",
            children: [
                { id: 'Administração', icon: <AdminPanelSettingsIcon />, access: user.user_powers["1"].profile_powers.read == 1, path: "/administracao" },
                { id: 'Planos e Logs', icon: <MapIcon />, access: user.user_powers["2"].profile_powers.read == 1, path: "/planos" },
                { id: 'Ordens', icon: <AssignmentIcon />, access: user.user_powers["3"].profile_powers.read == 1, path: "/ordens" },
                { id: 'Relatórios', icon: <AssessmentIcon />, access: user.user_powers["4"].profile_powers.read == 1, path: "/relatorios" },
                { id: 'Equipamentos', icon: <HomeRepairServiceIcon />, access: user.user_powers["5"].profile_powers.read == 1, path: "/equipamentos" }
            ]
        },
        {
            id: 'Outros',
            children: [
                { id: 'Conta', icon: <AccountCircleIcon />, access: true, path: "/conta" }
            ],
        },
    ];

    async function handleLogout() {
        try {
            await logout();
            enqueueSnackbar("Sessão finalizada", { variant: "success" });
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1000);
        } catch (e) {
            console.log(e);
            enqueueSnackbar(e.response.data.message, { variant: "error" });
        }
    }

    function handleDrawerOpen() {
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
    }

    function handleToggleTheme() {
        document.body.classList.toggle("dark");
    }

    return (
        <Box sx={{ display: { xs: 'none', md: 'none', lg: 'flex', xl: 'flex' } }}>
            <DesktopHeader open={open} handleDrawerOpen={handleDrawerOpen} />
            <Drawer variant="permanent" open={open} sx={drawerStyle}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon className='text-green-600' />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {categories.map(({ id, children }) => (
                        children.map(({ id: childId, icon, active, access, path }) => (
                            access &&

                            <ListItem key={childId} disablePadding className='block'>
                                <Link to={path} className='w-full block'>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                        selected={active}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                                color: '#007937'
                                            }}
                                        >
                                            {icon}
                                        </ListItemIcon>
                                        <ListItemText primary={childId} sx={{ opacity: open ? 1 : 0, color: '#000' }} />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        ))
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={handleLogout}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: '#007937'
                                }}
                            >
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Sair"} sx={{ opacity: open ? 1 : 0, color: '#000' }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </Box >
    );
}