import * as React from 'react';
import { Box } from "@mui/system";
import { Users } from './users/Users';
import { Profiles } from './profiles/Profiles';
import { Switcher } from "../../../components/switcher/Switcher";
import { usePage } from '../../../context/PageContext';

export function Administration() {

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
      <Box sx={{ my: 3, mx: 2, height: '100%' }} color="text.secondary">
        {actualPanel == "users" ? <Users /> : <Profiles />}
      </Box>
    </>
  )
}