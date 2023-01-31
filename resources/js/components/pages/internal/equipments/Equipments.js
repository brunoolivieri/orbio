import * as React from 'react';
// Material UI
import { Paper, Box } from '@mui/material';
import { Switcher } from "../../../shared/switcher/Switcher";
// Panels
import { DronesPanel } from './drones_panel/DronesPanel';
import { BatteriesPanel } from './batteries_panel/BatteriesPanel';
import { EquipmentPanel } from './equipments_panel/EquipmentsPanel';
// Custom
import { usePage } from '../../../context/PageContext';

export const Equipments = () => {

  const [actualPanel, setActualPanel] = React.useState("drones");
  const { setPageIndex } = usePage();

  React.useEffect(() => {
    setPageIndex(6);
  }, []);

  return (
    <>
      <Paper sx={{ maxWidth: "100%", margin: 'auto', overflow: 'hidden', mb: 1, borderRadius: 5 }}>
        <Switcher panelStateSetter={setActualPanel} options={[{ page: "drones", title: "Drones", icon: '' }, { page: "batteries", title: "Baterias", icon: '' }, { page: "equipments", title: "Equipamentos", icon: '' }]} />
      </Paper>

      <Paper sx={{ maxWidth: "100%", margin: 'auto', overflow: 'hidden' }}>
        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

          {actualPanel == "drones" ? <DronesPanel /> : (actualPanel == "batteries" ? <BatteriesPanel /> : <EquipmentPanel />)}

        </Box>
      </Paper>
    </>
  )
}