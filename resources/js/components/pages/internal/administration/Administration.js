// React
import * as React from 'react';
// Custom
import { UsersPanel } from "./users_panel/UsersPanel";
import { ProfilesPanel } from "./profiles_panel/ProfilesPanel";
import { usePage } from '../../../context/PageContext';
// Material UI
import Paper from '@mui/material/Paper';
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Switcher } from "../../../structures/switcher/Switcher";
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faIdCardClip } from '@fortawesome/free-solid-svg-icons';

const item = {
  '&:hover, &:focus': {
    bgcolor: '#E3EEFA',
    color: '#2065D1',
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
  }
};

export const Administration = React.memo(() => {

  const [actualPanel, setActualPanel] = React.useState("users");
  // Context page
  const { setPageIndex } = usePage();

  React.useEffect(() => {
    setPageIndex(1);
  }, []);

  return (
    <>

      <Paper sx={{ maxWidth: "100%", margin: 'auto', overflow: 'hidden', mb: 1, borderRadius: 5 }}>
        <Switcher
          panelStateSetter={setActualPanel}
          options={[
            { page: "users", title: "Usuários", icon: <FontAwesomeIcon icon={faUsers} /> },
            { page: "profiles", title: "Perfis", icon: <FontAwesomeIcon icon={faIdCardClip} /> }
          ]}
        />
      </Paper>

      <Paper sx={{ maxWidth: "100%", margin: 'auto', overflow: 'hidden' }}>
        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

          {/* VARIAÇÃO DOS PAINÉIS - DE USUÁRIOS E PERFIS DE USUÁRIO */}
          {actualPanel == "users" ? <UsersPanel /> : <ProfilesPanel />}

        </Box>
      </Paper>

    </>
  )

});