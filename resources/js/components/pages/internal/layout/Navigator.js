// IMPORTAÇÃO DOS COMPONENTES NATIVOS DO REACT
import { useRef } from "react";
// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import style from "./layout.module.css";
import { Link } from 'react-router-dom';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import * as React from 'react';
import Divider from '@mui/material/Divider';
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
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCardClip } from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@mui/material";

const categories = [
  {
    id: 'Menu de operações',
    children: [
      {
        id: 'Dashboard',
        icon: <DashboardIcon />,
        active: false,
        default_allowed_profiles: [1, 4, 3, 4, 5]
      },
      { id: 'Administração', icon: <AdminPanelSettingsIcon /> },
      { id: 'Ordens', icon: <AssignmentIcon /> },
      { id: 'Planos', icon: <MapIcon /> },
      { id: 'Relatórios', icon: <AssessmentIcon /> },
      { id: 'Incidentes', icon: <ReportIcon /> }
    ],
  },
  {
    id: 'Outros',
    children: [
      { id: 'Conta', icon: <AccountCircleIcon /> },
      { id: 'Configurações', icon: <SettingsIcon /> },
      { id: 'Suporte', icon: <HelpIcon /> },
    ],
  },
];

const item = {
  py: 0.8,
  px: 3,
  '&:hover, &:focus': {
    bgcolor: '#E3EEFA',
    color: '#2065D1',
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
  }
};

export const Navigator = React.memo((props) => {

  const { ...other } = props;
  const { AuthData } = useAuthentication();

  // Organização dos valores dos poderes do usuário
  // Cada item desses será acessado na função .map() 
  const userCategoriesAccess = useRef({
    dashboard: true,
    administracao: AuthData.data.user_powers["1"].profile_powers.ler == 1 ? true : false,
    planos: AuthData.data.user_powers["2"].profile_powers.ler == 1 ? true : false,
    ordens: AuthData.data.user_powers["3"].profile_powers.ler == 1 ? true : false,
    relatorios: AuthData.data.user_powers["4"].profile_powers.ler == 1 ? true : false,
    incidentes: AuthData.data.user_powers["5"].profile_powers.ler == 1 ? true : false,
    conta: AuthData.data.profile_id != 1,
    configuracoes: true,
    suporte: true
  });

  return (
    <Drawer {...other}>
      <List disablePadding>

        <ListItem sx={{ fontSize: 20, display: 'flex' }}>
          <Box sx={{ py: 2, borderRadius: 2, mr: 1, flexGrow: 1, textAlign: 'right' }}>
            SVG
          </Box>
          <Box sx={{ py: 2, borderRadius: 2, flexGrow: 1, textAlign: 'left' }}>
            ORBIO
          </Box>
        </ListItem>
        <Divider variant="middle" />

        <ListItem>
          <Box sx={{ py: 2, borderRadius: 2, flexGrow: 1, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faIdCardClip} color = {'#00713A'} /> <Typography sx={{ marginLeft: 1, fontWeight: 600 }}>Perfil: {AuthData.data.profile}</Typography>
          </Box>
        </ListItem>
        <Divider variant="middle" />

        {categories.map(({ id, children }) => (
          <Box key={id}>
            <ListItem>
              <ListItemText sx={{ color: "#222" }}><b>{id}</b></ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active }) => (
              (userCategoriesAccess.current[`${childId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`]) &&
              <ListItem key={childId}>
                <Link to={childId == "Dashboard" ? "/sistema" : (childId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))} className={style.navigator_navlink}>
                  <ListItemButton selected={active} sx={{ ...item }}>
                    <ListItemIcon sx={{ color: '#00713A' }}>{icon}</ListItemIcon>
                    <ListItemText sx={{ color: '#637381' }}>{childId}</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
            <Divider variant="middle" />
          </Box>
        ))}

      </List>

    </Drawer>
  );
});