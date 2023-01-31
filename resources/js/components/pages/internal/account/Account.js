import * as React from 'react';
// Custom
import { BasicInformation } from './sections/BasicInformation';
import { ComplementaryInformation } from './sections/ComplementaryInformation';
import { AdditionalConfiguration } from './sections/AdditionalConfiguration';
import { Switcher } from "../../../shared/switcher/Switcher";
import { usePage } from '../../../context/PageContext';
// Material UI
import Paper from '@mui/material/Paper';
import { Grid } from "@mui/material";
import { Box } from "@mui/system";

export const Account = () => {

  // ============================================================================== STATES ============================================================================== //

  const [actualPanel, setActualPanel] = React.useState("basic");
  const { setPageIndex } = usePage();

  const options = [{ page: "basic", title: "básico", icon: "" }, { page: "complementary", title: "complementar", icon: "" }, { page: "account_configuration", title: "configurações" }];

  // ============================================================================== FUNCTIONS ============================================================================== //

  React.useEffect(() => {
    setPageIndex(8);
  }, []);

  // ============================================================================== JSX ============================================================================== //

  return (
    <>
      <Paper sx={{ maxWidth: '100%', margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            <Switcher panelStateSetter={setActualPanel} options={options} />
          </Grid>
        </Grid>
        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

          {(actualPanel === "basic") && <BasicInformation />}
          {(actualPanel === "complementary") && <ComplementaryInformation />}
          {(actualPanel === "account_configuration") && <AdditionalConfiguration />}

        </Box>
      </Paper>
    </>
  )
}