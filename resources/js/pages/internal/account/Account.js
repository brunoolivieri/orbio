import * as React from 'react';
// Material UI
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
// Custom
import { BasicInformation } from './sections/BasicInformation';
import { AdditionalConfiguration } from './sections/AdditionalConfiguration';
import { Switcher } from '../../../components/switcher/Switcher';
import { usePage } from '../../../context/PageContext';

export const Account = () => {

  // ============================================================================== STATES ============================================================================== //

  const [actualPanel, setActualPanel] = React.useState("basic");
  const { setPageIndex } = usePage();

  const options = [{ page: "basic", title: "Informações", icon: "" }, { page: "account_configuration", title: "configurações" }];

  // ============================================================================== FUNCTIONS ============================================================================== //

  React.useEffect(() => {
    setPageIndex(6);
  }, []);

  // ============================================================================== JSX ============================================================================== //

  return (
    <>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs>
          <Switcher panelStateSetter={setActualPanel} options={options} />
        </Grid>
      </Grid>
      <Box className="my-3 mx-2 h-full">

        {(actualPanel === "basic") && <BasicInformation />}
        {(actualPanel === "account_configuration") && <AdditionalConfiguration />}

      </Box>
    </>
  )
}