// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { useAuthentication } from "../../../context/InternalRoutesAuth/AuthenticationContext";

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box } from "@mui/system";
import PostAddIcon from '@mui/icons-material/PostAdd';
import GetAppIcon from '@mui/icons-material/GetApp';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AssessmentIcon from '@mui/icons-material/Assessment';

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

        <Paper sx={{ maxWidth: 1500, margin: 'auto', overflow: 'hidden' }}>
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
                placeholder="Pesquisar"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 'default' },
                }}
                variant="standard"
              />
            </Grid>
            <Grid item>
              {AuthData.data.access > 1 ? 
              <Tooltip title="Novo relatório">
                <IconButton variant="contained" sx={{ mr: 1 }} >
                  <PostAddIcon />
                </IconButton>
              </Tooltip>
               : ""}
               <Tooltip title="Baixar relatório">
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

      PAINEL DE RELATÓRIOS

      </Box>
    </Paper>
    )
}