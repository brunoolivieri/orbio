// React
import * as React from 'react';
// Custom
import { UsersPanel } from "./users_panel/UsersPanel";
import { ProfilesPanel } from "./profiles_panel/ProfilesPanel";
import { usePage } from '../../../context/PageContext';
// Material UI
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";
import { Switcher } from "../../../shared/switcher/Switcher";

export const Administration = () => {

  const [actualPanel, setActualPanel] = React.useState("users");
  const { setPageIndex } = usePage();

  React.useEffect(() => {
    setPageIndex(1);
  }, []);

  return (
    <>
      <Switcher
        panelStateSetter={setActualPanel}
        options={[
          { page: "users", title: "Usuários", icon: "" },
          { page: "profiles", title: "Perfis", icon: "" }
        ]}
      />
      <Box sx={{ my: 3, mx: 2 }} color="text.secondary">
        {actualPanel == "users" ? <UsersPanel /> : <ProfilesPanel />}
      </Box>
    </>
  )
}