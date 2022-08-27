// React
import * as React from 'react';
// Material UI
import Paper from '@mui/material/Paper';
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Switcher } from "../../../structures/switcher/Switcher";
// Panels
import { DronesPanel } from './drones_panel/DronesPanel';
import { BatteriesPanel } from './batteries_panel/BatteriesPanel';
import { EquipmentPanel } from './equipments_panel/EquipmentsPanel';
// Context
import { usePage } from '../../../context/PageContext';

export const Equipments = React.memo(() => {

  const [actualPanel, setActualPanel] = React.useState("drones");

  const { setPage } = usePage();

  React.useEffect(() => {
    setPage("DRONES, BATERIAS E EQUIPAMENTOS");
  }, []);

  return (
    <>
      <Paper sx={{ maxWidth: "95%", margin: 'auto', overflow: 'hidden', borderRadius: 5, mb: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            <Switcher panelStateSetter={setActualPanel} options={[{ page: "drones", title: "Drones", icon: '' }, { page: "batteries", title: "Baterias", icon: '' }, { page: "equipments", title: "Equipamentos", icon: '' }]} />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ maxWidth: "95%", margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

          {/* VARIAÇÃO DOS PAINÉIS - DE USUÁRIOS E PERFIS DE USUÁRIO */}
          {actualPanel == "drones" ? <DronesPanel /> : (actualPanel == "batteries" ? <BatteriesPanel /> : <EquipmentPanel />)}

        </Box>
      </Paper>
    </>
  )
});