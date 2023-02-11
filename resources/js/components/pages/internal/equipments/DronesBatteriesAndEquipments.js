import * as React from 'react';
// Material UI
import { Box } from '@mui/material';
import { Switcher } from "../../../shared/switcher/Switcher";
// Panels
import { Drones } from './drones/Drones';
import { Batteries } from './batteries/Batteries';
import { Equipments } from './equipments/Equipments';
// Custom
import { usePage } from '../../../context/PageContext';

export function DronesBatteriesAndEquipments() {

  const [actualPanel, setActualPanel] = React.useState("drones");
  const { setPageIndex } = usePage();

  React.useEffect(() => {
    setPageIndex(5);
  }, []);

  return (
    <>
      <Switcher panelStateSetter={setActualPanel} options={[{ page: "drones", title: "Drones", icon: '' }, { page: "batteries", title: "Baterias", icon: '' }, { page: "equipments", title: "Equipamentos", icon: '' }]} />
      <Box sx={{ my: 3, mx: 2 }} color="text.secondary">
        {actualPanel == "drones" ? <Drones /> : (actualPanel == "batteries" ? <Batteries /> : <Equipments />)}
      </Box>
    </>
  )
}