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
import HelpIcon from '@mui/icons-material/Help';

export function Support(){

    // Atualização do state global da páginação
    const {actualPage, setActualPage}= usePagination();

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    /*
    * Atualização do state global da página atual
    */
    useEffect(() => {
      
      setActualPage("SUPORTE AO USUÁRIO");

      // AXIOS PARA RECUPERAR RELATÓRIOS VINCULADOS AO USUÁRIOS
  
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
                placeholder="Pesquisar"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 'default' },
                }}
                variant="standard"
              />
            </Grid>
            <Grid item>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">

        PÁGINA DE SUPORTE AO USUÁRIO

      </Typography>
    </Paper>
    )
}