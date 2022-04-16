// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { useAuthentication } from "../../../context/InternalRoutesAuth/AuthenticationContext";
import { ReportsPanel } from "./reports_panel/ReportsPanel";

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Box } from "@mui/system";
import PostAddIcon from '@mui/icons-material/PostAdd';

export function Reports(){

    // Atualização do state global da páginação
    const {actualPage, setActualPage}= usePagination();

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    /*
    * Atualização do state global da página atual
    */
    useEffect(() => {
      
      setActualPage("RELATÓRIOS");

      // AXIOS PARA RECUPERAR RELATÓRIOS VINCULADOS AO USUÁRIOS
  
    })

    return(
      <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: "10px" }}>
        <Box sx={{ my: 5, mx: 2 }} color="text.secondary">

          <ReportsPanel />

        </Box>
      </Paper>
    )
}