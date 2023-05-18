import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// MUI
import { Box, List, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material';
import { makeStyles } from '@mui/styles';
import MuiDrawer from '@mui/material/Drawer';
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

const useStyles = makeStyles((theme) => ({
    drawer: {
        "& .MuiDrawer-paper": { borderWidth: 0 },
        boxShadow: 1,
        zIndex: 1
    },
    listItem: {
        display: 'block',
    },
    listItemButton: {
        minHeight: 48,
        justifyContent: ({ open }) => (open ? 'initial' : 'center'),
        padding: '0 20px',
    },
    listItemIcon: {
        minWidth: 0,
        marginRight: ({ open }) => (open ? '24px' : 'auto'),
        justifyContent: 'center',
        color: '#A8A8A8',
    },
    listItemText: {
        opacity: ({ open }) => (open ? 1 : 0),
        color: '#000',
    },
}));

export function MenuDesktop() {

    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { user, logout } = useAuth();
    const classes = useStyles({ open });

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

    return (
        <Box flex>
            <DesktopHeader open={open} handleDrawerOpen={handleDrawerOpen} />
            <Drawer variant="permanent" open={open} className={classes.drawer}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon className='text-green-600' />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {categories.map(({ id, children }) =>
                        children.map(({ id: childId, icon, active, access, path }) =>
                            access && (
                                <ListItem key={childId} disablePadding className={classes.listItem}>
                                    <Link to={path} className="w-full block">
                                        <ListItemButton
                                            className={classes.listItemButton}
                                            selected={active}
                                        >
                                            <ListItemIcon className={classes.listItemIcon}>
                                                {icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={childId}
                                                className={classes.listItemText}
                                            />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            )
                        )
                    )}
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding className={classes.listItem}>
                        <ListItemButton
                            className={classes.listItemButton}
                            onClick={handleLogout}
                        >
                            <ListItemIcon className={classes.listItemIcon}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Sair"
                                className={classes.listItemText}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </Box >
    );
}
