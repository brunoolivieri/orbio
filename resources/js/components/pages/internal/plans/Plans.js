// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState, useEffect } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { useAuthentication } from "../../../context/InternalRoutesAuth/AuthenticationContext";
import style from "./plans.module.css";

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GetAppIcon from '@mui/icons-material/GetApp';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Box } from "@mui/system";
import MapIcon from '@mui/icons-material/Map';

export function Plans(){

    // Utilizador do contexto/state global de Autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // Atualização do state global da páginação 
    const {actualPage, setActualPage}= usePagination();

    const [newPlanMode, setNewPlanMode] = useState();

    /*
    * Atualização do state global da página atual
    */
    useEffect(() => {
      
      setActualPage("PLANOS DE VÔO");
  
    })

    return(
        <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden' }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SearchIcon color="inherit" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Pesquisar plano"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 'default' },
                }}
                variant="standard"
              />
            </Grid>
            <Grid item>
            <Tooltip title="Novo plano">
              <IconButton variant="contained" sx={{ mr: 1 }}>
                <a href = "/sistema/mapa/novo-plano" className={style.new_map_link}><AddCircleOutlineIcon /></a>
              </IconButton>
            </Tooltip>
            <Tooltip title="Importar plano">
              <IconButton variant="contained" sx={{ mr: 1 }}>
                <FileUploadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Baixar plano">
              <IconButton variant="contained" sx={{ mr: 1 }}>
                <GetAppIcon />
              </IconButton>
            </Tooltip>
              <Tooltip title="Reload">
                <IconButton>
                  <RefreshIcon color="inherit" sx={{ display: 'block' }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box sx={{ my: 5, mx: 2 }} color="text.secondary">

         PLANS TABLE

     </Box>
    </Paper>
    )
}