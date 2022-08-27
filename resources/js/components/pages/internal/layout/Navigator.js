// React
import * as React from 'react';
// Custom
import { Link } from 'react-router-dom';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
// Material UI
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MapIcon from '@mui/icons-material/Map';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HelpIcon from '@mui/icons-material/Help';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCardClip } from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@mui/material";
// Assets
import EmbrapaLogo from "../../../assets/images/Logos/Embrapa.png";

const item = {
  borderRadius: 2,
  '&:hover, &:focus': {
    bgcolor: '#E3EEFA',
    color: '#2065D1',
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
  }
};

export const Navigator = React.memo((props) => {

  const { AuthData } = useAuthentication();

  const categories = React.useMemo(() => ([
    {
      id: 'Menu',
      children: [
        {
          id: 'Dashboard',
          icon: <DashboardIcon />,
          active: false,
          access: true
        },
        { id: 'Administração', icon: <AdminPanelSettingsIcon />, access: AuthData.data.user_powers["1"].profile_powers.read == 1 ? true : false },
        { id: 'Planos', icon: <MapIcon />, access: AuthData.data.user_powers["2"].profile_powers.read == 1 ? true : false },
        { id: 'Ordens', icon: <AssignmentIcon />, access: AuthData.data.user_powers["3"].profile_powers.read == 1 ? true : false },
        { id: 'Relatórios', icon: <AssessmentIcon />, access: AuthData.data.user_powers["4"].profile_powers.read == 1 ? true : false },
        { id: 'Incidentes', icon: <ReportIcon />, access: AuthData.data.user_powers["5"].profile_powers.read == 1 ? true : false },
        { id: 'Equipamentos', icon: <HomeRepairServiceIcon />, access: AuthData.data.user_powers["6"].profile_powers.read == 1 ? true : false }
      ],
    },
    {
      id: 'Outros',
      children: [
        { id: 'Conta', icon: <AccountCircleIcon />, access: AuthData.data.profile_id != 1 ? true : false },
        { id: 'Configurações', icon: <SettingsIcon />, access: true },
        { id: 'Suporte', icon: <HelpIcon />, access: true },
      ],
    },
  ]), []);

  return (
    <Drawer {...props}>
      <List disablePadding>

        <ListItem sx={{ fontSize: 20, display: 'flex', justifyContent: 'center' }}>
          <img src={EmbrapaLogo} width={110} />
          { /* <Box sx={{ py: 2, borderRadius: 2, mr: 1, flexGrow: 1, textAlign: 'right' }}>
          </Box>
          <Box sx={{ py: 2, borderRadius: 2, flexGrow: 1, textAlign: 'left' }}>
          </Box> */}
        </ListItem>

        <ListItem sx={{ boxShadow: 2, mb: 1 }}>
          <Box sx={{ py: 2, borderRadius: 2, flexGrow: 1, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faIdCardClip} color={'#00713A'} /> <Typography sx={{ marginLeft: 1, fontWeight: 600 }}>{AuthData.data.profile}</Typography>
          </Box>
        </ListItem>

        {categories.map(({ id, children }) => (
          <Box key={id}>
            <ListItem>
              <ListItemText sx={{ color: "#222" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, access }) => (
              access &&
              <ListItem key={childId} disablePadding>
                <Link to={childId == "Dashboard" ? "/internal" : (childId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))} style={{ width: '100%', display: 'block' }}>
                  <ListItemButton selected={active} sx={{ ...item }}>
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