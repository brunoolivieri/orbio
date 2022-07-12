// React
import * as React from 'react';
// Custom
import { BasicDataPanel } from "./basic_data_panel/BasicDataPanel";
import { ComplementaryDataPanel } from "./complementary_data_panel/ComplementaryDataPanel";
import { AccountConfiguration } from './account_configuration/AccountConfiguration';
import { Switcher } from "../../../structures/switcher/Switcher";
// Material UI
import Paper from '@mui/material/Paper';
import { Grid } from "@mui/material";
import { Box } from "@mui/system";

export function Account({ ...props }) {

  // ============================================================================== STATES ============================================================================== //

  const [actualPanel, setActualPanel] = React.useState("basic");

  // ============================================================================== FUNCTIONS ============================================================================== //

  React.useEffect(() => {
    props.setPage("MINHA CONTA");
  }, []);

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Paper sx={{ maxWidth: '95%', margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            <Switcher panelStateSetter={setActualPanel} options={[{ page: "basic", title: "básico", icon: "" }, { page: "complementary", title: "complementar", icon: "" }, { page: "account_configuration", title: "configurações" }]} />
          </Grid>
        </Grid>

        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

          {(actualPanel === "basic") && <BasicDataPanel />}
          {(actualPanel === "complementary") && <ComplementaryDataPanel />}
          {(actualPanel === "account_configuration") && <AccountConfiguration />}

        </Box>

      </Paper>
    </>






  )
}