// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { PlansPanel } from "./plans_panel/PlansPanel";

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";

export function Plans(){

    // Atualização do state global da páginação 
    const {actualPage, setActualPage}= usePagination();

    /*
    * Atualização do state global da página atual
    */
    useEffect(() => {
      
      setActualPage("PLANOS DE VÔO");
  
    },[])

    return(
      <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: "10px" }}>
        <Box sx={{ my: 5, mx: 2 }} color="text.secondary">

          <PlansPanel />

        </Box>
      </Paper>
    )
}