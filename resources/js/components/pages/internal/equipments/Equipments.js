// React
import * as React from 'react';
// Custom
import { usePagination } from "../../../context/Pagination/PaginationContext";
// Material UI
import Paper from '@mui/material/Paper';
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Switcher } from "../../../structures/switcher/Switcher";
// Panels
import { DronesPanel } from './drones_panel/DronesPanel';
import { BatteriesPanel } from './batteries_panel/BatteriesPanel';
import { EquipmentPanel } from './equipments_panel/EquipmentsPanel';
// Fonts Awesome
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Equipments() {

  const [actualPanel, setActualPanel] = React.useState("drones");
  const { setActualPage } = usePagination();

  /*
  * Atualização do state global da página atual
  */
  React.useEffect(() => {

    setActualPage("DRONES E EQUIPAMENTOS");

  });

  return (

    <Paper sx={{ maxWidth: "95%", margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs>
          <Switcher panelStateSetter={setActualPanel} options={[{ page: "drones", title: "Drones", icon: '' }, { page: "batteries", title: "Baterias", icon: '' }, { page: "equipments", title: "Equipamentos", icon: '' }]} />
        </Grid>
      </Grid>
      <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

        {/* VARIAÇÃO DOS PAINÉIS - DE USUÁRIOS E PERFIS DE USUÁRIO */}
        {actualPanel == "drones" ? <DronesPanel /> : (actualPanel == "batteries" ? <BatteriesPanel /> : <EquipmentPanel />)}

      </Box>
    </Paper>
  )
}