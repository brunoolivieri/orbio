// IMPORTAÇÃO DOS COMPONENTES REACT
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { useEffect } from "react";

export function Configurations(){

    const {actualPage, setActualPage}= usePagination();

    /*
    * Atualização do state global da página atual
    */
    useEffect(() => {

      setActualPage("CONFIGURAÇÕES");
  
    })

    

    return(
        <Paper sx={{ maxWidth: 1300, margin: 'auto', overflow: 'hidden' }}>
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
              <Button variant="contained" sx={{ mr: 1 }}>
                Salvar configurações
              </Button>
              { /* <Tooltip title="Reload">
                <IconButton>
                  <RefreshIcon color="inherit" sx={{ display: 'block' }} />
                </IconButton>
              </Tooltip> */}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">

        CONFIGURAÇÕES

      </Typography>
    </Paper>
    )
}