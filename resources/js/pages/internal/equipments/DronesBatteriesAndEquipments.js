import * as React from 'react';
// Material UI
import { Box } from '@mui/material';
// Custom
import { Drones } from './drones/Drones';
import { Batteries } from './batteries/Batteries';
import { Equipments } from './equipments/Equipments';
import { Switcher } from "../../../components/switcher/Switcher";
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
      <Box className="my-3 mx-2 h-full">
        {actualPanel == "drones" ? <Drones /> : (actualPanel == "batteries" ? <Batteries /> : <Equipments />)}
      </Box>
    </>
  )
}