// React
import * as React from 'react';
// Custom
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { UsersPanel } from "./users_panel/UsersPanel";
import { ProfilesPanel } from "./profiles_panel/ProfilesPanel";
// Material UI
import Paper from '@mui/material/Paper';
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Switcher } from "../../../structures/switcher/Switcher";
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faIdCardClip } from '@fortawesome/free-solid-svg-icons';

export function AdministrationPanel() {

  const { setActualPage } = usePagination();

  const [actualPanel, setActualPanel] = React.useState("users");

  React.useEffect(() => {

    setActualPage("PAINEL DE ADMINISTRAÇÃO");

  }, []);

  return (
    <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: "10px" }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs>
          {/* Cabeçalho do painel principal - botões para alternância dos paineis */}
          <Switcher panelStateSetter={setActualPanel} options={[{ page: "users", title: "Gerenciamento dos usuários", icon: <FontAwesomeIcon icon={faUsers} /> }, { page: "profiles", title: "Gerenciamento dos perfis", icon: <FontAwesomeIcon icon={faIdCardClip} /> }]} />
        </Grid>
      </Grid>
      <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

        {/* VARIAÇÃO DOS PAINÉIS - DE USUÁRIOS E PERFIS DE USUÁRIO */}
        {actualPanel == "users" ? <UsersPanel /> : <ProfilesPanel />}

      </Box>
    </Paper>
  )
}