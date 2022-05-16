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

export function Administration() {

  const { setActualPage } = usePagination();
  const [actualPanel, setActualPanel] = React.useState("users");

  React.useEffect(() => {

    setActualPage("ADMINISTRAÇÃO");

  }, []);

  return (
    <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: "10px" }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs>
          <Switcher panelStateSetter={setActualPanel} options={[{ page: "users", title: "Usuários", icon: <FontAwesomeIcon icon={faUsers} /> }, { page: "profiles", title: "Perfis", icon: <FontAwesomeIcon icon={faIdCardClip} /> }]} />
        </Grid>
      </Grid>
      <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

        {/* VARIAÇÃO DOS PAINÉIS - DE USUÁRIOS E PERFIS DE USUÁRIO */}
        {actualPanel == "users" ? <UsersPanel /> : <ProfilesPanel />}

      </Box>
    </Paper>
  )
}