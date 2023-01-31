import * as React from 'react';
// Material UI
import { Drawer, List, Box, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MapIcon from '@mui/icons-material/Map';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
// Custom
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/Auth';
// Assets
import EmbrapaLogo from "../../../assets/images/Logos/Embrapa.png";

const item = {
  '&:hover, &:focus': {
    bgcolor: '#E3EEFA',
    color: '#2065D1',
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
  }
};

export const NavigatorToggle = React.memo((props) => {

  const { user } = useAuth();

  const categories = React.useMemo(() => ([
    {
      id: '',
      children: [
        {
          id: 'Dashboard',
          icon: <DashboardIcon />,
          active: false,
          access: true,
          path: ""
        },
      ],
    },
    {
      id: "Módulos",
      children: [
        { id: 'Administração', icon: <AdminPanelSettingsIcon />, access: user.data.user_powers["1"].profile_powers.read == 1 ? true : false, path: "administracao" },
        { id: 'Planos', icon: <MapIcon />, access: user.data.user_powers["2"].profile_powers.read == 1 ? true : false, path: "planos" },
        { id: 'Ordens', icon: <AssignmentIcon />, access: user.data.user_powers["3"].profile_powers.read == 1 ? true : false, path: "ordens" },
        { id: 'Relatórios', icon: <AssessmentIcon />, access: user.data.user_powers["4"].profile_powers.read == 1 ? true : false, path: "relatorios" },
        { id: 'Incidentes', icon: <ReportIcon />, access: user.data.user_powers["5"].profile_powers.read == 1 ? true : false, path: "incidentes" },
        { id: 'Equipamentos', icon: <HomeRepairServiceIcon />, access: user.data.user_powers["6"].profile_powers.read == 1 ? true : false, path: "equipamentos" }
      ]
    },
    {
      id: 'Outros',
      children: [
        { id: 'Conta', icon: <AccountCircleIcon />, access: true, path: "conta" }
      ],
    },
  ]), []);

  return (
    <Drawer {...props} sx={{ display: { xs: 'block', md: 'block', lg: 'none', xl: 'none' } }}>
      <List disablePadding>

        <ListItem sx={{ fontSize: 20, display: 'flex', justifyContent: 'center' }}>
          <img src={EmbrapaLogo} width={110} />
        </ListItem>

        {categories.map(({ id, children }) => (
          <Box key={id}>
            <ListItem>
              <ListItemText sx={{ color: "#222" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, access, path }) => (
              access &&
              <ListItem key={childId} disablePadding>
                <Link to={path} style={{ width: '100%', display: 'block' }}>
                  <ListItemButton selected={active} sx={item}>
                    <ListItemIcon sx={{ color: '#00713A' }}>{icon}</ListItemIcon>
                    <ListItemText sx={{ color: '#637381' }}>{childId}</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </Box>
        ))}
      </List>
    </Drawer>
  );
});