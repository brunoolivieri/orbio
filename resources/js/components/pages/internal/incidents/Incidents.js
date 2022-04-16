// IMPORTAÇÃO DOS COMPONENTES DO MATERIAL UI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

// IMPORTAÇÃO DOS COMPONENTES PERSONALIZADOS
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { useEffect } from "react";
import { IncidentsPanel } from './incidents_panel/IncidentsPanel';

export function Incidents(){

  // Atualização do state global da páginação 
  const {actualPage, setActualPage}= usePagination();

  /*
  * Atualização do state global da página atual
  */
  useEffect(() => {

    setActualPage("INCIDENTES");

  })

  return(
        <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: "10px" }}>
        <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">

          <IncidentsPanel />

        </Typography>
    </Paper>
    )
}