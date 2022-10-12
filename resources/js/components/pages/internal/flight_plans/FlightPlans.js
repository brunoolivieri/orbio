
import * as React from 'react';
// Material UI
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
// Custom
import { FlightPlansPanel } from "./flight_plans_panel/FlightPlansPanel";
import { LogsPanel } from "./logs_panel/LogsPanel";
import { usePage } from '../../../context/PageContext';
import { Switcher } from '../../../structures/switcher/Switcher';

export const FlightPlans = React.memo(() => {

  const { setPageIndex } = usePage();
  const [actualPanel, setActualPanel] = React.useState("flight_plans");

  React.useEffect(() => {
    setPageIndex(2);
  }, []);

  return (
    <>

      <Paper sx={{ maxWidth: "100%", margin: 'auto', overflow: 'hidden', mb: 1, borderRadius: 5 }}>
        <Switcher
          panelStateSetter={setActualPanel}
          options={[
            { page: "flight_plans", title: "Planos de voo", icon: '' },
            { page: "logs", title: "Logs", icon: '' }
          ]}
        />
      </Paper>

      <Paper sx={{ maxWidth: "100%", margin: 'auto', overflow: 'hidden' }}>
        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

          {actualPanel === "flight_plans" ? <FlightPlansPanel /> : <LogsPanel />}

        </Box>
      </Paper>

    </>

  )

});