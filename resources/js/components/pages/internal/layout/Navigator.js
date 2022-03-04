// IMPORTAÇÃO DOS COMPONENTES NATIVOS DO REACT
import { useRef } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import layoutStyle from "./layout.module.css";
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
import { makeStyles } from "@mui/styles";

const categories = [
  {
    id: 'Menu de operações',
    children: [
      {
        id: 'Dashboard',
        icon: <DashboardIcon />,
        active: false,
        default_allowed_profiles: [1, 4, 3, 4]
      },
      { id: 'Administração', icon: <AdminPanelSettingsIcon />, default_allowed_profiles: [1, 2]},
      { id: 'Ordens', icon: <AssignmentIcon />, default_allowed_profiles: [1, 2, 3]},
      { id: 'Planos', icon: <MapIcon />, default_allowed_profiles: [1, 2, 3]},
      { id: 'Relatórios', icon: <AssessmentIcon />, default_allowed_profiles: [1, 2]}
    ],
  },
  {
    id: 'Outros',
    children: [
      { id: 'Conta', icon: <AccountCircleIcon />, default_allowed_profiles: [2, 3, 4] },
      { id: 'Configurações', icon: <SettingsIcon />, default_allowed_profiles: [1, 4, 3, 4] },
      { id: 'Suporte', icon: <HelpIcon />, default_allowed_profiles: [1, 4, 3, 4] },
    ],
  },
];

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

const useStyles = makeStyles((theme) => ({
  nav_background: {
    backgroundColor: '#081627'
  }
}))

export default function Navigator(props) {
  const { ...other } = props;

  // Utilizador do contexto/state global de Autenticação
  const {AuthData, setAuthData} = useAuthentication();

  // Organização dos valores dos poderes do usuário
  // Estrutura previamente adaptada à lógica da renderização do menu
  // Cada um desses atributos será acessado a partir do valor do ID do item do menu recuperado na função .map() com "childID" 
  // Por exemplo, quando "childID" for "Administração" o valor recuperado será refUserPowers["administracao"] - a codificação é alterada para coincidir um com outro
  const refUserPowers = useRef({
    administracao: AuthData.data.user_powers["1"].profile_powers.ler == 1 ? true : false,
    ordens: AuthData.data.user_powers["2"].profile_powers.ler == 1 ? true : false,
    planos: AuthData.data.user_powers["3"].profile_powers.ler == 1 ? true : false,
    relatorios: AuthData.data.user_powers["4"].profile_powers.ler == 1 ? true : false
  });

  //console.log(refUserPowers.current[`${"Administração".toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`])

  // Classes do objeto makeStyles
  const classes = useStyles();

  /*

  - Geração do menu
  - categories.map() produz os menus em si - o superior e o inferior
  - children.map() produz as opções de cada menu
  - Antes da geração da opção existe o filtro do valor do acesso
    - Se o valor do acesso do state global é igual ou maior do que o valor de acesso necessário para gerar a opção, ela será gerado
    - Lembrando que a lógica do valor do acesso é: quanto maior, maior o acesso (3 - admin; 2 - piloto; 1 - cliente; 0 - usuário)

  */

  return (
    <Drawer {...other}
    PaperProps={{ sx: { backgroundColor: "#081627" }}}
    >

      <List disablePadding className={classes.nav_background}>
        
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 20, color: '#fff' }}>
          NOME DO SISTEMA
        </ListItem>
        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemText>{AuthData.data.profile} - {AuthData.data.name}</ListItemText>
        </ListItem>

        {categories.map(({ id, children }) => ( 
          <Box key={id} sx={{ bgcolor: '#101F33'}}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>

            {/* Geração do menu de opções com base no perfil do usuário (nível de acesso) */}
            {children.map(({ id: childId, icon, active, default_allowed_profiles }) => (
                (default_allowed_profiles.includes(AuthData.data.general_access) || (refUserPowers.current[`${childId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`])) ?
                <ListItem disablePadding key={childId}>

                  {/* O nome da página, na barra de navegação, é utilizada também no nome da rota, e por isso deve ser adaptada */}
                <Link to = {childId == "Dashboard" ? "/sistema" : (childId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))} className = {layoutStyle.navigator_navlink}>
                  <ListItemButton selected={active} sx={item}>
                    <ListItemIcon sx={{color: "#fff"}}>{icon}</ListItemIcon>
                    <ListItemText sx={{color: "#fff"}}>{childId}</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem> : ""
              
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}

        {/* <Box height={"480px"} backgroundColor="#081627">
        </Box> */}

      </List>

    </Drawer>
  );
}