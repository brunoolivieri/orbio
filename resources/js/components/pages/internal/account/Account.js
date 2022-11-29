// React
import * as React from 'react';
// Custom
import { BasicDataPanel } from "./basic_data_panel/BasicDataPanel";
import { ComplementaryDataPanel } from "./complementary_data_panel/ComplementaryDataPanel";
import { AccountConfiguration } from './account_configuration/AccountConfiguration';
import { Switcher } from "../../../structures/switcher/Switcher";
import { usePage } from '../../../context/PageContext';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
// Material UI
import Paper from '@mui/material/Paper';
import { Grid } from "@mui/material";
import { Box } from "@mui/system";

export const Account = () => {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [actualPanel, setActualPanel] = React.useState("basic");
  const { setPageIndex } = usePage();

  const options = AuthData.data.profile_id != 1 ? 
  [{ page: "basic", title: "básico", icon: "" }, { page: "complementary", title: "complementar", icon: "" }, { page: "account_configuration", title: "configurações" }] 
  : [{ page: "basic", title: "básico", icon: "" }, { page: "account_configuration", title: "configurações" }];

  // ============================================================================== FUNCTIONS ============================================================================== //

  React.useEffect(() => {
    setPageIndex(8);
  }, []);

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Paper sx={{ maxWidth: '100%', margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            <Switcher panelStateSetter={setActualPanel} options={options} />
          </Grid>
        </Grid>

        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

          {(actualPanel === "basic") && <BasicDataPanel />}
          {(actualPanel === "complementary" && AuthData.data.profile_id != 1) && <ComplementaryDataPanel />}
          {(actualPanel === "account_configuration") && <AccountConfiguration />}

        </Box>

      </Paper>
    </>






  )
}