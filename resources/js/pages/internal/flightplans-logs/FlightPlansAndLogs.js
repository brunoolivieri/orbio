
import * as React from 'react';
// Material UI
import { Box } from '@mui/material';
// Custom
import { FlightPlans } from './flight_plans/FlightPlans';
import { Logs } from './logs/Logs';
import { usePage } from '../../../context/PageContext';
import { Switcher } from '../../../components/switcher/Switcher';

export function FlightPlansAndLogs() {

  const { setPageIndex } = usePage();
  const [actualPanel, setActualPanel] = React.useState("flight_plans");

  React.useEffect(() => {
    setPageIndex(2);
  }, []);

  return (
    <>
      <Switcher
        panelStateSetter={setActualPanel}
        options={[
          { page: "flight_plans", title: "Planos de voo", icon: '' },
          { page: "logs", title: "Logs", icon: '' }
        ]}
      />
      <Box sx={{ my: 3, mx: 2 }} color="text.secondary">
        {actualPanel === "flight_plans" ? <FlightPlans /> : <Logs />}
      </Box>
    </>
  )
}