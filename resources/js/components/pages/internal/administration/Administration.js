// React
import * as React from 'react';
// Material UI
import { Box } from "@mui/system";
import { Switcher } from "../../../shared/switcher/Switcher";
// Custom
import { Users } from './users/Users';
import { Profiles } from './profiles/Profiles';
import { usePage } from '../../../context/PageContext';


export function Administration() {

  const [actualPanel, setActualPanel] = React.useState("users");
  const { setPageIndex } = usePage();

  React.useEffect(() => {
    console.log('admin')
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
        {actualPanel == "users" ? <Users /> : <Profiles />}
      </Box>
    </>
  )
}