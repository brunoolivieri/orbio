// IMPORTAÇÃO DOS COMPONENTES DO REACT
import { useEffect, useState } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { UsersPanel } from "./users_panel/UsersPanel";
import { ProfilesPanel } from "./profiles_panel/ProfilesPanel";

// IMPORTAÇÃO DOS COMPONENTES PARA O MATERIAL UI
import Paper from '@mui/material/Paper';
import { AppBar } from "@mui/material";
import { Toolbar } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { SwitchPanelAdmin } from "../../../structures/modules/administration/switch_panel/SwitchPanelAdmin";

export function AdministrationPanel(){

    // Utilizador do state global da páginação 
    const {actualPage, setActualPage}= usePagination();

    // State para alternância do painel de administrador
    const [actualPanel, setActualPanel] = useState("users");

    /*
    * Atualização do state global da página atual
    */
    useEffect(() => {
      
      setActualPage("PAINEL DE ADMINISTRAÇÃO");

    }, [])
    
    return(
      <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: "10px" }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >  
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            {/* Cabeçalho do painel principal - botões para alternância dos paineis */}
            <SwitchPanelAdmin panelStateSetter = {setActualPanel} />
          </Grid>
        </Grid>
      </AppBar>
      <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

        {/* VARIAÇÃO DOS PAINÉIS - DE USUÁRIOS E PERFIS DE USUÁRIO */}
        {actualPanel == "users" ? <UsersPanel /> : <ProfilesPanel />}
        
      </Box>
    </Paper>
    )
}